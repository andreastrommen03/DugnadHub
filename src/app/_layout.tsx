// src/app/_layout.tsx
import React from "react";
import { Slot } from "expo-router";
import "../global.css";

import "../global.css"; // tailwind (kan stå, selv om det bare trengs for web)
import { AuthProvider } from "../providers/authctx";

export default function RootLayout() {
	return (
		<AuthProvider>
			<Slot />
		</AuthProvider>
	);
}
