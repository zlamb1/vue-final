import {firestore, auth, useUserToken} from "~/server/api/_firebase";
import {FieldValue} from 'firebase-admin/firestore'
import ResponseCode from "~/models/ResponseCode";

export default defineEventHandler(async (event) => {
    return await useUserToken(event).then((user) => {
        const uid = user.uid;
        const userDocRef = firestore.doc(`users/${uid}`);
        return userDocRef.get()
            .then(async (doc) => {
                if (!doc.exists) {
                    return ResponseCode.NO_USER;
                }
                // delete roles
                const roles = doc.data().roles;
                for (const role in roles) {
                    const roleDocRef =
                        firestore.doc(`roles/${role}`);
                    await roleDocRef.update('members', FieldValue.arrayRemove(uid));
                }
                // delete list
                const listDocRef = firestore.doc(`lists/${uid}`);
                await listDocRef.delete();
                // delete user doc
                await userDocRef.delete();
                // delete auth user
                await auth.deleteUser(uid);
                return ResponseCode.SUCCESS;
            }).catch((err) => {
                console.log('Failed to delete user: ' + err);
                return ResponseCode.UNKNOWN;
            });
    });
});