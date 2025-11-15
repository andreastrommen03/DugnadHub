// src/api/dugnadApi.js
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export async function getDugnads() {
	try {
		const snapshot = await getDocs(collection(db, "dugnader"));

		const dugnader = snapshot.docs.map((docSnap) => {
			const data = docSnap.data();

			return {
				id: docSnap.id,
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

// 🔥 Hent én dugnad basert på id (til detaljsiden)
export async function getDugnadById(id) {
	try {
		const ref = doc(db, "dugnader", id);
		const snap = await getDoc(ref);

		if (!snap.exists()) {
			console.log("Fant ikke dugnaden med id:", id);
			return null;
		}

		const data = snap.data();

		return {
			id: snap.id,
			title: data.title,
			description: data.description,
			location: data.location,
			date: data.date,
			maxVolunteers: data.maxVolunteers,
			currentVolunteers: data.currentVolunteers,
			imageUrl: data.imageUrl ?? null,
		};
	} catch (error) {
		console.error("Feil ved henting av dugnad:", error);
		throw error;
	}
}
