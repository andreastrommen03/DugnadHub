// src/app/(protected)/(tabs)/profilePage.tsx

import React, { useState, useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

import { useAuthSession } from "../../../providers/authctx";
import { getDugnads } from "../../../api/dugnadApi";
import { DugnadData } from "../../../utils/firebaseTypes";
import DugnadCard from "../../../components/DugnadCard";

export default function ProfilePage() {
	const router = useRouter();
	const { user } = useAuthSession();

	const userId = user?.email ?? user?.uid ?? "Ukjent";

	const [myDugnads, setMyDugnads] = useState<DugnadData[]>([]);
	const [loading, setLoading] = useState(true);

	const loadMyDugnads = useCallback(async () => {
		if (!userId) return;

		try {
			setLoading(true);
			const all = (await getDugnads()) as DugnadData[];

			// 🔹 Filtrer dugnader der brukeren er påmeldt
			const mine = all.filter((d) => d.participants?.includes(userId));
			setMyDugnads(mine);
		} catch (error) {
			console.log("Feil ved henting av mine dugnader:", error);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	// Hent på nytt hver gang profilsiden får fokus
	useFocusEffect(
		useCallback(() => {
			loadMyDugnads();
		}, [loadMyDugnads])
	);

	if (loading) {
		return (
			<View className="flex-1 bg-[#20202A] items-center justify-center">
				<Text className="text-white">Laster profildata...</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-[#20202A] px-4 pt-10">
			{/* Toppseksjon: brukerinfo */}
			<Text className="text-white text-3xl font-bold mb-2">Min profil</Text>

			<Text className="text-gray-300 mb-1">
				Innlogget som{" "}
				<Text className="font-semibold">{user?.email ?? "ukjent bruker"}</Text>
			</Text>

			<Text className="text-gray-300 mb-4">
				Du er påmeldt <Text className="font-semibold">{myDugnads.length}</Text>{" "}
				dugnad{myDugnads.length === 1 ? "" : "er"}.
			</Text>

			{/* Divider */}
			<View className="h-[1px] bg-gray-700 mb-4" />

			<Text className="text-white text-lg font-semibold mb-2">
				Mine dugnader
			</Text>

			{myDugnads.length === 0 ? (
				<Text className="text-gray-400">
					Du er ikke påmeldt noen dugnader enda. Finn en dugnad under
					“Dugnader”-fanen og meld deg på.
				</Text>
			) : (
				<FlatList
					data={myDugnads}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingBottom: 24 }}
					renderItem={({ item }) => (
						<DugnadCard
							dugnad={item}
							onPress={() =>
								router.push(`/(protected)/dugnadDetails/${item.id}`)
							}
						/>
					)}
				/>
			)}
		</View>
	);
}
