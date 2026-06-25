// ============================================================
//  Admin panel logic — Firebase Auth + Firestore CRUD
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { firebaseConfig, isConfigured } from "./firebase-config.js";

// --- Field definitions per collection ---
const SCHEMAS = {
  education: {
    label: "Education",
    icon: "fa-graduation-cap",
    fields: [
      { name: "degree", label: "Degree / Title", type: "text", required: true },
      { name: "place", label: "Institution", type: "text" },
      { name: "year", label: "Year (e.g. 2022 - 2025)", type: "text" },
      { name: "detail", label: "Detail (CGPA / note)", type: "text" },
    ],
    title: (d) => d.degree,
  },
  experience: {
    label: "Experience",
    icon: "fa-briefcase",
    fields: [
      { name: "role", label: "Role / Title", type: "text", required: true },
      { name: "place", label: "Organization", type: "text" },
      { name: "year", label: "Period (e.g. Jan 2026 - Present)", type: "text" },
      { name: "points", label: "Bullet points (one per line)", type: "textarea", list: true },
    ],
    title: (d) => d.role,
  },
  achievements: {
    label: "Achievements",
    icon: "fa-award",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "detail", label: "Detail", type: "text" },
      { name: "year", label: "Year (e.g. Fall 2024)", type: "text" },
    ],
    title: (d) => d.title,
  },
  research: {
    label: "Research",
    icon: "fa-flask",
    fields: [
      { name: "title", label: "Paper Title", type: "textarea", required: true },
      { name: "venue", label: "Venue / Description", type: "textarea" },
      { name: "status", label: "Status tag (e.g. Accepted)", type: "text" },
    ],
    title: (d) => d.title,
  },
  projects: {
    label: "Projects",
    icon: "fa-laptop-code",
    fields: [
      { name: "title", label: "Project Name", type: "text", required: true },
      { name: "tag", label: "Tag (e.g. Web App)", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "linkUrl", label: "Link URL (https://...)", type: "text" },
      { name: "linkText", label: "Link text (e.g. Live Demo)", type: "text" },
    ],
    title: (d) => d.title,
  },
};

// --- Seed data = the current website content ---
const SEED = {
  education: [
    { degree: "M.Sc. in Computer Science and Engineering (CSE)", place: "Daffodil International University, Dhaka", year: "2026 - Present", detail: "Expected Graduation: May 2027" },
    { degree: "B.Sc. in Computer Science and Engineering (CSE)", place: "Daffodil International University, Dhaka", year: "2022 - 2025", detail: "CGPA: 3.94 (Out of 4.00)" },
    { degree: "Higher Secondary Certificate (HSC), Science", place: "Cumilla Govt. City College, Cumilla", year: "2017 - 2018", detail: "GPA: 5.00 (Out of 5.00)" },
    { degree: "Secondary School Certificate (SSC), Science", place: "Bijoypur High School, Cumilla", year: "2015 - 2016", detail: "GPA: 5.00 (Out of 5.00)" },
  ],
  experience: [
    { role: "Research Assistant, Department of Business Administration", place: "Daffodil International University (under Dr. Md. Azizur Rahman)", year: "January 2026 - Present", points: ["Assisted in proposing a research grant project under the HEAT UGC Academic Transformation Fund (ATF).", "Presented a research study on Bangladesh Railway ticket scalping to Bangladesh Railway officials."] },
    { role: "Research Assistant, NLP & ML Research Lab", place: "Daffodil International University", year: "September 2025 - December 2025", points: ["Conducted research in Natural Language Processing, Machine Learning and Deep Learning.", "Assisted faculty members with ongoing research projects.", "Supported the university's Deep Learning Bootcamp, helping students understand advanced AI concepts and hands-on model development."] },
  ],
  achievements: [
    { title: "Dean's List Award", detail: "outstanding academic performance.", year: "Fall 2024" },
    { title: "Dean's List Award", detail: "excellent academic standing.", year: "Fall 2023" },
    { title: "24th Place", detail: '"Unlock the Algorithm" Programming Contest.', year: "Fall 2023" },
  ],
  research: [
    { title: "Road Cleanliness Classification Using Deep Learning and Vision Transformer with LIME-Based Explainability", venue: "Presented at AISEI 2026, International Conference on Artificial Intelligence for Sustainable Engineering and Innovation (April 27-28, 2026), Jadara University, Jordan.", status: "In Press, IEEE Xplore & Scopus Indexed" },
    { title: "YOLOv11-Based Detection of Vegetable Leaf Diseases: A Benchmark Study on a Unified Multi-Crop Dataset with Severe Class Imbalance", venue: "Accepted at ICEFronT 2026, International Conference on Engineering Frontiers and Technology, MBSTU, Bangladesh.", status: "Accepted" },
  ],
  projects: [
    { title: "SmartFarmX", tag: "IoT • Smart Agriculture • May-Aug 2025", description: "IoT-based smart agriculture platform monitoring remote farm fields without internet using LoRa communication, with real-time sensor data visualization and a responsive web interface.", linkUrl: "https://smart-farm-x-web.vercel.app/", linkText: "Live Demo" },
    { title: "IPTV Watching Website", tag: "Web App", description: "A clean, fast, responsive IPTV streaming interface for accessing live TV channels through M3U links.", linkUrl: "https://iptv-nine-mu.vercel.app/", linkText: "Live Demo" },
    { title: "NeonTech, Demo Company Website", tag: "Web / UI-UX", description: "A professional demo website for a tech company highlighting services, portfolio, contact page, and modern UI/UX.", linkUrl: "https://neon-tech-lemon.vercel.app/", linkText: "Live Demo" },
    { title: "BookBin", tag: "UI/UX • Marketplace • 2022", description: "An online book exchange and marketplace supporting buying, selling and exchanging books, built from wireframes and clickable prototypes focused on user-friendly navigation.", linkUrl: "https://book-bin.vercel.app/", linkText: "Live Demo" },
    { title: "Personal Portfolio Website", tag: "Web • Jan 2025 - Present", description: "This responsive, interactive site highlighting my projects, experience and skills, with smooth animations and dynamic content using JavaScript, continuously improved.", linkUrl: "https://github.com/shrikantapaul571/portfolio", linkText: "Source" },
  ],
};

const $ = (id) => document.getElementById(id);
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- Boot ----------
if (!isConfigured()) {
  $("notConfigured").style.display = "block";
  $("loginScreen").style.display = "none";
} else {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Login
  $("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("loginError");
    err.style.display = "none";
    try {
      await signInWithEmailAndPassword(auth, $("loginEmail").value, $("loginPassword").value);
    } catch (ex) {
      err.textContent = "Login failed: " + ex.code;
      err.style.display = "block";
    }
  });

  $("logoutBtn").addEventListener("click", () => signOut(auth));

  onAuthStateChanged(auth, (user) => {
    if (user) {
      $("loginScreen").style.display = "none";
      $("dashboard").style.display = "block";
      $("userEmail").textContent = user.email;
      buildDashboard(db);
    } else {
      $("loginScreen").style.display = "flex";
      $("dashboard").style.display = "none";
    }
  });
}

// ---------- Dashboard ----------
let EDIT = {}; // collection -> editing doc id (or null)

function buildDashboard(db) {
  const root = $("panels");
  root.innerHTML = "";
  Object.keys(SCHEMAS).forEach((name) => {
    const s = SCHEMAS[name];
    const panel = document.createElement("section");
    panel.className = "panel";
    panel.innerHTML = `
      <h2><i class="fas ${s.icon}"></i> ${s.label}</h2>
      <div class="item-list" id="list-${name}"><p class="loading">Loading...</p></div>
      <form class="crud-form" id="form-${name}">
        <h3 id="formTitle-${name}">Add ${s.label}</h3>
        ${s.fields
          .map((f) =>
            f.type === "textarea"
              ? `<label>${f.label}</label><textarea name="${f.name}" rows="3" ${f.required ? "required" : ""}></textarea>`
              : `<label>${f.label}</label><input type="text" name="${f.name}" ${f.required ? "required" : ""} />`
          )
          .join("")}
        <div class="form-actions">
          <button type="submit">Save</button>
          <button type="button" class="ghost" id="cancel-${name}">Clear</button>
        </div>
      </form>`;
    root.appendChild(panel);

    $(`form-${name}`).addEventListener("submit", (e) => saveItem(e, db, name));
    $(`cancel-${name}`).addEventListener("click", () => resetForm(name));
    loadList(db, name);
  });
}

async function loadList(db, name) {
  const s = SCHEMAS[name];
  const wrap = $(`list-${name}`);
  try {
    const snap = await getDocs(query(collection(db, name), orderBy("createdAt", "asc")));
    if (snap.empty) {
      wrap.innerHTML = `<p class="empty">No items yet.</p>`;
      return;
    }
    wrap.innerHTML = snap.docs
      .map((d) => {
        const data = d.data();
        return `<div class="item">
          <span class="item-title">${esc(s.title(data) || "(untitled)")}</span>
          <span class="item-actions">
            <button data-edit="${d.id}"><i class="fas fa-pen"></i></button>
            <button data-del="${d.id}" class="danger"><i class="fas fa-trash"></i></button>
          </span>
        </div>`;
      })
      .join("");
    wrap.querySelectorAll("[data-edit]").forEach((b) =>
      b.addEventListener("click", () => startEdit(db, name, b.dataset.edit))
    );
    wrap.querySelectorAll("[data-del]").forEach((b) =>
      b.addEventListener("click", () => delItem(db, name, b.dataset.del))
    );
  } catch (ex) {
    wrap.innerHTML = `<p class="empty">Error: ${esc(ex.message)}</p>`;
  }
}

function readForm(name) {
  const s = SCHEMAS[name];
  const form = $(`form-${name}`);
  const data = {};
  s.fields.forEach((f) => {
    const v = form.elements[f.name].value.trim();
    if (f.list) {
      data[f.name] = v ? v.split("\n").map((x) => x.trim()).filter(Boolean) : [];
    } else {
      data[f.name] = v;
    }
  });
  return data;
}

async function saveItem(e, db, name) {
  e.preventDefault();
  const data = readForm(name);
  try {
    if (EDIT[name]) {
      await updateDoc(doc(db, name, EDIT[name]), data);
    } else {
      data.createdAt = serverTimestamp();
      await addDoc(collection(db, name), data);
    }
    resetForm(name);
    loadList(db, name);
    toast("Saved");
  } catch (ex) {
    toast("Error: " + ex.message, true);
  }
}

async function startEdit(db, name, id) {
  const snap = await getDocs(query(collection(db, name), orderBy("createdAt", "asc")));
  const found = snap.docs.find((d) => d.id === id);
  if (!found) return;
  const data = found.data();
  const form = $(`form-${name}`);
  SCHEMAS[name].fields.forEach((f) => {
    const val = data[f.name];
    form.elements[f.name].value = f.list && Array.isArray(val) ? val.join("\n") : val || "";
  });
  EDIT[name] = id;
  $(`formTitle-${name}`).textContent = "Edit " + SCHEMAS[name].label;
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function delItem(db, name, id) {
  if (!confirm("Delete this item?")) return;
  try {
    await deleteDoc(doc(db, name, id));
    loadList(db, name);
    toast("Deleted");
  } catch (ex) {
    toast("Error: " + ex.message, true);
  }
}

function resetForm(name) {
  EDIT[name] = null;
  $(`form-${name}`).reset();
  $(`formTitle-${name}`).textContent = "Add " + SCHEMAS[name].label;
}

// ---------- Seed import ----------
window.importSeed = async function () {
  if (!confirm("Import the current website content into the database? Run this only once.")) return;
  const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
  const db = getFirestore(initializeApp(firebaseConfig, "seed-" + Date.now()));
  let count = 0;
  for (const name of Object.keys(SEED)) {
    for (const item of SEED[name]) {
      await addDoc(collection(db, name), { ...item, createdAt: serverTimestamp() });
      count++;
    }
  }
  toast(`Imported ${count} items`);
  location.reload();
};

// ---------- Toast ----------
let toastTimer;
function toast(msg, isErr) {
  const t = $("toast");
  t.textContent = msg;
  t.className = "toast show" + (isErr ? " err" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.className = "toast"), 2600);
}
