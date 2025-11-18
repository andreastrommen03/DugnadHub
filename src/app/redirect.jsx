// src/app/redirect.tsx
import React, { useEffect } from "react";
import { View, Text } from "react-native";

import * as WebBrowser from "expo-web-browser";
import Toast from "react-native-toast-message";

WebBrowser.maybeCompleteAuthSession(); // viktig for Google Auth

export default function RedirectHandler() {
	useEffect(() => {
		if (typeof window === "undefined") return;

		// Google returnerer id_token i URL-hashen (#id_token=...)
		const hash = window.location.hash.startsWith("#")
			? window.location.hash.substring(1)
			: window.location.hash;

		const params = new URLSearchParams(hash);
		const idToken = params.get("id_token");

		if (window.opener) {
			if (idToken) {
				// 🎉 Vellykket Google-login
				Toast.show({
					type: "success",
					text1: "Innlogging vellykket!",
					text2: "Logger deg inn...",
				});

				// Send token tilbake til authentication.tsx
				window.opener.postMessage(
					{
						type: "google-auth",
						idToken,
					},
					"*"
				);
			} else {
				// ❌ Feil ved login
				Toast.show({
					type: "error",
					text1: "Google-innlogging feilet",
					text2: "Mangler id_token",
				});

				window.opener.postMessage(
					{
						type: "google-auth",
						error: "Mangler id_token i redirect-URL",
					},
					"*"
				);
			}

			// Lukker popup (akkurat som Yuan)
			setTimeout(() => {
				window.close();
			}, 800);
		} else {
			// Fallback om redirect åpnes direkte
			window.location.replace("/");
		}
	}, []);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "#ECFDF3",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Text style={{ color: "#064E3B", fontSize: 16 }}>
				Fullfører Google-innlogging...
			</Text>

			{/* Toast-container */}
			<Toast />
		</View>
	);
}
