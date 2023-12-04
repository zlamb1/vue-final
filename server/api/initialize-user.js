import {firestore, useUserToken} from "~/server/api/_firebase";
import {FieldValue} from 'firebase-admin/firestore'
import ResponseCode from "~/models/ResponseCode";

export default defineEventHandler(async (event) => {
    return await useUserToken(event).then(async (user) => {
        const publicDocRef = firestore.doc(`users/${user.uid}`);
        const publicDoc = await publicDocRef.get();
        const privateDocRef = firestore.doc(`users/${user.uid}/private/data`);
        const privateDoc = await privateDocRef.get();
        if (publicDoc.exists || privateDoc.exists) {
            return ResponseCode.USER_EXISTS;
        }
        await publicDocRef.set({
            displayName: user.name,
            photoURL: user.picture,
        });
        await privateDocRef.set({
            bio: '',
            roles: {
                user: true,
            },
            visibility: 'private',
        });
        const listDocRef = firestore.doc(`lists/${user.uid}`);
        await listDocRef.set({
            list: {},
            visibility: 'private',
        });
        return ResponseCode.SUCCESS;
    }).catch((err) => {
        console.log('Error creating new user: ' + err);
        return ResponseCode.UNKNOWN;
    });
});