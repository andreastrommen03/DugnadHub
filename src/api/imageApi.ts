import { Platform } from "react-native";
import { getStorageRef } from "../../firebaseConfig";
import { uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageToFirebase = async (uri: string) => {
	// Web fallback (unngår CORS-feil)
	if (Platform.OS === "web") {
		console.log("[imageApi] Web: bruker lokal URI i stedet:", uri);
		return uri;
	}

	const response = await fetch(uri);
	const blob = await response.blob();

	const imageName = uri.split("/").pop() ?? `img-${Date.now()}`;
	const path = `images/${imageName}`;
	const ref = getStorageRef(path);

	try {
		await uploadBytes(ref, blob);
		const url = await getDownloadURL(ref);
		return url;
	} catch (err) {
		console.error("❌ Upload failed", err);
		return uri; // fallback
	}
};
