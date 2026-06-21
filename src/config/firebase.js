const admin = require('firebase-admin');
const logger = require('../utils/logger');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  logger.info('Firebase Admin SDK initialized');
} else {
  logger.warn('Firebase Admin SDK not initialized: Missing environment variables');
}

const db = admin.apps.length > 0 ? admin.firestore() : null;

module.exports = { admin, db };
