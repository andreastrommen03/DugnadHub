import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Stack, Redirect } from "expo-router";
import { useAuthSession } from "../../providers/authctx";

export default function ProtectedLayout() {
	const { user, isLoading } = useAuthSession();

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-[#20202A]">
				<ActivityIndicator />
				<Text className="text-white mt-2">Laster...</Text>
			</View>
		);
	}

	if (!user) {
		return <Redirect href="/authentication" />;
	}

	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen name="dugnadDetails/[id]" options={{ title: "Dugnad" }} />
			<Stack.Screen name="createDugnad" options={{ title: "Ny dugnad" }} />
		</Stack>
	);
}
