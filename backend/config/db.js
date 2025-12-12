//initialize an instance of firebase-admin
const firebaseAdmin = require('firebase-admin');

//load the JSON file with the credentials
const serviceAccount = require('./credenciais-firebase.json');

//initialize the application
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

const db = firebaseAdmin.firestore(); //service of database firestore
const auth = firebaseAdmin.auth(); //service for Firebase Authentication

//export the services
module.exports = { db, auth };