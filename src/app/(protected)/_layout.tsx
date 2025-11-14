// src/app/(protected)/_layout.tsx
import React from "react";
import { Stack, Redirect } from "expo-router";
import { useAuthSession } from "../../providers/authctx";

export default function ProtectedLayout() {
	const { user, isLoading } = useAuthSession();

	// Mens vi ikke vet om brukeren er logget inn
	if (isLoading) {
		return null; // evt. en Loader-komponent
	}

	// Ikke innlogget → send til authentication
	if (!user) {
		return <Redirect href="/authentication" />;
	}

	// Innlogget → vis stacken
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen name="dugnadDetails/[id]" options={{ title: "Dugnad" }} />
			<Stack.Screen name="createDugnad" options={{ title: "Ny dugnad" }} />
		</Stack>
	);
}
