import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import {getAuth} from "firebase-admin/auth";
import 'dotenv/config';

const serviceAccount = JSON.parse(process.env['GOOGLE_APPLICATION_CREDENTIALS']);

initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const auth = admin.auth();

const useUserToken = async (event) => {
    const {idToken} = getQuery(event);
    if (idToken) {
        return getAuth()
            .verifyIdToken(idToken)
                .catch((err) => {
                    return 'Failed to validate user id token: ' + err;
                });
    } else {
        return 'Please provide a user id token.';
    }
}

export {firestore, auth, useUserToken};