import {FieldValue} from "firebase-admin/firestore";
import {firestore, useUserToken} from "~/server/api/_firebase";
import ResponseCode from "~/models/ResponseCode";
import UpdateAction from "~/models/UpdateAction";
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
    return await useUserToken(event).then(async (user) => {
        const {updateAction, updateObject, targetUser} = getQuery(event);
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
        
        const parsedObject = updateObject ? JSON.parse(updateObject) : {};
        const parsedAction = parseInt(updateAction);
        
        switch (parsedAction) {
            case UpdateAction.ADD:
                if (parsedObject) {
                    // generate random id
                    parsedObject.uuid = uuidv4();
                } else {
                    return ResponseCode.INVALID_OBJECT;
                }
                await listDocRef.update({
                    ['list.' + parsedObject.uuid]: parsedObject
                });
                await listDocRef.update({
                    ['modifications.' + Date.now()]: 'add',
                });
                break;
            case UpdateAction.UPDATE:
                if (!parsedObject) {
                    return ResponseCode.INVALID_OBJECT;
                }
                await listDocRef.update({
                    ['list.' + parsedObject.uuid]: parsedObject
                });
                await listDocRef.update({
                    ['modifications.' + Date.now()]: 'update',
                });
                break;
            case UpdateAction.REMOVE:
                await listDocRef.update({
                    ['list.' + parsedObject.uuid]: FieldValue.delete(),
                })
                await listDocRef.update({
                    ['modifications.' + Date.now()]: 'remove',
                });
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