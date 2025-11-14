// src/app/_layout.tsx
import React from "react";
import { Slot } from "expo-router";
import "../global.css";

import { AuthProvider } from "../providers/authctx";

export default function RootLayout() {
	return (
		<AuthProvider>
			<Slot />
		</AuthProvider>
	);
}
