# Firebase Setup (one time, ~5–10 min)

This lets you log in and add/edit Projects, Research, Experience, Education and
Achievements from a form — no code editing. The public site reads from the
database automatically.

You only do this once. After that, you just use `admin.html`.

---

## 1. Create a Firebase project
1. Go to https://console.firebase.google.com → **Add project**.
2. Name it (e.g. `shrikanta-portfolio`). Disable Google Analytics (optional). Create.

## 2. Add a Web App + copy config
1. In the project, click the **`</>` (Web)** icon → register an app (any nickname).
2. It shows a `firebaseConfig = { apiKey: ..., ... }` object. **Copy those values.**
3. Open `js/firebase-config.js` in this project and paste each value
   (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).

## 3. Enable Firestore (the database)
1. Left menu → **Build → Firestore Database → Create database**.
2. Start in **Production mode**. Pick a location. Enable.
3. Go to the **Rules** tab, replace everything with the contents of
   `firestore.rules` (in this project), and **Publish**.

   These rules = anyone can READ (so the site shows your content), only a
   logged-in user can WRITE.

## 4. Enable Login (Auth) + create your account
1. Left menu → **Build → Authentication → Get started**.
2. **Sign-in method** tab → enable **Email/Password** → Save.
3. **Users** tab → **Add user** → enter your email + a password.
   That email/password is your admin login.

## 5. Use it
1. Open the site, scroll to the footer, click the small **·** (or go to `/admin.html`).
2. Log in with the account from step 4.
3. Click **"Import current content"** ONCE — this loads your existing
   Projects/Research/etc. into the database.
4. From now on: add / edit / delete items in the forms. Refresh the site to see changes.

---

## Notes
- The `apiKey` is **public by design** — it's safe to commit. Security comes
  from the Firestore rules (step 3), not from hiding the key.
- If `js/firebase-config.js` is left blank, the site simply shows the built-in
  static content and the admin page says "not set up yet".
- After editing `firebase-config.js`, commit + push so it deploys:
  ```
  git add -A && git commit -m "Add Firebase config" && git push
  npx vercel --prod
  ```
- If you change the resume PDF later, regenerate the preview images:
  ```
  pdftoppm -png -r 140 assets/Shrikantapaul_resume.pdf assets/resume/page
  ```
