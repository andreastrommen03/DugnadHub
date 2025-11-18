// src/app/authentication.tsx
import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Pressable,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
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
		<View className="flex-1 bg-[#ECFDF3]">
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				className="flex-1"
			>
				<ScrollView
					contentContainerClassName="flex-1 justify-center px-6"
					keyboardShouldPersistTaps="handled"
				>
					<View className="items-center mb-10">
						<Text className="text-[#064E3B] text-4xl font-bold mb-2">
							DugnadHub
						</Text>
						<Text className="text-[#166534] text-center text-sm leading-5 max-w-xs">
							Logg inn eller opprett en konto for å finne, opprette og lagre
							dugnader i nærmiljøet ditt.
						</Text>
					</View>

					<View className="bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] px-5 py-6">
						<Text className="text-[#064E3B] text-2xl font-bold mb-6 text-center">
							{mode === "login" ? "Logg inn" : "Registrer deg"}
						</Text>

						<Text className="text-[#064E3B] mb-1">E-post</Text>
						<TextInput
							className="bg-[#f4fbf7] text-[#064E3B] px-4 py-2 rounded-xl border border-[#064E3B] mb-4"
							value={email}
							onChangeText={setEmail}
							autoCapitalize="none"
							keyboardType="email-address"
							placeholder="din@epost.no"
							placeholderTextColor="#6B7280"
						/>

						<Text className="text-[#064E3B] mb-1">Passord</Text>
						<TextInput
							className="bg-white rounded-xl px-4 py-3 mb-6 border border-[#BBF7D0] text-[#064E3B]"
							secureTextEntry
							value={password}
							onChangeText={setPassword}
							placeholder="Minst 6 tegn"
							placeholderTextColor="#6B7280"
						/>

						<Pressable
							className="bg-[#064E3B] rounded-full py-3 mb-3 items-center"
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
							<Text className="text-center text-[#15803D] mt-2 font-medium">
								{mode === "login"
									? "Har du ikke konto? Registrer deg"
									: "Har du allerede konto? Logg inn"}
							</Text>
						</Pressable>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
