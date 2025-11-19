import { getStorageRef } from "firebaseConfig.js";
import { uploadBytes, getDownloadURL } from "firebase/storage";

// Denne koden er hentet fra kode i Lecture12-query-profilePage-likes i TDS200

export const uploadImageToFirebase = async (uri: string) => {
	const fetchResponse = await fetch(uri);
	const blob = await fetchResponse.blob();

	const imageName = uri.split("/").pop()?.split(".")[0] ?? "anonymtBilde";
	console.log("imageName", imageName);

	const uploadPath = `images/${imageName}`;

	const imageRef = getStorageRef(uploadPath);

	try {
		await uploadBytes(imageRef, blob);
		console.log("Laster opp bildet til", uploadPath);
		const downloadURL = await getDownloadURL(imageRef);
		console.log("Last ned URL:", downloadURL);
		return downloadURL;
	} catch (e) {
		console.error("Feil ved opplasting av bilde.", e);
		return "ERROR";
	}
};
