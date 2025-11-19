// src/app/authentication.tsx
import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Pressable,
	Platform,
	Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthSession } from "../providers/authctx";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import Toast from "react-native-toast-message";
import { signInWithGoogleCredential } from "../api/googleSignIn";

WebBrowser.maybeCompleteAuthSession();

export default function AuthenticationScreen() {
	const { signIn, signUp } = useAuthSession();
	const router = useRouter();
	const [mode, setMode] = useState<"login" | "register">("register");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
	if (!webClientId) {
		console.warn("Mangler EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID i .env");
	}

	// Redirect-URL
	const redirectUri =
		Platform.OS === "web"
			? "http://127.0.0.1:8081/redirect"
			: AuthSession.makeRedirectUri();

	const [request, response, promptAsync] = Google.useAuthRequest({
		clientId: webClientId!,
		redirectUri,
		responseType: "id_token",
		scopes: ["openid", "profile", "email"],
	});

	const submit = async () => {
		if (!email || !password || (mode === "register" && !username.trim())) {
			Toast.show({
				type: "error",
				text1: "Feil",
				text2:
					mode === "register"
						? "Fyll inn e-post, passord og navn/brukernavn."
						: "Fyll inn både e-post og passord.",
			});
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
			Toast.show({
				type: "error",
				text1: "Feil",
				text2: e?.message ?? "Kunne ikke logge inn.",
			});
		}
	};

	// Google knapp
	const handleGoogleLogin = async () => {
		if (!request) {
			Toast.show({
				type: "error",
				text1: "Google-innlogging",
				text2: "Kan ikke starte Google-innlogging ennå.",
			});
			return;
		}

		try {
			await promptAsync();
		} catch (e: any) {
			Toast.show({
				type: "error",
				text1: "Feil",
				text2: e?.message ?? "Kunne ikke starte Google-innlogging.",
			});
		}
	};

	useEffect(() => {
		// Lytter på meldinger fra redirect vindu
		if (Platform.OS === "web") {
			const handleMessage = async (event: MessageEvent) => {
				if (!event.data || typeof event.data !== "object") return;

				const { type, idToken, error } = event.data as {
					type?: string;
					idToken?: string;
					error?: string;
				};

				if (type !== "GOOGLE_AUTH_SUCCESS") return;

				if (error) {
					Toast.show({
						type: "error",
						text1: "Google-innlogging feilet",
						text2: error,
					});
					return;
				}

				if (idToken) {
					try {
						await signInWithGoogleCredential(idToken);
						Toast.show({
							type: "success",
							text1: "Innlogging vellykket",
						});
						router.replace("/(protected)/(tabs)");
					} catch (e: any) {
						Toast.show({
							type: "error",
							text1: "Feil",
							text2: e?.message ?? "Kunne ikke logge inn med Google.",
						});
					}
				}
			};

			window.addEventListener("message", handleMessage);
			return () => {
				window.removeEventListener("message", handleMessage);
			};
		}

		// Native, bruker responsen direkte
		if (response?.type === "success") {
			const idToken = (response as any).params?.id_token as string | undefined;

			if (!idToken) return;

			(async () => {
				try {
					await signInWithGoogleCredential(idToken);
					Toast.show({
						type: "success",
						text1: "Innlogging vellykket",
					});
					router.replace("/(protected)/(tabs)");
				} catch (e: any) {
					Toast.show({
						type: "error",
						text1: "Feil",
						text2: e?.message ?? "Kunne ikke logge inn med Google.",
					});
				}
			})();
		}
	}, [response, router]);

	return (
		<View className="flex-1 bg-[#ECFDF3] justify-center px-6">
			// Overskrift, Logg inn/Registrer deg
			<Text className="text-[#064E3B] text-3xl font-bold text-center mb-10">
				{mode === "login" ? "Logg inn" : "Registrer deg"}
			</Text>
			<View
				style={{
					width: "100%",
					maxWidth: 380,
					alignSelf: "center",
				}}
			>
				// Navn/brukernavn, kun ved registrering
				{mode === "register" && (
					<>
						<Text className="text-[#064E3B] mb-1">Navn / brukernavn</Text>
						<TextInput
							className="bg-[#f4fbf7] rounded-xl px-4 py-3 mb-4 border border-[#064E3B]"
							value={username}
							onChangeText={setUsername}
							autoCapitalize="none"
							placeholder="Ola Normann"
							placeholderTextColor="#6B7280"
						/>
					</>
				)}
				// E-post
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
				// Passord
				<Text className="text-[#064E3B] mb-1">Passord</Text>
				<TextInput
					className="bg-[#F0FDF4] rounded-xl px-4 py-3 mb-6 border border-[#064E3B]"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
					placeholder="Minst 6 tegn"
					placeholderTextColor="#6B7280"
				/>
				// Logg inn/registrer deg knapp
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
				<View className="flex-row items-center my-4">
					<View className="flex-1 h-[1px] bg-[#BBF7D0]" />
					<Text className="mx-3 text-[#166534] font-medium">eller</Text>
					<View className="flex-1 h-[1px] bg-[#BBF7D0]" />
				</View>
				// Google logg inn-knapp
				<Pressable
					onPress={handleGoogleLogin}
					className="flex-row items-center justify-center bg-white border border-[#064E3B] py-3 rounded-full mb-3"
				>
					<Image
						source={require("../assets/google-logo.png")}
						style={{ width: 20, height: 20, marginRight: 10 }}
					/>
					<Text className="text-[#064E3B] font-semibold">
						Logg inn med Google
					</Text>
				</Pressable>
				// Bytte mellom å logge inn eller registrere
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
