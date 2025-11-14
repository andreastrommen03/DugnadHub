import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useRouter } from "expo-router";

import DugnadCard from "../../../components/DugnadCard";
import { DugnadData } from "../../../utils/firebaseTypes";
import { getDugnads } from "../../../api/dugnadApi";

export default function DugnaderHomeScreen() {
	const router = useRouter();

	const [dugnader, setDugnader] = useState<DugnadData[]>([]);
	const [loading, setLoading] = useState(true);

	// 🔥 Hent dugnader fra Firestore
	useEffect(() => {
		async function load() {
			try {
				const data = (await getDugnads()) as DugnadData[];
				setDugnader(data);
			} catch (error) {
				console.log("Kunne ikke hente dugnader:", error);
			} finally {
				setLoading(false);
			}
		}

		load();
	}, []);

	// ⏳ Laster
	if (loading) {
		return (
			<View className="flex-1 bg-[#20202A] justify-center items-center">
				<Text className="text-white">Laster dugnader...</Text>
			</View>
		);
	}

	// 🎴 Render hver dugnad med komponent
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
				data={dugnader}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				contentContainerStyle={{ paddingBottom: 24 }}
			/>
		</View>
	);
}
