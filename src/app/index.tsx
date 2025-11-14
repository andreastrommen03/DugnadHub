// src/app/index.tsx
import React from "react";
import { Redirect } from "expo-router";

export default function Index() {
	// Sender brukeren inn i tabs-layouten
	return <Redirect href="/(protected)/(tabs)" />;
}
