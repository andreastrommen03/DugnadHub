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
		<View className="flex-1 bg-[#20202A] justify-center px-6">
			<Text className="text-white text-3xl font-bold text-center mb-8">
				{mode === "login" ? "Logg inn" : "Registrer deg"}
			</Text>

			<Text className="text-white mb-1">E-post</Text>
			<TextInput
				className="bg-white rounded-xl px-4 py-3 mb-4"
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
				keyboardType="email-address"
				placeholder="din@epost.no"
				placeholderTextColor="#9ca3af"
			/>

			<Text className="text-white mb-1">Passord</Text>
			<TextInput
				className="bg-white rounded-xl px-4 py-3 mb-6"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
				placeholder="Minst 6 tegn"
				placeholderTextColor="#9ca3af"
			/>

			<Pressable
				className="bg-[#FF9B52] rounded-full py-3 mb-3 items-center"
				onPress={submit}
			>
				<Text className="text-white font-semibold text-base">
					{mode === "login" ? "Logg inn" : "Registrer meg"}
				</Text>
			</Pressable>

			<Pressable
				onPress={() =>
					setMode((prev) => (prev === "login" ? "register" : "login"))
				}
			>
				<Text className="text-center text-[#F7853E] mt-2">
					{mode === "login"
						? "Har du ikke konto? Registrer deg"
						: "Har du allerede konto? Logg inn"}
				</Text>
			</Pressable>
		</View>
	);
}
