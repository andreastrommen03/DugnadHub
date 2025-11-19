import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
	// Sender alltid videre til auth-skjerm
	return <Redirect href="/authentication" />;
}
