import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "firebaseConfig";

// Denne koden er hentet fra kode i Lecture12-query-profilePage-likes i TDS200

export async function signInWithGoogleCredential(idToken: string) {
	const credential = GoogleAuthProvider.credential(idToken);
	const userCredential = await signInWithCredential(auth, credential);
	return userCredential.user;
}
