// src/app/(protected)/(tabs)/profilePage.tsx
import React from "react";
import { View, Text } from "react-native";

export default function ProfilePage() {
	return (
		<View className="flex-1 items-center justify-center bg-[#20202A]">
			<Text className="text-xl font-semibold text-white">Profil</Text>
			<Text className="text-white mt-2">
				Her kommer statistikk og brukerinformasjon senere.
			</Text>
		</View>
	);
}
