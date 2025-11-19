// src/app/(protected)/(tabs)/index.tsx

import React, { useState, useCallback, useMemo } from "react";
import {
	View,
	Text,
	Pressable,
	TextInput,
	ScrollView,
	Platform,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

import DugnadCard from "../../../components/DugnadCard";
import { DugnadData } from "../../../utils/firebaseTypes";
import { getDugnads, updateDugnad } from "../../../api/dugnadApi";
import { useAuthSession } from "../../../providers/authctx";

export default function DugnaderHomeScreen() {
	const router = useRouter();
	const { user } = useAuthSession();

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

	// 🔍 Live-filter på tittel + kategori
	const filteredDugnader = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return dugnader;

		return dugnader.filter((d) => {
			const title = d.title?.toLowerCase() ?? "";
			const category = d.category?.toLowerCase() ?? "";
			return title.includes(q) || category.includes(q);
		});
	}, [search, dugnader]);

	// ❤️ Favoritter
	const handleToggleFavorite = async (dugnad: DugnadData) => {
		if (!favUserId) return;

		const current = dugnad.favoritedBy ?? [];
		const alreadyFav = current.includes(favUserId);
		const updated = alreadyFav
			? current.filter((x) => x !== favUserId)
			: [...current, favUserId];

		setDugnader((prev) =>
			prev.map((d) => (d.id === dugnad.id ? { ...d, favoritedBy: updated } : d))
		);

		try {
			await updateDugnad(dugnad.id, { favoritedBy: updated });
		} catch (error) {
			console.error("❌ Feil ved oppdatering av favoritt:", error);
		}
	};

	if (loading) {
		return (
			<View className="flex-1 bg-[#E5F4EC] items-center justify-center">
				<Text className="text-[#064E3B]">Laster dugnader...</Text>
			</View>
		);
	}

	// 📏 kortbredde: 3 per rad på web, 2 per rad på mobil
	const cardWidth = Platform.OS === "web" ? "30%" : "46%";

	return (
		<ScrollView
			className="flex-1 bg-[#E5F4EC]"
			contentContainerStyle={{ paddingBottom: 40 }}
		>
			{/* 🟣 HERO / VELKOMST */}
			<View className="px-6 pt-16 pb-28 items-center">
				<View
					style={{
						maxWidth: 800,
					}}
					className="bg-[#D9F2E3] rounded-3xl border border-[#166534] px-6 py-10"
				>
					<Text className="text-[#064E3B] text-4xl font-bold mb-4 text-center">
						DugnadHub
					</Text>

					<Text className="text-[#14532D] text-base leading-6 text-center">
						Velkommen til DugnadHub — stedet hvor du enkelt kan finne, opprette
						og delta på dugnader i nærmiljøet ditt.
						{"\n\n"}
						Få oversikt over lokale initiativer, bli kjent med nye mennesker og
						bidra til et bedre nærmiljø. Alt samlet på ett sted.
					</Text>
				</View>
			</View>

			{/* 🟠 SEKSJON: KOMMENDE DUGNADER */}
			<View className="px-8 mb-2">
				<Text className="text-[#064E3B] text-3xl font-semibold mb-4 text-center">
					Kommende dugnader
				</Text>
				<Text className="text-[#14532D] text-sm mb-8 text-center">
					Bla gjennom kommende dugnader.
				</Text>
			</View>

			{/* 🟪 Søk + Opprett dugnad – smalt og midtstilt */}
			<View
				style={{
					width: "100%",
					maxWidth: 400,
					alignSelf: "center",
				}}
			>
				{/* Søk */}
				<TextInput
					value={search}
					onChangeText={setSearch}
					placeholder="Søk på tittel eller kategori..."
					placeholderTextColor="#6B7280"
					className="bg-[#f4fbf7] text-[#064E3B] px-4 py-2 rounded-xl border border-[#064E3B] mb-4"
					style={{ width: "100%" }}
				/>

				{/* Opprett dugnad */}
				<Pressable
					onPress={() => router.push("/(protected)/createDugnad")}
					className="py-2 rounded-xl items-center"
					style={{
						width: "100%",
						marginBottom: 24,
						backgroundColor: "#064E3B",
					}}
				>
					<Text className="text-[#f4fbf7] font-semibold">
						Opprett ny dugnad
					</Text>
				</Pressable>
			</View>

			{/* 🟢 GRID */}
			<View style={{ alignItems: "center" }}>
				<View style={{ width: "100%", maxWidth: 1000 }}>
					<View className="flex-row flex-wrap justify-between px-4">
						{filteredDugnader.map((item) => {
							const isFavorite = item.favoritedBy?.includes(favUserId) ?? false;

							return (
								<View
									key={item.id}
									style={{
										width: cardWidth,
										marginBottom: 24,
									}}
								>
									<DugnadCard
										dugnad={item}
										onPress={() =>
											router.push(`/(protected)/dugnadDetails/${item.id}`)
										}
										isFavorite={isFavorite}
										onToggleFavorite={() => handleToggleFavorite(item)}
									/>
								</View>
							);
						})}
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
