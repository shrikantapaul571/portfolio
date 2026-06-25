// ============================================================
//  Firebase configuration
//  ----------------------------------------------------------
//  Paste the config object from your Firebase project here.
//  (Firebase console -> Project settings -> Your apps -> Web app -> Config)
//
//  These values are PUBLIC and safe to commit. Security is
//  enforced by Firestore rules (public read, write only when
//  logged in), not by hiding these keys.
//
//  Until you fill apiKey in, the site keeps showing the built-in
//  static content and the admin panel stays disabled.
// ============================================================

export const firebaseConfig = {
  apiKey: "AIzaSyDizf42zdh_CyJjm9ybQxnT5XjYz5GH3zY",
  authDomain: "shrikanta-portfolio.firebaseapp.com",
  projectId: "shrikanta-portfolio",
  storageBucket: "shrikanta-portfolio.firebasestorage.app",
  messagingSenderId: "390638107428",
  appId: "1:390638107428:web:1c5504a2d4f869103cd1b1",
  measurementId: "G-FYN8H2YPNL",
};

// Collections used by the site. Don't change the keys.
export const COLLECTIONS = [
  "education",
  "experience",
  "achievements",
  "research",
  "projects",
];

export const isConfigured = () => Boolean(firebaseConfig.apiKey);
