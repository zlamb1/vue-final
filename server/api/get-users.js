import {firestore, useUserToken} from "~/server/api/_firebase";
import ResponseCode from "~/models/ResponseCode";

export default defineEventHandler(async (event) => {
    const user = await useUserToken(event);
    const privateUserDocRef = firestore.doc(`users/${user.uid}/private/data`);
    const privateUserDoc = await privateUserDocRef.get();
    const privateUser = privateUserDoc.data();
    
    if (!privateUser?.roles?.admin) {
        return ResponseCode.NO_PERMS;
    }
    
    const userCollectionRef = firestore.collection(`users`);
    const userCollection = await userCollectionRef.get();
    const userDocs = []
    
    userCollection.forEach(doc => {
        userDocs.push(doc);
    });
    
    const users = [];
    for (const doc of userDocs) {
        const publicData = doc.data();
        const privateDocRef = firestore.doc(`users/${doc.id}/private/data`);
        const privateDoc = await privateDocRef.get();
        const privateData = privateDoc.data();
        users.push({...publicData, ...privateData, uid: doc.id});
    }
    
    return users;
});