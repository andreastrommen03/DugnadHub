// src/app/authentication.tsx
import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthSession } from "../providers/authctx";

export default function AuthenticationScreen() {
	const { signIn, signUp } = useAuthSession();
	const router = useRouter();

	const [mode, setMode] = useState<"login" | "register">("register");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const submit = async () => {
		if (!email || !password) {
			Alert.alert("Feil", "Fyll inn både e-post og passord.");
			return;
		}

		try {
			if (mode === "login") {
				await signIn(email.trim(), password);
			} else {
				await signUp(email.trim(), password);
			}
			router.replace("/(protected)/(tabs)");
		} catch (e: any) {
			Alert.alert("Feil", e?.message ?? "Kunne ikke logge inn.");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{mode === "login" ? "Logg inn" : "Registrer deg"}
			</Text>

			<Text style={styles.label}>E-post</Text>
			<TextInput
				style={styles.input}
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
			/>

			<Text style={styles.label}>Passord</Text>
			<TextInput
				style={styles.input}
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>

			<TouchableOpacity style={styles.button} onPress={submit}>
				<Text style={styles.buttonText}>
					{mode === "login" ? "Logg inn" : "Registrer meg"}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() =>
					setMode((prev) => (prev === "login" ? "register" : "login"))
				}
			>
				<Text style={styles.switchText}>
					{mode === "login"
						? "Har du ikke konto? Registrer deg"
						: "Har du allerede konto? Logg inn"}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#20202A",
		justifyContent: "center",
		paddingHorizontal: 24,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
		textAlign: "center",
		marginBottom: 24,
	},
	label: {
		color: "#fff",
		marginBottom: 4,
	},
	input: {
		backgroundColor: "#fff",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginBottom: 16,
	},
	button: {
		backgroundColor: "#FF9B52",
		borderRadius: 24,
		paddingVertical: 12,
		alignItems: "center",
		marginBottom: 12,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	switchText: {
		color: "#F7853E",
		textAlign: "center",
	},
});
