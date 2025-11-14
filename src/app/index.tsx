// src/app/index.tsx
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
	// Sender alltid videre til auth-skjermen
	return <Redirect href="/authentication" />;
}
