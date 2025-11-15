// src/app/(protected)/dugnadDetails/[id].tsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { DugnadData } from "../../../utils/firebaseTypes";
import { getDugnadById } from "../../../api/dugnadApi";

export default function DugnadDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const [dugnad, setDugnad] = useState<DugnadData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			if (!id) return;

			try {
				const data = await getDugnadById(id as string);
				setDugnad(data);
			} catch (error) {
				console.log("Feil ved henting av dugnad:", error);
			} finally {
				setLoading(false);
			}
		}

		load();
	}, [id]);

	if (loading) {
		return (
			<View className="flex-1 bg-[#20202A] justify-center items-center">
				<ActivityIndicator />
				<Text className="text-white mt-2">Laster dugnad...</Text>
			</View>
		);
	}

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
		<View className="flex-1 bg-[#20202A]">
			{/* Header-tittel (som Yuan gjør) */}
			<Stack.Screen
				options={{
					headerTitle: dugnad.title ?? "Dugnad",
				}}
			/>

			<ScrollView contentContainerClassName="px-4 pt-6 pb-10">
				{/* Bilde hvis det finnes */}
				{dugnad.imageUrl ? (
					<Image
						source={{ uri: dugnad.imageUrl }}
						className="w-full h-56 rounded-2xl mb-4"
						resizeMode="cover"
					/>
				) : null}

				{/* Kort med innhold */}
				<View className="bg-white rounded-2xl p-5 mb-4">
					<Text className="text-2xl font-bold text-gray-900 mb-2">
						{dugnad.title}
					</Text>

					<Text className="text-base text-gray-700 mb-4">
						{dugnad.description}
					</Text>

					<View className="h-[1px] bg-gray-200 mb-3" />

					<Text className="text-sm text-gray-600 mb-1">
						Sted:{" "}
						<Text className="font-semibold text-gray-800">
							{dugnad.location}
						</Text>
					</Text>

					<Text className="text-sm text-gray-600 mb-3">
						Tidspunkt:{" "}
						<Text className="font-semibold text-gray-800">{dugnad.date}</Text>
					</Text>

					<Text className="text-sm text-gray-700">
						Påmeldte:{" "}
						<Text className="font-semibold">
							{dugnad.currentVolunteers}/{dugnad.maxVolunteers}
						</Text>
					</Text>
				</View>

				{/* Her kan vi senere legge til "Meld meg på"-knapp osv */}
			</ScrollView>
		</View>
	);
}
