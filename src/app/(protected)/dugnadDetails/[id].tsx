// src/app/(protected)/dugnadDetails/[id].tsx
import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function DugnadDetails() {
	const { id } = useLocalSearchParams<{ id: string }>();

	return (
		<View className="flex-1 items-center justify-center bg-[#20202A]">
			<Text className="text-xl font-semibold text-white mb-2">
				Detaljer for dugnad
			</Text>
			<Text className="text-white">Dugnad-ID: {id}</Text>
			<Text className="text-white mt-4">
				Her skal vi senere vise tittel, beskrivelse, bilder osv.
			</Text>
		</View>
	);
}
