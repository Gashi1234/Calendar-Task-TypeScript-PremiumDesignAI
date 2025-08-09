# Calendar Task – Premium Design

A job application project built with **Expo (React Native)** and **Firebase**.  
This version uses a **premium UI design** with the same core functionality as the Simple version, plus enhanced styling:
- Email/password authentication
- Biometric re-login
- Custom calendar (no third-party library)
- Create and edit events
- Safe layout for devices with notches
- Header + navbar
- Screen transition animations
- Modern premium UI with gradients, shadows, and refined spacing

---

## Software Versions (tested)

- **Node.js:** 18.x
- **npm:** 9+ (or Yarn 1.22+)
- **Expo CLI:** 6+
- **Expo SDK:** 53
- **React Native:** 0.79.x (via Expo SDK 53)
- **Firebase Web SDK:** 10+

> No native build setup required for testing – runs in **Expo Go**.

---

## Firebase Setup

This repo includes `firebase.js` with client-side config for quick review.  
Security is enforced via Firebase Auth + Realtime Database rules.

- **Auth**: Email/Password enabled
- **Database**: Realtime Database

---

## Requirements Coverage

- **Expo + JavaScript**
- Authorization (Sign up / Sign in)
- **Biometric sign-in** when previously logged in
- **Routing (Navigation)** (stack + bottom tabs), header + navbar
- **Custom calendar UI** (no third-party calendar library)
- Screen transition animations
- Safe display on devices with **notches**

---

## Features

- **Auth**: Sign up & Sign in with validation
- **Biometrics**: Face ID / Touch ID prompt if previously logged in
- **Calendar**: Month/Day switch, select a day to view its events (custom UI)
- **Events**: Create/Edit events (user-specific, stored in Firebase)
- **UI/Navigation**: Stack + Tabs, smooth default transitions
- **Premium UI**: Modern layout with gradients, shadows, and better visual hierarchy

---

## Screenshots

See `docs/screenshots/` for all screenshots.

---

## Tests & Coverage

Test coverage report is included in the `coverage/` folder.  
Open `coverage/lcov-report/index.html` in a browser to view detailed results.

Current coverage: **≥5%**.

---

## Notes

- No third-party calendar library used.
- Firebase config is intentionally committed (client-side only, safe for review).
- Built and tested entirely in **Expo Go**.
