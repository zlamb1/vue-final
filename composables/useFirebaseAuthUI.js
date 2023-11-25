import * as firebaseui from "firebaseui";

let authUI = null;

export default function useFirebaseAuthUI() {
    if (authUI == null) {
        const auth = useFirebaseAuth();
        authUI = new firebaseui.auth.AuthUI(auth);
    }
    return {authUI};
}