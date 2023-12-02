import {firestore, useUserToken} from "~/server/api/_firebase";
import ResponseCode from "~/models/ResponseCode";
import UpdateAction from "~/models/UpdateAction";
import {FieldValue} from "firebase-admin/firestore";

export default defineEventHandler(async (event) => {
    return await useUserToken(event).then(async (user) => {
        const {updateAction, updateObject, targetIndex, targetUser} = getQuery(event);
        if (targetUser) {
            // TODO: validate permissions and update target profile
        }
        
        const userDocRef = firestore.doc(`users/${user.uid}`);
        const doc = await userDocRef.get();
        if (!doc.exists) {
            return ResponseCode.NO_USER;
        }
        const listDocRef = firestore.doc(`lists/${user.uid}`);
        const listDoc = await listDocRef.get();
        
        if (!listDoc.exists || !listDoc.data().list) {
            return ResponseCode.RESOURCE_NOT_FOUND;
        }
        
        const listCopy = [...listDoc.data().list];
        const parsedObject = JSON.parse(updateObject ?? '{}');
        
        const arrayIndex = parseInt(targetIndex);
        if (updateAction !== UpdateAction.ADD && (arrayIndex < 0 || arrayIndex >= listCopy.length)) {
            return ResponseCode.OUT_OF_BOUNDS_ARRAY_INDEX;
        }
        
        const parsedAction = parseInt(updateAction);
        switch (parsedAction) {
            case UpdateAction.ADD:
                await listDocRef.update('list', FieldValue.arrayUnion(parsedObject));
                break;
            case UpdateAction.UPDATE:
                listCopy[arrayIndex] = parsedObject;
                await listDocRef.set({list: listCopy});
                break;
            case UpdateAction.REMOVE:
                listCopy.splice(arrayIndex, 1);
                await listDocRef.set({list: listCopy});
                break;
            default:
                return ResponseCode.UNKNOWN_UPDATE_ACTION;
        }
        
        return ResponseCode.SUCCESS;
    }).catch((err) => {
        console.log(err);
        return ResponseCode.UNKNOWN;
    });
});