// ============================================================
//  Public site renderer
//  Loads dynamic sections from Firestore and injects them.
//  If Firebase isn't configured yet, or a collection is empty,
//  the built-in static HTML is left untouched (graceful fallback).
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig, isConfigured } from "./firebase-config.js";

// --- HTML escape to avoid breaking markup / injection ---
const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Turn URLs typed in plain text into safe href (basic)
const safeUrl = (u = "") => (/^https?:\/\//i.test(u) ? u : "");

// --- Templates (must match styles in onepage.css) ---
const templates = {
  education: (d) => `
    <div class="timeline-item">
      <h4>${esc(d.degree)}</h4>
      ${d.year ? `<span class="year">${esc(d.year)}</span>` : ""}
      ${d.place ? `<p><strong>${esc(d.place)}</strong></p>` : ""}
      ${d.detail ? `<p>${esc(d.detail)}</p>` : ""}
    </div>`,

  experience: (d) => `
    <div class="timeline-item">
      <h4>${esc(d.role)}</h4>
      ${d.year ? `<span class="year">${esc(d.year)}</span>` : ""}
      ${d.place ? `<p>${esc(d.place)}</p>` : ""}
      ${
        Array.isArray(d.points) && d.points.length
          ? `<ul>${d.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`
          : ""
      }
    </div>`,

  achievements: (d) => `
    <li>
      <strong>${esc(d.title)}</strong>${d.detail ? `, ${esc(d.detail)}` : ""}
      ${d.year ? `<span class="year">${esc(d.year)}</span>` : ""}
    </li>`,

  research: (d) => `
    <div class="card">
      ${d.status ? `<span class="tag">${esc(d.status)}</span>` : ""}
      <h3>${esc(d.title)}</h3>
      ${d.venue ? `<p>${esc(d.venue)}</p>` : ""}
    </div>`,

  projects: (d) => {
    const url = safeUrl(d.linkUrl);
    return `
    <div class="card">
      ${d.tag ? `<span class="tag">${esc(d.tag)}</span>` : ""}
      <h3>${esc(d.title)}</h3>
      ${d.description ? `<p>${esc(d.description)}</p>` : ""}
      ${
        url
          ? `<div class="project-links"><a href="${esc(url)}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> ${esc(d.linkText || "View")}</a></div>`
          : ""
      }
    </div>`;
  },
};

// collection name -> container element id in index.html
const targets = {
  education: "educationList",
  experience: "experienceList",
  achievements: "achievementsList",
  research: "researchList",
  projects: "projectsList",
};

async function renderCollection(db, name) {
  const el = document.getElementById(targets[name]);
  if (!el) return;
  try {
    const snap = await getDocs(
      query(collection(db, name), orderBy("createdAt", "asc"))
    );
    if (snap.empty) return; // keep static fallback
    el.innerHTML = snap.docs.map((doc) => templates[name](doc.data())).join("");
  } catch (err) {
    console.warn(`[render] ${name}:`, err.message);
    // leave static fallback on error
  }
}

(async function init() {
  if (!isConfigured()) return; // not set up yet -> static content stays
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  await Promise.all(Object.keys(targets).map((name) => renderCollection(db, name)));
})();
