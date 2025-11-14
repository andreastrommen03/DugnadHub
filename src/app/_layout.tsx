// src/app/_layout.tsx
// import "./global.css";
import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../providers/authctx";

export default function RootLayout() {
	return (
		<AuthProvider>
			<Slot />
		</AuthProvider>
	);
}
