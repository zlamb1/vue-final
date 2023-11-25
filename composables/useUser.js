import {onAuthStateChanged} from 'firebase/auth';
import {doc, onSnapshot} from "firebase/firestore";

function useUser() {
    const db = useFirestore();
    const auth = useFirebaseAuth();
    
    const user = reactive({
        loading: true,
        signedIn: false,
        data: {}
    });
    
    let unsub = () => {}
    onAuthStateChanged(auth, (newUser) => {
        if (user.loading) {
            setTimeout(() => {
                user.loading = false;
            }, 500);
        }
        
        if (unsub) {
            unsub();
        }
        
        user.signedIn = newUser !== null;
        if (newUser) {
            unsub = onSnapshot(doc(db, 'users', newUser.uid), (doc) => {
                user.data = doc.data();
            });
        } else {
            // no user
            user.data = null;
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

export {useUser, useUserToken, signOutUser}