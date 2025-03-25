const admin = require('firebase-admin');

// Initialize without parameters (uses default credentials)
admin.initializeApp();

// Get Firestore and Storage instances
const db = admin.firestore();
const storage = admin.storage().bucket(); // Note the bucket() call for storage

// Connect to emulators if running locally
if (process.env.NODE_ENV !== 'production') {
  db.settings({
    host: 'localhost:5000',
    ssl: false
  });
}

module.exports = { db, storage, admin };