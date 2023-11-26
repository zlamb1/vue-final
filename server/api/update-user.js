import {firestore, useUserToken} from "~/server/api/_firebase";
import ResponseCode from "~/models/ResponseCode";

export default defineEventHandler(async (event) => {
    return await useUserToken(event).then((user) => {
        const {displayName, photoURL, bio, profilePrivate, targetUser} = getQuery(event);
        
        if (targetUser) {
            // TODO: validate permissions and update target profile
        }
        
        const userDocRef = firestore.doc(`users/${user.uid}`);
        return userDocRef.get().then((doc) => {
            if (!doc.exists) {
                return ResponseCode.NO_USER;
            }
            const data = {};
            // displayName is required
            if (displayName && displayName !== doc.data().displayName) {
                data.displayName = displayName;
            }
            if (photoURL !== undefined && photoURL !== doc.data().photoURL) {
                data.photoURL = photoURL;
            }
            if (bio !== undefined && bio !== doc.data().bio) {
                data.bio = bio;
            }
            if (profilePrivate !== undefined && profilePrivate !== doc.data().profilePrivate) {
                data.profilePrivate = profilePrivate;
            }
            if (Object.keys(data).length === 0) {
                return ResponseCode.NO_CHANGE;
            }
            userDocRef.update(data);
            return ResponseCode.SUCCESS;
        }).catch((err) => {
            console.log('Error updating user profile: ' + err);
            return err;
        });
    });
});