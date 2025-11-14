// src/app/(protected)/dugnadDetails/[id].tsx
import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DugnadData } from "../../../utils/firebaseTypes";

const DUMMY_DUGNADS: DugnadData[] = [
	{
		id: "1",
		title: "Rydding av skolegård",
		description: "Vi rydder søppel og løv rundt skolen.",
		location: "Trondheim vgs",
		date: "12. november 2025, 17:00",
		maxVolunteers: 10,
		currentVolunteers: 3,
	},
	{
		id: "2",
		title: "Dugnad i borettslaget",
		description: "Vaske trapper og rydde bodområder.",
		location: "Lerkendal borettslag",
		date: "15. november 2025, 11:00",
		maxVolunteers: 8,
		currentVolunteers: 5,
	},
];

export default function DugnadDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const dugnad = DUMMY_DUGNADS.find((d) => d.id === id);

	if (!dugnad) {
		return (
			<View className="flex-1 bg-[#20202A] items-center justify-center px-4">
				<Text className="text-white text-lg font-semibold mb-2">
					Fant ikke dugnaden
				</Text>
				<Text className="text-gray-300 text-sm">ID: {id}</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-[#20202A] px-4 pt-10">
			<Text className="text-white text-3xl font-bold mb-3">{dugnad.title}</Text>

			<Text className="text-gray-200 text-base mb-4">{dugnad.description}</Text>

			<Text className="text-gray-300 text-sm mb-1">
				Sted: <Text className="font-medium">{dugnad.location}</Text>
			</Text>
			<Text className="text-gray-300 text-sm mb-3">
				Tidspunkt: <Text className="font-medium">{dugnad.date}</Text>
			</Text>

			<Text className="text-gray-200 text-sm">
				Påmeldte:{" "}
				<Text className="font-semibold">
					{dugnad.currentVolunteers}/{dugnad.maxVolunteers}
				</Text>
			</Text>
		</View>
	);
}
