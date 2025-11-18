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
	const [username, setUsername] = useState("");

	const submit = async () => {
		if (!email || !password || (mode === "register" && !username.trim())) {
			Alert.alert(
				"Feil",
				mode === "register"
					? "Fyll inn e-post, passord og navn/brukernavn."
					: "Fyll inn både e-post og passord."
			);
			return;
		}

		try {
			if (mode === "login") {
				await signIn(email.trim(), password);
			} else {
				await signUp(email.trim(), password, username.trim());
			}

			router.replace("/(protected)/(tabs)");
		} catch (e: any) {
			Alert.alert("Feil", e?.message ?? "Kunne ikke logge inn.");
		}
	};

	return (
		<View className="flex-1 bg-[#ECFDF3] justify-center px-6">
			{/* Overskrift */}
			<Text className="text-[#064E3B] text-3xl font-bold text-center mb-10">
				{mode === "login" ? "Logg inn" : "Registrer deg"}
			</Text>

			{/* Container som holder inputs midtstilt og smal */}
			<View
				style={{
					width: "100%",
					maxWidth: 380, // 🎯 Perfekt smalt og midtstilt
					alignSelf: "center",
				}}
			>
				{/* Navn (kun registrering) */}
				{mode === "register" && (
					<>
						<Text className="text-[#064E3B] mb-1">Navn / brukernavn</Text>
						<TextInput
							className="bg-[#f4fbf7] rounded-xl px-4 py-3 mb-4 border border-[#064E3B]"
							value={username}
							onChangeText={setUsername}
							autoCapitalize="none"
							keyboardType="email-address"
							placeholder="Ola Normann"
							placeholderTextColor="#6B7280"
						/>
					</>
				)}

				{/* E-post */}
				<Text className="text-[#064E3B] mb-1">E-post</Text>
				<TextInput
					className="bg-[#f4fbf7] rounded-xl px-4 py-3 mb-4 border border-[#064E3B]"
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
					keyboardType="email-address"
					placeholder="ola@normann.no"
					placeholderTextColor="#6B7280"
				/>

				{/* Passord */}
				<Text className="text-[#f4fbf7] mb-1">Passord</Text>
				<TextInput
					className="bg-[#F0FDF4] rounded-xl px-4 py-3 mb-6 border border-[#064E3B]"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
					placeholder="Minst 6 tegn"
					placeholderTextColor="#6B7280"
				/>

				{/* Primær knapp */}
				<Pressable
					className="rounded-full py-3 mb-3 items-center"
					style={{
						backgroundColor: "#064E3B",
					}}
					onPress={submit}
				>
					<Text className="text-white font-semibold text-base">
						{mode === "login" ? "Logg inn" : "Registrer meg"}
					</Text>
				</Pressable>

				{/* Bytt modus */}
				<Pressable
					onPress={() =>
						setMode((prev) => (prev === "login" ? "register" : "login"))
					}
				>
					<Text className="text-center text-[#166534] mt-2 font-semibold">
						{mode === "login"
							? "Har du ikke konto? Registrer deg"
							: "Har du allerede konto? Logg inn"}
					</Text>
				</Pressable>
			</View>
		</View>
	);
}
