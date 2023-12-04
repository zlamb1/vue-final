import {firestore, useUserToken} from "~/server/api/_firebase";
import ResponseCode from "~/models/ResponseCode";

export default defineEventHandler(async (event) => {
    return await useUserToken(event).then(async (user) => {
        const {displayName, photoURL, bio, profilePrivate, targetUser} = getQuery(event);
        
        if (targetUser) {
            // TODO: validate permissions and update target profile
        }
        
        const publicDocRef = firestore.doc(`users/${user.uid}`);
        const publicDoc = await publicDocRef.get();
        const privateDocRef = firestore.doc(`users/${user.uid}/private/data`);
        const privateDoc = await privateDocRef.get();
        
        if (!publicDoc.exists || !privateDoc.exists) {
            return ResponseCode.NO_USER;
        }
        
        const updateData = {};
        
        // displayName is required
        if (displayName) {
            updateData.displayName = displayName;
        }
        
        if (photoURL) {
            updateData.photoURL = photoURL;
        }
        
        if (bio) {
            await privateDocRef.update({
                bio: bio,
            });
        }
        
        if (Object.keys(updateData).length > 0) {
            await publicDocRef.update(updateData);
        }
        
        return ResponseCode.SUCCESS;
    }).catch(() => {
        return ResponseCode.UNKNOWN;
    });
});