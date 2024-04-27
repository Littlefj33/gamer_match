// .env is in .gitignore, so it's not in the repo

export default {
    apiKey: process.env.NEXT_FIREBASE_KEY,
    authDomain: process.env.NEXT_FIREBASE_DOMAIN,
    projectId: process.env.NEXT_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_FIREBASE_SENDER_ID,
    appId: process.env.NEXT_FIREBASE_APP_ID
  };