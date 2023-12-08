import type {ComputedRef} from "vue";
import {onAuthStateChanged, reauthenticateWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore";
import APIEndpoints from "~/models/Endpoints";

function useUser(uid : string | ComputedRef<string>, callback = (user) => {}) {
    const db = useFirestore();
    const auth = useFirebaseAuth();
    
    const user = reactive({
        loading: true,
        public: null,
        private: null,
        uid: null,
    });

    let unsubAuth = () => {}
    let unsubPublic = () => {}
    let unsubPrivate = () => {}
    let unsubList = () => {}
    
    const onError = () => {}

    const createSnapshot = (uid) => {
        unsubPublic = onSnapshot(doc(db, 'users', uid), (doc) => {
            user.public = doc.data();
            user.loading = false;
        }, onError);
        unsubPrivate = onSnapshot(doc(db, `users/${uid}/private/data`), (doc) => {
            user.private = doc.data();
        }, onError);
        unsubList = onSnapshot(doc(db, `lists/${uid}`), (doc) => {
            user.list = doc.data();
        }, onError);
    }

    if (typeof uid === 'string') {
        createSnapshot(uid);
    } else {
        const createUserSnapshot = (uid) => {
            if (uid) {
                unsubAuth = () => {}
                createSnapshot(uid);
            } else {
                unsubAuth = onAuthStateChanged(auth, (newUser) => {
                    unsubPublic();
                    unsubPrivate();
                    unsubList();

                    if (newUser) {
                        user.uid = newUser?.uid;
                        createSnapshot(newUser?.uid);
                    } else {
                        // no user
                        user.data = null;
                        user.uid = null;
                    }

                    if (callback) {
                        callback(user);
                    }
                });
            }
        }

        createUserSnapshot(uid?.value);

        if (uid) {
            watch(uid, (newUID) => {
                unsubAuth();
                unsubPublic();
                unsubPrivate();
                unsubList();
                createUserSnapshot(newUID);
            });
        }
    }
    
    return user;
}

function usePublicUser(uid) {
    const user = reactive({
        data: {},
        isPrivate: false,
    });
    
    const db = useFirestore();
    const userDocRef = doc(collection(db, 'users'), uid);
    
    onSnapshot(userDocRef, (doc) => {
        user.data = doc.data();
        user.data.id = uid;
    });
    
    const privateDocRef = doc(collection(db, `users/${uid}/private`), 'data');
    getDoc(privateDocRef).then(() => {
        user.isPrivate = false;
    }).catch(() => {
        user.isPrivate = true;
    });
    
    return {user};
}

async function useUserToken() {
    const auth = useFirebaseAuth();
    return await auth.currentUser?.getIdToken(true)
        .catch(() => {
            // handle error
        });
}

async function signOutUser() {
    const auth = useFirebaseAuth();
    return auth.signOut();
}

async function deleteUser() {
    const auth = useFirebaseAuth();
    if (auth.currentUser) {
        const idToken = await useUserToken();
        // TODO: handle other providers
        const provider = new GoogleAuthProvider();
        // reauthenticate user
        return reauthenticateWithPopup(auth.currentUser, provider).then(async () => {
            return useFetch(APIEndpoints.DELETE_USER, {
                query: {idToken}
            });
        });
    }
}

export {useUser, usePublicUser, useUserToken, signOutUser, deleteUser}