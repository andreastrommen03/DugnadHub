// src/api/dugnadApi.ts
import {
	collection,
	doc,
	getDocs,
	getDoc,
	updateDoc,
	addDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { uploadImageToFirebase } from "./imageApi";
import { DugnadData } from "../utils/firebaseTypes";

// --- Hent alle dugnader ---
export async function getDugnads(): Promise<DugnadData[]> {
	try {
		const snapshot = await getDocs(collection(db, "dugnader"));

		const dugnader = snapshot.docs.map((docSnap) => {
			const data = docSnap.data() as any;

			const imageUrls: string[] =
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
				imageUrl: imageUrls[0] ?? null,
				imageUrls,
				participants: data.participants ?? [],
				favoritedBy: data.favoritedBy ?? [],
			};
		});

		return dugnader;
	} catch (error) {
		console.error("❌ Feil ved henting av dugnader:", error);
		throw error;
	}
}

// --- Hent én dugnad ---
export async function getDugnadById(id: string): Promise<DugnadData | null> {
	try {
		const ref = doc(db, "dugnader", id);
		const snap = await getDoc(ref);

		if (!snap.exists()) {
			console.log("❌ Fant ikke dugnaden med id:", id);
			return null;
		}

		const data = snap.data() as any;
		const imageUrls: string[] =
			data.imageUrls ?? (data.imageUrl ? [data.imageUrl] : []);

		return {
			id: snap.id,
			title: data.title,
			description: data.description,
			location: data.location,
			date: data.date,
			maxVolunteers: data.maxVolunteers,
			currentVolunteers: data.currentVolunteers ?? 0,
			category: data.category ?? "Ukjent",
			imageUrl: imageUrls[0] ?? null,
			imageUrls,
			participants: data.participants ?? [],
			favoritedBy: data.favoritedBy ?? [],
		};
	} catch (error) {
		console.error("❌ Feil ved henting av dugnad:", error);
		throw error;
	}
}

// --- Oppdater dugnad (påmelding osv.) ---
export async function updateDugnad(
	id: string,
	data: Partial<DugnadData>
): Promise<void> {
	try {
		const ref = doc(db, "dugnader", id);
		await updateDoc(ref, data);
	} catch (error) {
		console.error("Feil ved oppdatering av dugnad:", error);
		throw error;
	}
}

// --- TYPE for ny dugnad (det CreateDugnadScreen sender inn) ---
type NewDugnadInput = {
	title: string;
	description: string;
	location: string;
	date: string;
	maxVolunteers: number;
	category: string;
	images?: string[]; // rå URIs fra ImagePicker
};

// --- Opprett ny dugnad: laster opp bilder og lagrer URLer ---
export async function createDugnad(input: NewDugnadInput): Promise<string> {
	try {
		const uploadedUrls: string[] = [];

		if (Array.isArray(input.images) && input.images.length > 0) {
			for (const uri of input.images) {
				if (!uri) continue;
				const downloadURL = await uploadImageToFirebase(uri);

				// uploadImageToFirebase returnerer "ERROR" hvis noe gikk galt
				if (downloadURL && downloadURL !== "ERROR") {
					uploadedUrls.push(downloadURL);
				}
			}
		}

		const docRef = await addDoc(collection(db, "dugnader"), {
			title: input.title,
			description: input.description,
			location: input.location,
			date: input.date,
			maxVolunteers: input.maxVolunteers,
			currentVolunteers: 0,
			category: input.category,
			imageUrl: uploadedUrls[0] ?? null,
			imageUrls: uploadedUrls,
			participants: [],
		});

		return docRef.id;
	} catch (error) {
		console.error("❌ Feil ved opprettelse av dugnad:", error);
		throw error;
	}
}
