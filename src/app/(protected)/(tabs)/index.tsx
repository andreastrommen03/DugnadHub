// src/app/(protected)/(tabs)/index.tsx

import React, { useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, Pressable, TextInput } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

import DugnadCard from "../../../components/DugnadCard";
import { DugnadData } from "../../../utils/firebaseTypes";
import { getDugnads } from "../../../api/dugnadApi";

export default function DugnaderHomeScreen() {
	const router = useRouter();

	const [dugnader, setDugnader] = useState<DugnadData[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	const loadDugnader = useCallback(async () => {
		try {
			setLoading(true);
			const data = (await getDugnads()) as DugnadData[];
			setDugnader(data);
		} catch (error) {
			console.log("Kunne ikke hente dugnader:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			loadDugnader();
		}, [loadDugnader])
	);

	// 🔍 Live-filtering på tittel + kategori (Yuan-style, client-side)
	const filteredDugnader = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return dugnader;

		return dugnader.filter((d) => {
			const title = d.title?.toLowerCase() ?? "";
			const category = d.category?.toLowerCase() ?? "";
			return title.includes(q) || category.includes(q);
		});
	}, [search, dugnader]);

	if (loading) {
		return (
			<View className="flex-1 bg-[#20202A] items-center justify-center">
				<Text className="text-white">Laster dugnader...</Text>
			</View>
		);
	}

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

			<Text className="text-gray-300 mb-3 text-sm">
				Finn en dugnad du vil bidra på i nærheten.
			</Text>

			{/* 🔍 Søkefelt */}
			<TextInput
				value={search}
				onChangeText={setSearch}
				placeholder="Søk på tittel eller kategori..."
				placeholderTextColor="#9CA3AF"
				className="bg-[#111827] text-white px-4 py-2 rounded-xl mb-4 border border-gray-700"
			/>

			{/* 🔹 Knapp for å opprette ny dugnad */}
			<Pressable
				onPress={() => router.push("/(protected)/createDugnad")}
				className="mb-4 bg-emerald-600 py-2 rounded-xl items-center"
			>
				<Text className="text-white font-semibold">Opprett ny dugnad</Text>
			</Pressable>

			{filteredDugnader.length === 0 ? (
				<Text className="text-gray-400 mt-2">
					Ingen dugnader matcher søket ditt.
				</Text>
			) : (
				<FlatList
					data={filteredDugnader}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					contentContainerStyle={{ paddingBottom: 24 }}
				/>
			)}
		</View>
	);
}
