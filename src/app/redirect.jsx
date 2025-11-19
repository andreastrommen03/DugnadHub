import React, { useEffect } from "react";
import { View, Text } from "react-native";

// Denne koden er basert på kode fra Lecture12-query-profilePage-likes i TDS200

export default function RedirectHandler() {
	useEffect(() => {
		// Plukk ut id_token fra hash i URL
		const hash = window.location.hash.startsWith("#")
			? window.location.hash.substring(1)
			: window.location.hash;

		const params = new URLSearchParams(hash);
		const idToken = params.get("id_token");

		if (idToken && window.opener) {
			// Send token tilbake til hovedvinduet
			window.opener.postMessage(
				{
					type: "GOOGLE_AUTH_SUCCESS",
					idToken,
				},
				"*"
			);
			window.close();
		} else {
			// Fallback
			window.location.href = "/";
		}
	}, []);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "#ECFDF3",
				alignItems: "center",
				justifyContent: "center",
				paddingHorizontal: 24,
			}}
		>
			<Text
				style={{
					color: "#064E3B",
					fontSize: 18,
					fontWeight: "600",
					textAlign: "center",
				}}
			>
				Fullfører innlogging med Google …
			</Text>
		</View>
	);
}
