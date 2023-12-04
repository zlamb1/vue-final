import {onAuthStateChanged, reauthenticateWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {collection, doc, onSnapshot} from "firebase/firestore";
import APIEndpoints from "~/models/Endpoints";

function useUser(callback = (user) => {}) {
    const db = useFirestore();
    const auth = useFirebaseAuth();
    
    const user = reactive({
        loading: true,
        signedIn: false,
        public: {},
        private: {},
        uid: null,
    });
    
    let unsubPublic = () => {}
    let unsubPrivate = () => {}
    let unsubList = () => {}
    
    onAuthStateChanged(auth, (newUser) => {
        if (user.loading) {
            setTimeout(() => {
                user.loading = false;
            }, 500);
        }
        
        unsubPublic();
        unsubPrivate();
        unsubList();
        
        user.signedIn = false;
        if (newUser) {
            user.uid = newUser.uid;
            unsubPublic = onSnapshot(doc(db, 'users', newUser.uid), (doc) => {
                user.public = doc.data();
                // only 'sign-in' user once data has been received
                user.signedIn = true;
            });
            unsubPrivate = onSnapshot(doc(db, `users/${newUser.uid}/private/data`), (doc) => {
                user.private = doc.data();
            });
            unsubList = onSnapshot(doc(db, `lists/${newUser.uid}`), (doc) => {
                user.list = doc.data();
            });
        } else {
            // no user
            user.data = null;
            user.uid = null;
        }
        
        if (callback) {
            callback(user);
        }
    });
    
    return user;
}

function usePublicUser(uid) {
    const user = reactive({});
    
    const db = useFirestore();
    const userDocRef = doc(collection(db, 'users'), uid);
    
    onSnapshot(userDocRef, (doc) => {
        user.value = doc.data();
        user.value.id = uid;
    });
    
    return {user};
}

async function useUserToken() {
    const auth = useFirebaseAuth();
    return await auth.currentUser?.getIdToken(true)
        .catch(function(err) {
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