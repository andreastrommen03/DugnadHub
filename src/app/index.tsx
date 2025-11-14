// src/app/(protected)/(tabs)/index.tsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import { useRouter } from "expo-router";
import DugnadCard from "../components/DugnadCard";
import { DugnadData } from "../utils/firebaseTypes";

// Midlertidig dummy-data – byttes ut med Firestore senere
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

export default function DugnaderHomeScreen() {
	const router = useRouter();

	const renderItem = ({ item }: { item: DugnadData }) => (
		<DugnadCard
			dugnad={item}
			onPress={() => router.push(`/(protected)/dugnadDetails/${item.id}`)}
		/>
	);

	return (
		<View className="flex-1 bg-[#20202A] px-4 pt-10">
			<Text className="text-white text-3xl font-bold mb-2">
				Kommende dugnader
			</Text>
			<Text className="text-gray-300 mb-6 text-sm">
				Finn en dugnad du vil bidra på i nærheten.
			</Text>

			<FlatList
				data={DUMMY_DUGNADS}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				contentContainerStyle={{ paddingBottom: 24 }}
			/>
		</View>
	);
}
