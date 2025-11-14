// src/api/authApi.js
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { auth } from "../../firebaseConfig"; // 🚨 legg merke til ../../

export const signUpWithEmail = async (email, password) => {
	const cred = await createUserWithEmailAndPassword(auth, email, password);
	return cred.user;
};

export const signInWithEmail = async (email, password) => {
	const cred = await signInWithEmailAndPassword(auth, email, password);
	return cred.user;
};

export const signOutUser = async () => {
	await signOut(auth);
};
