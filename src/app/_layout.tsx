// src/app/_layout.tsx
import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../providers/authctx";

// ❌ midlertidig slå av global.css
// import "./global.css";   // kommenter bort denne linja hvis den finnes

export default function RootLayout() {
	return (
		<AuthProvider>
			<Slot />
		</AuthProvider>
	);
}
