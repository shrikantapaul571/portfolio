// === Modal Helpers ===
function openModal(id) {
  document.getElementById(id).classList.add("show");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

// === Require Login Every Time ===
function requireLogin(callback) {
  openModal("loginModal");

  const loginForm = document.getElementById("loginForm");

  async function handler(e) {
    e.preventDefault();

    const formData = new FormData(loginForm);

    const response = await fetch("php/login.php", {
      method: "POST",
      body: formData
    });

    const text = await response.text();

    if (text.includes("success")) {
      closeModal("loginModal");
      document.getElementById("loginError").style.display = "none";

      // Remove listener to prevent duplicates
      loginForm.removeEventListener("submit", handler);

      // Run the protected action
      callback();
    } else {
      document.getElementById("loginError").style.display = "block";
    }
  }

  loginForm.addEventListener("submit", handler);
}

// === Add Project Flow ===
document.getElementById("openLogin").addEventListener("click", () => {
  requireLogin(() => {
    openModal("addProjectModal");
  });
});

document.getElementById("addProjectForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const response = await fetch("php/add_project.php", {
    method: "POST",
    body: formData
  });

  const text = await response.text();
  alert(text);

  if (text.includes("added")) {
    closeModal("addProjectModal");
    window.location.href = "projects.php";
  }
});

// === Edit Project Flow ===
function requestEdit(id, title, description, github, demo, video) {
  requireLogin(() => {
    // Fill modal with project data AFTER login succeeds
    document.getElementById("editId").value = id;
    document.getElementById("editTitle").value = title;
    document.getElementById("editDescription").value = description;
    document.getElementById("editGithub").value = github;
    document.getElementById("editDemo").value = demo;
    document.getElementById("editVideo").value = video;

    openModal("editProjectModal");
  });
}

document.getElementById("editProjectForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const response = await fetch("php/edit_project.php", {
    method: "POST",
    body: formData
  });

  const text = await response.text();
  alert(text);

  if (text.includes("edited")) {
    closeModal("editProjectModal");
    window.location.href = "projects.php";
  }
});

// === Delete Project Flow ===
function requestDelete(id) {
  requireLogin(() => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const formData = new FormData();
    formData.append("id", id);

    fetch("php/delete_project.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(text => {
        alert(text);
        if (text.includes("deleted")) {
          window.location.href = "projects.php";
        }
      });
  });
}
