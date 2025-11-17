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

// ---------- Typer ----------

type NewDugnadInput = {
	title: string;
	description: string;
	location: string;
	date: string;
	maxVolunteers: number;
	category: string;
	images?: string[]; // rå URIs fra ImagePicker
};

// ---------- Hent alle dugnader ----------

export async function getDugnads(): Promise<DugnadData[]> {
	try {
		const snapshot = await getDocs(collection(db, "dugnader"));

		return snapshot.docs.map((docSnap) => {
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
			};
		});
	} catch (error) {
		console.error("❌ Feil ved henting av dugnader:", error);
		throw error;
	}
}

// ---------- Hent én dugnad ----------

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
		};
	} catch (error) {
		console.error("❌ Feil ved henting av dugnad:", error);
		throw error;
	}
}

// ---------- Oppdater dugnad (påmelding osv.) ----------

export async function updateDugnad(id: string, data: Partial<DugnadData>) {
	try {
		const ref = doc(db, "dugnader", id);
		await updateDoc(ref, data as any);
	} catch (error) {
		console.error("❌ Feil ved oppdatering av dugnad:", error);
		throw error;
	}
}

// ---------- Opprett ny dugnad (inkl. bildefiler) ----------

export async function createDugnad(input: NewDugnadInput) {
	try {
		// 1) Last opp bilder hvis noen er valgt
		let imageUrls: string[] = [];

		if (input.images && input.images.length > 0) {
			const uploaded: string[] = [];

			for (const uri of input.images) {
				const url = await uploadImageToFirebase(uri);
				if (url) {
					uploaded.push(url);
				} else {
					console.warn("⚠️ Klarte ikke å laste opp et bilde, hopper over.");
				}
			}

			imageUrls = uploaded;
		}

		// 2) Lag Firestore-dokument
		const docRef = await addDoc(collection(db, "dugnader"), {
			title: input.title,
			description: input.description,
			location: input.location,
			date: input.date,
			maxVolunteers: input.maxVolunteers,
			currentVolunteers: 0,
			category: input.category,
			imageUrl: imageUrls[0] ?? null,
			imageUrls,
			participants: [],
		});

		console.log("✅ DUGNAD OPPRETTET med id:", docRef.id);
		return docRef.id;
	} catch (error) {
		console.error("❌ Feil ved opprettelse av dugnad:", error);
		throw error;
	}
}
