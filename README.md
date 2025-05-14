# Personal Finance Tracker App

A mobile app built with **React Native + Firebase** that allows users to track income and expenses, view monthly summaries, visualize data with charts, and filter/search past transactions.

---

## 🔐 Features

- Firebase Authentication (email/password)
- Add / Edit / Delete transactions
- Monthly income, expense, and balance summary
- Pie chart visualization (Income vs. Expenses)
- Month filtering + search by title
- Logout & session persistence
- Protected screens for logged-in users only
- Firebase Firestore integration per user

---

## 📦 Technologies Used

- React Native (with Expo)
- Firebase Authentication
- Firebase Firestore
- Chart library (Victory Native / any chart lib)
- React Hooks & Picker

---

## 🚀 How to Run

1. Clone the repo  
git clone https://github.com/Minhaj2x/Personal-Finance-Tracker-App.git


2. Install dependencies  
npm install


3. Add your own Firebase config inside `/src/firebase.js`  
```js
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
Start the app
npx expo start
⚠️ Firebase keys should NOT be committed publicly.
📂 Folder Structure

/src
  /components
    ChartSection.jsx
  /screens
    TransactionsScreen.jsx
  firebase.js
  App.js
🧑‍💻 Developed By

Minhaj Ahmed
For INF657 – Mobile Web Development II
Spring 2025 @ Fort Hays State University