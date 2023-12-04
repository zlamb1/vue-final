import {onAuthStateChanged, reauthenticateWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {doc, onSnapshot} from "firebase/firestore";
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
    
    let unsub = () => {}
    let unsub2 = () => {}
    onAuthStateChanged(auth, (newUser) => {
        if (user.loading) {
            setTimeout(() => {
                user.loading = false;
            }, 500);
        }
        
        if (unsub) {
            unsub();
        }
        if (unsub2) {
            unsub2();
        }
        
        user.signedIn = false;
        if (newUser) {
            user.uid = newUser.uid;
            unsub = onSnapshot(doc(db, 'users', newUser.uid), (doc) => {
                user.public = doc.data();
                // only 'sign-in' user once data has been received
                user.signedIn = true;
            });
            unsub2 = onSnapshot(doc(db, `users/${newUser.uid}/private/data`), (doc) => {
                user.private = doc.data();
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

export {useUser, useUserToken, signOutUser, deleteUser}