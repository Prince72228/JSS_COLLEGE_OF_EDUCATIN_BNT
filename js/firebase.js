// Firebase Firestore (Compat SDK) - works on GitHub Pages and when opened locally (file://)
// 1) Create Firebase project + enable Firestore
// 2) Paste your Firebase Web App config below

/* global firebase */

(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyC9irbsBeVBsK3JrgJHo5CgzDgp5htFMxQ",
    authDomain: "jss-finance-manager.firebaseapp.com",
    projectId: "jss-finance-manager",
    storageBucket: "jss-finance-manager.firebasestorage.app",
    messagingSenderId: "1012244314986",
    appId: "1:1012244314986:web:18a196c6e5e41ad1bc8313",
  };

  const configLooksPlaceholder = Object.values(firebaseConfig).some((v) => String(v || "").startsWith("ADD_"));
  if (configLooksPlaceholder) {
    const msg = "Firebase config is not set. Please replace ADD_* values in js/firebase.js with your Firebase Web App config.";
    console.error(msg);
    window.FM_INIT_ERROR = msg;
    // Continue anyway so the page can render, but Firestore will not work.
  }

  if (!window.firebase) {
    console.error("Firebase SDK not loaded. Add firebase-app-compat and firebase-firestore-compat scripts.");
    return;
  }

  // Prevent double-init
  const app = firebase.apps?.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore(app);

  // ---- Seed data (89 real names; IDs 1..89) ----
  const DEFAULT_MEMBER_NAMES = [
    "Sudharani Appanna Kamble",
    "Mahalingappa Bharamannavar",
    "Manjula Sannakki",
    "Amar Ashok Honnamani",
    "Kadambari Choudappa Gadiwaddar",
    "Shreechandra Dodamani",
    "Bharati Chatni",
    "Uday Mahaling Mahantashetti",
    "Muragesh Bagewadi",
    "Yashoda Balavad",
    "Abdulvahab Kurshidalam Teradal",
    "Mahammadsameer Ramjan Makandar",
    "Basuraj Ravi Maradi",
    "Nandeppa Suresh Shirahatti",
    "Darshan Kakhandaki",
    "Savita Bhimashi Hanchanal",
    "Ameer Shekh",
    "Tangevva B Patil",
    "Jyoti Mathagar",
    "Gayatri Sanju Naduvinamani",
    "Swati Sahadev Pattanashetti",
    "Ashwini Rajashekharayya Hiremath",
    "Niyaz Imam Sab Horatti",
    "Kiran Hawaldar",
    "Ruksar Faniband",
    "Nisarga Dodamani",
    "Gurunath Kittur",
    "Vinayak Hasilkar",
    "Keerti Mallappa Urabhinnavar",
    "Kavita Kiran Sutar",
    "Prashant Ningappa Ullagaddi",
    "Sunita Mathapati",
    "Sushmita Mahadev Vadegali",
    "Swati Balappa Jiddimani",
    "Padmini Nagappa Madar",
    "Sneha Laxman Uppar",
    "Gangappa Raju Madappagol",
    "Rekha Anand Hanjagi",
    "Aishwarya Uttur",
    "Bhagyashree Mallappa Ramadurg",
    "Anupallavi Ramesh Madiwalar",
    "Jyoti Dundappa Gasti",
    "Priyanka Adiveppa Lokuri",
    "Sangeeta Uppar",
    "Bharati Siddaram Athani",
    "Shashikala Annappa Gaggari",
    "Archana Shanta Hosamani",
    "Rajeshwari Satyappa Nayak",
    "Bhagirathi Mallappa Alagur",
    "Laxmi Kallappa Ganiger",
    "Renuka Rajaput",
    "Siddarth Masti",
    "Savitri Raju Gurav",
    "Divya Basappa Raval",
    "Mahazabeen Muradsab Hanagandi",
    "Akshata Shirol",
    "Rohini M Jadhav",
    "Adamali Dastagirsab Nadaf",
    "Rohit S Rajaput",
    "Vaishali Anand Shirhatti",
    "Revati Kanatti",
    "Shridevi Shatteppa Gangappagol",
    "Soumya Savadi",
    "Venktesh Benakatti",
    "Kaveri Madar",
    "Chaithra Sadappa Chinchakhandi",
    "Kavya Sadashiv Kadapatti",
    "Mahantesh Hiremath",
    "Sahana Nagaraj Metri",
    "Neelamma Angadi",
    "Keerti Billur",
    "Fatima Yadawad",
    "Keerti Mode",
    "Tejashwini Vishnu Dharennavar",
    "Gangavva Arjun Kattimani",
    "Kaveri Subhas Kalmaddi",
    "Tanjila Ilayi Pinjar",
    "Bhagyashree Channabasu Biradarpatil",
    "Asmita A Savant",
    "Sujata Mudhol",
    "Aishwarya Shanur Gadadi",
    "Bhaghyshri Ashok Gurav",
    "Priyanka Mutturaj Patrot",
    "Laxmi Vittal Athani",
    "Preeti Itagoni",
    "Sana Shamansab Mujavar",
    "Ashwini Ashok Badiger",
    "Gayatri Appasi Maranur",
    "Shreyanka Kadappa Badagi",
  ];

  const settingsRef = db.collection("settings").doc("global");

  async function ensureInitialized() {
    // settings/global
    const s = await settingsRef.get();
    if (!s.exists) {
      await settingsRef.set({ collectionAmount: 0 });
    }

    // members seed (only if empty)
    const membersSnap = await db.collection("members").limit(1).get();
    if (membersSnap.empty) {
      const batch = db.batch();
      DEFAULT_MEMBER_NAMES.forEach((name, idx) => {
        const id = idx + 1;
        const ref = db.collection("members").doc(String(id));
        batch.set(ref, { id, name, status: "NO", amount: 0 });
      });
      await batch.commit();
      return;
    }

    // If the DB was previously initialized with placeholder names (Student 1, Student 2...),
    // replace ONLY the `name` fields in-place without touching status/amount.
    await replacePlaceholderNamesIfPresent();
  }

  async function replacePlaceholderNamesIfPresent() {
    // We only ever update ids 1..89 according to the provided real list.
    // Condition: current name looks like a placeholder.
    const snap = await db.collection("members").where("id", "<=", DEFAULT_MEMBER_NAMES.length).get();
    if (snap.empty) return;

    const placeholderRe = /^\s*student\s*\d+\s*$/i;
    const batch = db.batch();
    let changed = 0;

    snap.forEach((docSnap) => {
      const data = docSnap.data() || {};
      const id = Number(data.id);
      if (!Number.isFinite(id) || id < 1 || id > DEFAULT_MEMBER_NAMES.length) return;

      const currentName = String(data.name || "");
      const shouldReplace = placeholderRe.test(currentName) || currentName.trim() === "";
      if (!shouldReplace) return;

      const realName = DEFAULT_MEMBER_NAMES[id - 1];
      batch.update(docSnap.ref, { name: realName });
      changed += 1;
    });

    if (changed > 0) {
      await batch.commit();
    }
  }

  // ---- Realtime listeners ----
  function listenMembers(cb, onError) {
    return db
      .collection("members")
      .orderBy("id", "asc")
      .onSnapshot(
        (snap) => cb(snap.docs.map((d) => ({ docId: d.id, ...d.data() }))),
        (err) => {
          console.error("listenMembers error:", err);
          window.FM_LAST_ERROR = err;
          if (typeof onError === "function") onError(err);
        }
      );
  }

  function listenExpenses(cb, onError) {
    return db
      .collection("expenses")
      .orderBy("timestamp", "desc")
      .onSnapshot(
        (snap) => cb(snap.docs.map((d) => ({ docId: d.id, ...d.data() }))),
        (err) => {
          console.error("listenExpenses error:", err);
          window.FM_LAST_ERROR = err;
          if (typeof onError === "function") onError(err);
        }
      );
  }

  function listenSettings(cb, onError) {
    return settingsRef.onSnapshot(
      (snap) => cb(snap.exists ? snap.data() : { collectionAmount: 0 }),
      (err) => {
        console.error("listenSettings error:", err);
        window.FM_LAST_ERROR = err;
        if (typeof onError === "function") onError(err);
      }
    );
  }

  // ---- Admin actions ----
  async function setCollectionAmount(amount) {
    const a = Number(amount) || 0;
    await settingsRef.set({ collectionAmount: a }, { merge: true });

    // Update ALL paid members to reflect the new collectionAmount (critical requirement)
    const paidSnap = await db.collection("members").where("status", "==", "YES").get();
    if (paidSnap.empty) return;

    const batch = db.batch();
    paidSnap.forEach((docSnap) => {
      batch.update(docSnap.ref, { amount: a });
    });
    await batch.commit();
  }

  async function toggleMemberPaid(memberDocId, makePaid, collectionAmount) {
    const status = makePaid ? "YES" : "NO";
    const amount = makePaid ? Number(collectionAmount) || 0 : 0;
    await db.collection("members").doc(memberDocId).update({ status, amount });
  }

  async function updateMemberName(memberDocId, name) {
    const trimmed = String(name || "").trim();
    if (!trimmed) throw new Error("Name is required");
    await db.collection("members").doc(memberDocId).update({ name: trimmed });
  }

  async function addMember(name) {
    const trimmed = String(name || "").trim();
    if (!trimmed) throw new Error("Name is required");

    // next id (sequential)
    const lastSnap = await db.collection("members").orderBy("id", "desc").limit(1).get();
    const lastId = lastSnap.empty ? 0 : Number(lastSnap.docs[0].data().id) || 0;
    const id = lastId + 1;

    await db.collection("members").doc(String(id)).set({ id, name: trimmed, status: "NO", amount: 0 });
  }

  async function deleteMember(memberDocId) {
    await db.collection("members").doc(memberDocId).delete();
  }

  async function addExpense(reason, amount) {
    const r = String(reason || "").trim();
    const a = Number(amount);
    if (!r) throw new Error("Reason is required");
    if (!Number.isFinite(a) || a <= 0) throw new Error("Amount must be a positive number");

    await db.collection("expenses").add({
      reason: r,
      amount: a,
      timestamp: Date.now(),
    });
  }

  async function updateExpense(expenseDocId, patch) {
    await db.collection("expenses").doc(expenseDocId).update(patch);
  }

  async function deleteExpense(expenseDocId) {
    await db.collection("expenses").doc(expenseDocId).delete();
  }

  async function eraseAllData() {
    // Reset all members to NO/0 and delete all expenses
    const batch = db.batch();

    const members = await db.collection("members").get();
    members.forEach((d) => batch.update(d.ref, { status: "NO", amount: 0 }));

    const expenses = await db.collection("expenses").get();
    expenses.forEach((d) => batch.delete(d.ref));

    batch.set(settingsRef, { collectionAmount: 0 }, { merge: true });
    await batch.commit();
  }

  window.FM = {
    db,
    ensureInitialized,
    listenMembers,
    listenExpenses,
    listenSettings,
    setCollectionAmount,
    toggleMemberPaid,
    updateMemberName,
    addMember,
    deleteMember,
    addExpense,
    updateExpense,
    deleteExpense,
    eraseAllData,
  };
})();
