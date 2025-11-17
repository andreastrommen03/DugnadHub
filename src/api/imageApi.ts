// src/api/imageApi.ts
import { getStorageRef } from "../../firebaseConfig";
import { uploadBytes, getDownloadURL } from "firebase/storage";

// Laster opp *ett* bilde og returnerer downloadURL eller null
export const uploadImageToFirebase = async (
	uri: string
): Promise<string | null> => {
	try {
		console.log("🚀 Starter opplasting av bilde:", uri);

		// 1. Hent blob fra lokal URI (samme som Yuan gjør)
		const response = await fetch(uri);
		const blob = await response.blob();

		// 2. Lag et filnavn
		const lastPart = uri.split("/").pop() ?? `image-${Date.now()}`;
		const cleanName = lastPart.split("?")[0]; // fjerner ev. query-params
		const storagePath = `images/${cleanName}`;

		// 3. Få en ref til Storage og last opp
		const imageRef = getStorageRef(storagePath);
		console.log("📂 Laster opp til:", storagePath);

		await uploadBytes(imageRef, blob);
		const downloadURL = await getDownloadURL(imageRef);

		console.log("✅ Upload OK, URL:", downloadURL);
		return downloadURL;
	} catch (e) {
		console.error("❌ error uploading image", e);
		return null;
	}
};
