// src/app/(protected)/_layout.tsx
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Stack, Redirect } from "expo-router";
import { useAuthSession } from "../../providers/authctx";

export default function ProtectedLayout() {
	const { user, isLoading } = useAuthSession();

	// Viser en enkel loader mens vi sjekker auth-status
	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-[#ECFDF3]">
				<ActivityIndicator />
				<Text className="text-[#064E3B] mt-2">Laster...</Text>
			</View>
		);
	}

	// Hvis ikke innlogget, send til auth-siden
	if (!user) {
		return <Redirect href="/authentication" />;
	}
	return (
		<Stack>
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
				}}
			/>

			{/* Detaljside for dugnad */}
			<Stack.Screen
				name="dugnadDetails/[id]"
				options={{
					title: "Dugnad",
					headerStyle: { backgroundColor: "#064E3B" },
					headerTintColor: "#D9F2E3",
					headerTitleStyle: { color: "#D9F2E3" },
				}}
			/>

			{/* Ny dugnad*/}
			<Stack.Screen
				name="createDugnad"
				options={{
					title: "Ny dugnad",
					headerStyle: { backgroundColor: "#064E3B" },
					headerTintColor: "#D9F2E3",
					headerTitleStyle: { color: "#D9F2E3" },
				}}
			/>
		</Stack>
	);
}
