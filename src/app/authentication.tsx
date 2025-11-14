// src/app/authentication.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthSession } from "../providers/authctx";

export default function AuthenticationScreen() {
	const { signIn, signUp } = useAuthSession();
	const router = useRouter();

	const [mode, setMode] = useState<"login" | "register">("register");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async () => {
		try {
			if (!email || !password) {
				Alert.alert("Feil", "Fyll inn både e-post og passord.");
				return;
			}

			if (mode === "login") {
				await signIn(email.trim(), password);
			} else {
				await signUp(email.trim(), password);
			}

			// ✅ Etter vellykket login/registrering → inn i tabs
			router.replace("/(protected)/(tabs)");
		} catch (error: any) {
			console.error(error);
			Alert.alert("Feil", error?.message ?? "Noe gikk galt.");
		}
	};

	return (
		<View className="flex-1 justify-center px-6 bg-[#20202A]">
			<Text className="text-2xl font-bold text-white mb-6 text-center">
				{mode === "login" ? "Logg inn" : "Registrer deg"}
			</Text>

			<Text className="text-white mb-1">E-post</Text>
			<TextInput
				className="bg-white rounded-md px-3 py-2 mb-4"
				autoCapitalize="none"
				keyboardType="email-address"
				value={email}
				onChangeText={setEmail}
			/>

			<Text className="text-white mb-1">Passord</Text>
			<TextInput
				className="bg-white rounded-md px-3 py-2 mb-4"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>

			<Pressable
				onPress={handleSubmit}
				className="bg-[#FF9B52] rounded-full py-3 mb-3"
			>
				<Text className="text-center text-white font-semibold">
					{mode === "login" ? "Logg inn" : "Registrer deg"}
				</Text>
			</Pressable>

			<Pressable
				onPress={() =>
					setMode((prev) => (prev === "login" ? "register" : "login"))
				}
			>
				<Text className="text-center text-[#F7853E]">
					{mode === "login"
						? "Har du ikke konto? Registrer deg"
						: "Har du allerede konto? Logg inn"}
				</Text>
			</Pressable>
		</View>
	);
}
