// ===== One-Page Portfolio - interactions =====

document.addEventListener("DOMContentLoaded", () => {
  const navMenu = document.getElementById("navMenu");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = Array.from(navMenu.querySelectorAll("a"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const toTop = document.getElementById("toTop");

  // --- Mobile menu toggle ---
  navToggle.addEventListener("click", () => navMenu.classList.toggle("open"));

  // Close mobile menu after a link is clicked
  navLinks.forEach((link) =>
    link.addEventListener("click", () => navMenu.classList.remove("open"))
  );

  // --- Scrollspy: highlight nav link of section in view ---
  const spy = () => {
    const pos = window.scrollY + window.innerHeight * 0.3;
    let current = sections[0];
    for (const sec of sections) {
      if (sec.offsetTop <= pos) current = sec;
    }
    navLinks.forEach((link) =>
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + current.id
      )
    );

    // Back-to-top visibility
    toTop.classList.toggle("show", window.scrollY > 400);
  };

  window.addEventListener("scroll", spy, { passive: true });
  spy();

  // --- Back to top ---
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  // --- Scroll reveal animations ---
  const revealEls = document.querySelectorAll(
    ".timeline-item, .skill, .card, .achievements li, .ref-card, .about-intro, .subhead, .resume-frame, .resume-actions, .contact-form, .contact-social"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = (i % 6) * 60 + "ms";
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // --- Contact form (sends via FormSubmit) ---
  const form = document.getElementById("contactForm");
  if (form) {
    const status = document.getElementById("formStatus");
    const btn = form.querySelector("button[type='submit']");
    const show = (msg, ok) => {
      status.style.display = "block";
      status.style.color = ok ? "#7CFC00" : "#ff6b6b";
      status.textContent = msg;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = "Sending...";
      try {
        const endpoint = form.action.replace(
          "formsubmit.co/",
          "formsubmit.co/ajax/"
        );
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (res.ok) {
          show("Thanks! Your message has been sent.", true);
          form.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          show(data.message || "Something went wrong. Please email me directly.", false);
        }
      } catch {
        show("Network error. Please email me directly.", false);
      } finally {
        btn.disabled = false;
        btn.textContent = original;
      }
    });
  }
});
