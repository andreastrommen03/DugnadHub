// src/api/dugnadApi.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export async function getDugnads() {
	try {
		const snapshot = await getDocs(collection(db, "dugnader"));

		const dugnader = snapshot.docs.map((doc) => {
			const data = doc.data();

			return {
				id: doc.id,
				title: data.title,
				description: data.description,
				location: data.location,
				date: data.date,
				maxVolunteers: data.maxVolunteers,
				currentVolunteers: data.currentVolunteers,
				imageUrl: data.imageUrl ?? null,
			};
		});

		return dugnader;
	} catch (error) {
		console.error("Feil ved henting av dugnader:", error);
		throw error;
	}
}
