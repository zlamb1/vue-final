import {firestore, useUserToken} from "~/server/api/_firebase";
import ResponseCode from "~/models/ResponseCode";

export default defineEventHandler(async (event) => {
    return await useUserToken(event).then((user) => {
        const {displayName, photoURL, bio, targetUser} = getQuery(event);
        
        if (targetUser) {
            // TODO: validate permissions and update target profile
        }
        
        const userDocRef = firestore.doc(`users/${user.uid}`);
        return userDocRef.get().then((doc) => {
            if (!doc.exists) {
                return ResponseCode.NO_USER;
            }
            const data = {};
            let dataChanged = false;
            if (displayName && displayName !== doc.data().displayName) {
                data.displayName = displayName;
                dataChanged = true;
            }
            if (photoURL && photoURL !== doc.data().photoURL) {
                data.photoURL = photoURL;
                dataChanged = true;
            }
            if (bio && bio !== doc.data().bio) {
                data.bio = bio;
                dataChanged = true;
            }
            if (dataChanged) {
                userDocRef.update(data);
            } else {
                return ResponseCode.NO_CHANGE;
            }
            return ResponseCode.SUCCESS;
        }).catch((err) => {
            console.log('Error updating user profile: ' + err);
            return {
                responseCode: ResponseCode.UNKNOWN,
                error: err
            };
        });
    });
});