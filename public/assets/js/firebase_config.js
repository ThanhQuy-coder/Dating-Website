import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBT6ViW-ggujrXngT7iojPPr99fiBI7IFs",
  authDomain: "dating-website-choco.firebaseapp.com",
  projectId: "dating-website-choco",
  storageBucket: "dating-website-choco.appspot.com",
  messagingSenderId: "380827156073",
  appId: "1:380827156073:web:b705e3d2bec4dfe4e76cf8",
  measurementId: "G-LJL1Q7V291",
};

const databaseURL =
  "https://dating-website-choco-default-rtdb.asia-southeast1.firebasedatabase.app";

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app, databaseURL);
