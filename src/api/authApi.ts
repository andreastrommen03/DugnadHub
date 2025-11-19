import { auth } from "../../firebaseConfig";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";

// Denne koden er basert på kode fra Lecture12-query-profilePage-likes i TDS200

// Logg inn, e-post og passord
export const signIn = async (email: string, password: string) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		console.log("Bruker logget inn:", userCredential.user.email);
		return userCredential.user;
	} catch (error: any) {
		console.error("Kunne ikke logge inn:", error.message);
		throw error;
	}
};

// Logg ut
export const signOut = async () => {
	try {
		await auth.signOut();
		console.log("Bruker logget ut");
	} catch (error: any) {
		console.error("Feil ved utlogging:", error.message);
		throw error;
	}
};

// Registrer deg, brukernavn, e-post og passord
export const signUp = async (
	email: string,
	password: string,
	username: string
) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		if (auth.currentUser) {
			await updateProfile(auth.currentUser, {
				displayName: username,
			});
		}

		return userCredential.user;
	} catch (error: any) {
		console.error(`Signup error: ${error.code}, message: ${error.message}`);
		throw error;
	}
};
