// src/api/dugnadApi.js
import {
	collection,
	doc,
	getDocs,
	getDoc,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

// 🔹 Hent alle dugnader (listevisning)
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
				currentVolunteers: data.currentVolunteers ?? 0, // 👈 bruker feltet, ikke participants
				imageUrl: data.imageUrl ?? null,
				category: data.category ?? "Ukjent",
				participants: data.participants ?? [], // bare ekstra info
			};
		});

		return dugnader;
	} catch (error) {
		console.error("❌ Feil ved henting av dugnader:", error);
		throw error;
	}
}

// 🔹 Hent én dugnad (detaljvisning)
export async function getDugnadById(id) {
	try {
		const ref = doc(db, "dugnader", id);
		const snap = await getDoc(ref);

		if (!snap.exists()) {
			console.log("❌ Fant ikke dugnaden med id:", id);
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
			currentVolunteers: data.currentVolunteers ?? 0, // 👈 samme her
			imageUrl: data.imageUrl ?? null,
			category: data.category ?? "Ukjent",
			participants: data.participants ?? [],
		};
	} catch (error) {
		console.error("❌ Feil ved henting av dugnad:", error);
		throw error;
	}
}

// 🔹 Oppdater dugnad
export async function updateDugnad(id, data) {
	try {
		const ref = doc(db, "dugnader", id);
		await updateDoc(ref, data);
	} catch (error) {
		console.error("❌ Feil ved oppdatering av dugnad:", error);
		throw error;
	}
}
