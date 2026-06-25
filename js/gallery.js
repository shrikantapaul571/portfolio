// ============================================================
//  Graphics Design auto-slideshows
//  Each design card with [data-gallery="<key>"] gets its images
//  cycled automatically (fade). Hovering speeds it up.
// ============================================================

const GALLERY = {
  bookbin: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png", "11.png", "12.png", "13.png", "14.png", "15.png", "16.png", "17.png", "18.png", "19.png", "20.png", "21.png", "22.png", "23.png", "24.png", "25.png"],
  smartfarmx: ["1.png", "2.png", "3.png", "4.png", "5.png"],
  poster: ["1.jpg", "2.jpg", "3.jpg"],
  card: ["1.jpg", "2.png", "3.png", "4.png"],
  other: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"],
  logo: ["1.png", "2.jpg", "3.png", "4.png"],
};

const BASE = "assets/designs/";
const NORMAL_MS = 2600;
const HOVER_MS = 900;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-gallery]").forEach((card) => {
    const key = card.getAttribute("data-gallery");
    const files = GALLERY[key];
    const stage = card.querySelector(".slideshow");
    if (!files || !stage) return;

    // Build stacked images
    stage.innerHTML = files
      .map(
        (f, i) =>
          `<img src="${BASE}${key}/${f}" alt="${key} design ${i + 1}" class="${i === 0 ? "active" : ""}" loading="lazy" />`
      )
      .join("");

    const imgs = stage.querySelectorAll("img");
    if (imgs.length <= 1) return; // nothing to cycle

    // Counter badge
    const badge = document.createElement("span");
    badge.className = "slide-count";
    stage.appendChild(badge);

    let idx = 0;
    let delay = NORMAL_MS;
    let timer;

    const updateBadge = () => (badge.textContent = `${idx + 1}/${imgs.length}`);
    updateBadge();

    const step = () => {
      imgs[idx].classList.remove("active");
      idx = (idx + 1) % imgs.length;
      imgs[idx].classList.add("active");
      updateBadge();
      timer = setTimeout(step, delay);
    };
    const start = () => {
      clearTimeout(timer);
      timer = setTimeout(step, delay);
    };

    start();

    card.addEventListener("mouseenter", () => {
      delay = HOVER_MS;
      start();
    });
    card.addEventListener("mouseleave", () => {
      delay = NORMAL_MS;
      start();
    });
  });
});
