import {firestore, auth, useUserToken} from "~/server/api/_firebase";
import {FieldValue} from 'firebase-admin/firestore'
import ResponseCode from "~/models/ResponseCode";

export default defineEventHandler(async (event) => {
    return await useUserToken(event).then((user) => {
        const uid = user.uid;
        const publicDocRef = firestore.doc(`users/${uid}`);
        const privateDocRef = firestore.doc(`users/${uid}/private/data`);
        return publicDocRef.get()
            .then(async (doc) => {
                if (!doc.exists) {
                    return ResponseCode.NO_USER;
                }
                // delete list + refs
                const listDocRef = firestore.doc(`lists/${uid}`);
                await listDocRef.delete();
                const publicDocRef = firestore.doc('lists/public');
                await publicDocRef.update({
                    users: FieldValue.arrayRemove(uid),
                })
                // delete user docs
                await publicDocRef.delete();
                await privateDocRef.delete();
                // delete auth user
                await auth.deleteUser(uid);
                return ResponseCode.SUCCESS;
            }).catch((err) => {
                console.log('Failed to delete user: ' + err);
                return ResponseCode.UNKNOWN;
            });
    });
});