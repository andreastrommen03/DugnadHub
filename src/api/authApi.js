// api/authApi.js
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

// Registrer ny bruker med e-post og passord
export const signUpWithEmail = async (email, password) => {
	const userCredential = await createUserWithEmailAndPassword(
		auth,
		email,
		password
	);
	return userCredential.user;
};

// Logg inn eksisterende bruker
export const signInWithEmail = async (email, password) => {
	const userCredential = await signInWithEmailAndPassword(
		auth,
		email,
		password
	);
	return userCredential.user;
};

// Logg ut
export const signOutUser = async () => {
	await signOut(auth);
};
