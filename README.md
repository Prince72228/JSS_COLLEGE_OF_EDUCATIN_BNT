# JSS College of Education Banahatti – Finance Management System

A production-grade **realtime finance dashboard** (static site) designed for **GitHub Pages**.

## Key features
- Firebase **Firestore** as cloud database
- **Realtime sync** across all devices using `onSnapshot()`
- Public dashboard with **Odometer.js** balance animation
- Coin progress tank with **GSAP** coin drops when someone is marked paid
- Charts via **Chart.js**
- A4 expense report export via **jsPDF**

## Firestore data model
Collections:
- `members` → `{ id, name, status:"YES"|"NO", amount }`
- `expenses` → `{ reason, amount, timestamp }`
- `settings/global` → `{ collectionAmount }`

Rules:
- If member `status=YES` → `amount = collectionAmount`
- If member `status=NO` → `amount = 0`

Calculations:
- Total Collected = **sum(member.amount)**
- Total Expenses = **sum(expense.amount)**
- Balance = Total Collected − Total Expenses

## Setup
### 1) Create Firebase project + enable Firestore
Firebase Console → Build → Firestore Database → Create database.

### 2) Add your Firebase Web App config
Edit:
`js/firebase.js`

Replace the `firebaseConfig` values:
- apiKey
- authDomain
- projectId
- storageBucket
- messagingSenderId
- appId

### 3) Firestore Rules (development)
> For testing only. Lock this down for real production.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Local usage
This project uses the **Firebase compat SDK** so it can run on:
- `file://` (double click) in most browsers
- GitHub Pages

If your browser blocks it in `file://`, use a simple local server.

## Notes
- Default member list is seeded from the provided real names **only if** `members` is empty.
- Progress denominator is **97 total members** as specified (even though the provided list contains 89 names).
