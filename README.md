# Shrikanta Paul — Portfolio

Personal portfolio of **Shrikanta Paul**, AI / ML Researcher and M.Sc. CSE
student at Daffodil International University.

🔗 **Live:** https://portfolio-nine-kohl-95.vercel.app/

A single-page, responsive site with a dark theme. Projects, Research,
Experience, Education and Achievements are **content-managed** through a
Firebase-backed admin panel — no code editing needed to update them.

---

## Tech stack
- **Frontend:** plain HTML, CSS, vanilla JavaScript (no framework)
- **Backend / data:** Firebase (Firestore + Authentication)
- **Hosting:** Vercel (static)
- **Fonts/Icons:** Google Fonts (Poppins, Inter), Font Awesome

## Features
- One-page scroll layout with sticky nav, smooth scroll + scrollspy
- Scroll-reveal animations, mobile menu, back-to-top
- Resume preview (rendered PDF page images) + download
- Admin panel (`/admin.html`): login, then add / edit / delete content
- Public site loads dynamic sections from Firestore (with static fallback)

## Project structure
```
index.html              Main single-page site
admin.html              Admin login + content manager
script.js               UI interactions (nav, scrollspy, reveal, form)
js/
  firebase-config.js    Firebase project config (public keys)
  render.js             Loads dynamic sections from Firestore
  admin.js              Admin auth + CRUD logic
styles/
  onepage.css           Main site styles
  admin.css             Admin panel styles
assets/                 Resume PDF + rendered preview images
images/                 Profile, design works, certificate
firestore.rules         Firestore security rules (public read, owner write)
SETUP_FIREBASE.md       One-time Firebase setup guide
```

## Run locally
Serve over HTTP (not `file://`, or the PDF/modules break):
```bash
# from the project folder
python -m http.server 5500
# open http://localhost:5500/
```
Or use the VS Code **Live Server** extension.

## Managing content (no code)
1. Go to `/admin.html` (or the small `·` link in the footer).
2. Log in with your admin account.
3. Add / edit / delete items. The site updates on refresh.

First-time Firebase setup is documented in [SETUP_FIREBASE.md](SETUP_FIREBASE.md).

## Deploy
```bash
git add -A && git commit -m "your message" && git push
npx vercel --prod
```

## Notes
- The Firebase `apiKey` is public by design; security is enforced by
  `firestore.rules` (public read, write restricted to the owner's UID).
- To refresh the resume preview after replacing the PDF:
  ```bash
  pdftoppm -png -r 140 assets/Shrikantapaul_resume.pdf assets/resume/page
  ```
