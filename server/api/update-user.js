import {firestore, useUserToken} from "~/server/api/_firebase";
import {FieldValue} from "firebase-admin/firestore";
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import ResponseCode from "~/models/ResponseCode";

const window = new JSDOM('').window;
const purify = DOMPurify(window);

function parseVisibility(visibility) {
    switch (visibility?.toLowerCase()) {
        case 'public':
            return true;
        default:
            return false;
    }
}

async function updateListVisibility(uid, listVisibility) {
    const listDocRef = firestore.doc(`lists/${uid}`);
    await listDocRef.update({
        visibility: listVisibility,
    });
    const publicDocRef = firestore.doc('lists/public');
    await publicDocRef.update({
        users: parseVisibility(listVisibility) ? FieldValue.arrayUnion(uid) : FieldValue.arrayRemove(uid),
    });
}

export default defineEventHandler(async (event) => {
    return await useUserToken(event).then(async (user) => {
        const {displayName, photoURL, bio, profileVisibility, listVisibility, targetUser} = getQuery(event);
        
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
        
        if (listVisibility !== undefined) {
            await updateListVisibility(user.uid, listVisibility);
        }
        
        {
            const update = {};
            if (displayName) {
                update.displayName = displayName;
            }
            
            if (photoURL !== undefined) {
                update.photoURL = photoURL;
            }
            
            if (Object.keys(update).length > 0) {
                await publicDocRef.update(update);
            }
        }
        
        {
            const update = {};
            if (bio !== undefined) {
                update.bio = purify.sanitize(bio, { USE_PROFILES: { html: true } });
            }
            
            if (profileVisibility !== undefined) {
                update.visibility = profileVisibility;
            }
            
            if (Object.keys(update).length > 0) {
                await privateDocRef.update(update);
            }
        }
        
        return ResponseCode.SUCCESS;
    }).catch(() => {
        return ResponseCode.UNKNOWN;
    });
});