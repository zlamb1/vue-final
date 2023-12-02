import {firestore, useUserToken} from "~/server/api/_firebase";
import ResponseCode from "~/models/ResponseCode";

export default defineEventHandler(async (event) => {
    return await useUserToken(event).then(async (user) => {
        const {displayName, photoURL, bio, profilePrivate, targetUser} = getQuery(event);
        
        if (targetUser) {
            // TODO: validate permissions and update target profile
        }
        
        const userDocRef = firestore.doc(`users/${user.uid}`);
        const userDoc = await userDocRef.get();
        if (!userDoc.exists) {
            return ResponseCode.NO_USER;
        }
        
        const userDocData = userDoc.data();
        const data = {};
        
        // displayName is required
        if (displayName && displayName !== userDocData.displayName) {
            data.displayName = displayName;
        }
        
        if (photoURL !== undefined && photoURL !== userDocData.photoURL) {
            data.photoURL = photoURL;
        }
        
        if (bio !== undefined && bio !== userDocData.bio) {
            data.bio = bio;
        }
        
        if (profilePrivate !== undefined && profilePrivate !== userDocData.profilePrivate) {
            data.profilePrivate = profilePrivate;
        }
        
        if (Object.keys(data).length === 0) {
            return ResponseCode.NO_CHANGE;
        }
        
        await userDocRef.update(data);
        return ResponseCode.SUCCESS;
    }).catch(() => {
        return ResponseCode.UNKNOWN;
    });
});