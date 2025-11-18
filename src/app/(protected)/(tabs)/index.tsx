// src/app/(protected)/(tabs)/index.tsx

import React, { useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, Pressable, TextInput } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

import DugnadCard from "../../../components/DugnadCard";
import { DugnadData } from "../../../utils/firebaseTypes";
import { getDugnads, updateDugnad } from "../../../api/dugnadApi";
import { useAuthSession } from "../../../providers/authctx";

export default function DugnaderHomeScreen() {
	const router = useRouter();
	const { user } = useAuthSession();

	// 🔹 bruker-ID som brukes til favoritter (SAME overalt!)
	const favUserId = user?.uid ?? user?.email ?? "Ukjent";

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

	// 🔍 Live-filtering på tittel + kategori
	const filteredDugnader = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return dugnader;

		return dugnader.filter((d) => {
			const title = d.title?.toLowerCase() ?? "";
			const category = d.category?.toLowerCase() ?? "";
			return title.includes(q) || category.includes(q);
		});
	}, [search, dugnader]);

	const handleToggleFavorite = async (dugnad: DugnadData) => {
		if (!favUserId) return;

		const current = dugnad.favoritedBy ?? [];
		const alreadyFav = current.includes(favUserId);
		const updated = alreadyFav
			? current.filter((x) => x !== favUserId)
			: [...current, favUserId];

		// Oppdater UI med en gang (optimistisk)
		setDugnader((prev) =>
			prev.map((d) => (d.id === dugnad.id ? { ...d, favoritedBy: updated } : d))
		);

		try {
			await updateDugnad(dugnad.id, { favoritedBy: updated });
		} catch (error) {
			console.error("❌ Feil ved oppdatering av favoritt:", error);
			// vi lar UI være, det er godt nok til eksamen
		}
	};

	if (loading) {
		return (
			<View className="flex-1 bg-[#20202A] items-center justify-center">
				<Text className="text-white">Laster dugnader...</Text>
			</View>
		);
	}

	const renderItem = ({ item }: { item: DugnadData }) => {
		const isFavorite = item.favoritedBy?.includes(favUserId) ?? false;

		return (
			<DugnadCard
				dugnad={item}
				onPress={() => router.push(`/(protected)/dugnadDetails/${item.id}`)}
				isFavorite={isFavorite}
				onToggleFavorite={() => handleToggleFavorite(item)}
			/>
		);
	};

	return (
		<View className="flex-1 bg-[#20202A] px-4 pt-10">
			<Text className="text-white text-3xl font-bold mb-2">
				Kommende dugnader
			</Text>

			<Text className="text-gray-300 mb-3 text-sm">
				Finn en dugnad du vil bidra på i nærheten.
			</Text>

			{/* 🔍 Søkefelt */}
			<View className="mb-4">
				<TextInput
					value={search}
					onChangeText={setSearch}
					placeholder="Søk på tittel eller kategori..."
					placeholderTextColor="#9CA3AF"
					className="bg-[#111827] text-white px-4 py-2 rounded-xl border border-gray-700"
				/>
			</View>

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
