// src/api/dugnadApi.js
import {
	collection,
	doc,
	getDocs,
	getDoc,
	updateDoc,
	addDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

// 🔹 Hent alle dugnader
export async function getDugnads() {
	try {
		const snapshot = await getDocs(collection(db, "dugnader"));

		const dugnader = snapshot.docs.map((docSnap) => {
			const data = docSnap.data();

			const imageUrls =
				data.imageUrls ?? (data.imageUrl ? [data.imageUrl] : []);

			return {
				id: docSnap.id,
				title: data.title,
				description: data.description,
				location: data.location,
				date: data.date,
				maxVolunteers: data.maxVolunteers,
				currentVolunteers: data.currentVolunteers ?? 0,
				category: data.category ?? "Ukjent",
				imageUrl: data.imageUrl ?? imageUrls[0] ?? null,
				imageUrls,
				participants: data.participants ?? [],
			};
		});

		return dugnader;
	} catch (error) {
		console.error("❌ Feil ved henting av dugnader:", error);
		throw error;
	}
}

// 🔹 Hent én dugnad
export async function getDugnadById(id) {
	try {
		const ref = doc(db, "dugnader", id);
		const snap = await getDoc(ref);

		if (!snap.exists()) {
			console.log("❌ Fant ikke dugnaden med id:", id);
			return null;
		}

		const data = snap.data();

		const imageUrls = data.imageUrls ?? (data.imageUrl ? [data.imageUrl] : []);

		return {
			id: snap.id,
			title: data.title,
			description: data.description,
			location: data.location,
			date: data.date,
			maxVolunteers: data.maxVolunteers,
			currentVolunteers: data.currentVolunteers ?? 0,
			category: data.category ?? "Ukjent",
			imageUrl: data.imageUrl ?? imageUrls[0] ?? null,
			imageUrls,
			participants: data.participants ?? [],
		};
	} catch (error) {
		console.error("❌ Feil ved henting av dugnad:", error);
		throw error;
	}
}

// 🔹 Oppdater dugnad (påmelding osv.)
export async function updateDugnad(id, data) {
	try {
		const ref = doc(db, "dugnader", id);
		await updateDoc(ref, data);
	} catch (error) {
		console.error("❌ Feil ved oppdatering av dugnad:", error);
		throw error;
	}
}

// 🔹 Opprett ny dugnad – nå med imageUrls
export async function createDugnad(dugnadData) {
	try {
		const ref = await addDoc(collection(db, "dugnader"), {
			title: dugnadData.title,
			description: dugnadData.description,
			location: dugnadData.location,
			date: dugnadData.date,
			maxVolunteers: dugnadData.maxVolunteers,
			currentVolunteers: 0,
			category: dugnadData.category,
			imageUrl:
				dugnadData.imageUrls && dugnadData.imageUrls.length > 0
					? dugnadData.imageUrls[0]
					: null,
			imageUrls: dugnadData.imageUrls ?? [],
			participants: [],
		});

		return ref.id;
	} catch (error) {
		console.error("❌ Feil ved opprettelse av dugnad:", error);
		throw error;
	}
}
