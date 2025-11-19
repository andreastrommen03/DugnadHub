import React from "react";
import { Slot } from "expo-router";
import "../global.css";

import { AuthProvider } from "../providers/authctx";
import Toast from "react-native-toast-message";

export default function RootLayout() {
	return (
		<AuthProvider>
			<>
				<Slot />
				<Toast />
			</>
		</AuthProvider>
	);
}
