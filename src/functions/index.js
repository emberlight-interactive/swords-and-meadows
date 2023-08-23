/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const {
  initializeApp,
  // applicationDefault,
  // cert,
} = require('firebase-admin/app');

const {
  getFirestore,
  // Timestamp,
  // FieldValue,
  // Filter,
} = require('firebase-admin/firestore');

const { getMessaging } = require('firebase-admin/messaging');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

initializeApp();

const db = getFirestore();

const pushNotifyRef = db.collection('push_subscriptions');

exports.pushSubscription = onRequest(async (request, response) => {
  const count = (
    await pushNotifyRef
      .where('ip', '==', request.ip || '0.0.0.0')
      .count()
      .get()
  ).data().count;

  if (count > 5) response.status(200).send();

  logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase! ' + count);

  pushNotifyRef.add({
    ip: request.ip || '0.0.0.0',
    token: String(request.body?.token) || '',
  });
});

exports.notifyPlzLol = onRequest(async (request, response) => {
  const record = await (async () => {
    if (request.body.pk) {
      return await pushNotifyRef.doc(request.body.pk).get();
    }
  })();

  console.log(record.data());

  if (record) {
    sendNotification(record.data().token);
  }

  return response.status(200).send();
});

async function sendNotification(token) {
  const message = {
    webpush: {
      notification: {
        title: 'Price drop',
        body: '5% off all electronics',
        image: 'https://swordsandmeadows.online/logo-m.81522d15.png',
        data: {
          url: 'https://swordsandmeadows.online',
        },
      },
    },
    token,
  };

  await getMessaging().send(message);
}
