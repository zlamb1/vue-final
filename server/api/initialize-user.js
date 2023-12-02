import {firestore, useUserToken} from "~/server/api/_firebase";
import {FieldValue} from 'firebase-admin/firestore'
import ResponseCode from "~/models/ResponseCode";

export default defineEventHandler(async (event) => {
    return await useUserToken(event).then((user) => {
        const docRef = firestore.doc(`users/${user.uid}`);
        return docRef.get()
            .then(async (doc) => {
                if (doc.exists) {
                    return ResponseCode.USER_EXISTS;
                }
                // initialize user data
                await docRef.set({
                    displayName: user.name,
                    photoURL: user.picture,
                    bio: '',
                    profilePrivate: false,
                    roles: {
                        user: true
                    }
                });
                // initialize list data
                const listDocRef = firestore.doc(`lists/${user.uid}`);
                await listDocRef.set({
                   list: [],
                });
                // initialize role data
                const rolesDocRef = firestore.doc('roles/user');
                await rolesDocRef.update('members', FieldValue.arrayUnion(user.uid));
                return ResponseCode.SUCCESS;
            })
            .catch((err) => {
                // log to server
                console.error('Error creating new user: ' + err);
                return ResponseCode.UNKNOWN;
            });
    });
});