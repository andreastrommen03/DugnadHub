// src/app/(protected)/dugnadDetails/[id].tsx
import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DugnadData } from "../../../utils/firebaseTypes";

// Samme dummy-data som på Dugnader-siden
const DUMMY_DUGNADS: DugnadData[] = [
	{
		id: "1",
		title: "Rydding av skolegård",
		description: "Vi rydder søppel og løv rundt skolen.",
		location: "Trondheim vg",
		date: "12. november 2025, 17:00",
		maxVolunteers: 10,
		currentVolunteers: 3,
		imageUrl: undefined,
	},
	{
		id: "2",
		title: "Dugnad i borettslaget",
		description: "Vaske trapper og rydde bodområder.",
		location: "Lerkendal borettslag",
		date: "15. november 2025, 11:00",
		maxVolunteers: 8,
		currentVolunteers: 5,
		imageUrl: undefined,
	},
];

export default function DugnadDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const dugnad = DUMMY_DUGNADS.find((d) => d.id === id);

	if (!dugnad) {
		return (
			<View className="flex-1 items-center justify-center bg-[#20202A] px-4">
				<Text className="text-white text-lg font-semibold mb-2">
					Fant ikke dugnaden
				</Text>
				<Text className="text-gray-300">ID: {id}</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-[#20202A] px-4 pt-6">
			<Text className="text-2xl font-bold text-white mb-2">{dugnad.title}</Text>

			<Text className="text-base text-gray-200 mb-4">{dugnad.description}</Text>

			<Text className="text-sm text-gray-300 mb-1">
				Sted: {dugnad.location}
			</Text>
			<Text className="text-sm text-gray-300 mb-3">
				Tidspunkt: {dugnad.date}
			</Text>

			<Text className="text-sm text-gray-200">
				Påmeldte: {dugnad.currentVolunteers}/{dugnad.maxVolunteers}
			</Text>
		</View>
	);
}
