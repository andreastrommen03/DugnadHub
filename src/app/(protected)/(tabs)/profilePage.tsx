// src/app/(protected)/(tabs)/profilePage.tsx

import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

import { useAuthSession } from "../../../providers/authctx";
import { getDugnads, updateDugnad } from "../../../api/dugnadApi";
import { DugnadData } from "../../../utils/firebaseTypes";
import DugnadCard from "../../../components/DugnadCard";

export default function ProfilePage() {
	const router = useRouter();
	const { user } = useAuthSession();

	// 🔹 ID for påmeldinger (samme som du brukte før)
	const userIdForParticipants = user?.email ?? user?.uid ?? "Ukjent";
	// 🔹 ID for favoritter (samme logikk som i detaljsiden / forsiden)
	const favUserId = user?.uid ?? user?.email ?? "Ukjent";

	const [allDugnads, setAllDugnads] = useState<DugnadData[]>([]);
	const [loading, setLoading] = useState(true);

	const loadMyDugnads = useCallback(async () => {
		if (!userIdForParticipants) return;

		try {
			setLoading(true);
			const all = (await getDugnads()) as DugnadData[];
			setAllDugnads(all);
		} catch (error) {
			console.log("Feil ved henting av dugnader:", error);
		} finally {
			setLoading(false);
		}
	}, [userIdForParticipants]);

	// Hent på nytt hver gang profilsiden får fokus
	useFocusEffect(
		useCallback(() => {
			loadMyDugnads();
		}, [loadMyDugnads])
	);

	// 🔹 Mine påmeldte dugnader
	const myDugnads = allDugnads.filter((d) =>
		d.participants?.includes(userIdForParticipants)
	);

	// 🔹 Mine favoritter
	const favoriteDugnads = allDugnads.filter((d) =>
		(d.favoritedBy ?? []).includes(favUserId)
	);

	const handleToggleFavorite = async (dugnad: DugnadData) => {
		if (!favUserId) return;

		const current = dugnad.favoritedBy ?? [];
		const alreadyFav = current.includes(favUserId);
		const updated = alreadyFav
			? current.filter((u) => u !== favUserId)
			: [...current, favUserId];

		// Oppdater lokalt UI
		setAllDugnads((prev) =>
			prev.map((d) => (d.id === dugnad.id ? { ...d, favoritedBy: updated } : d))
		);

		try {
			await updateDugnad(dugnad.id, { favoritedBy: updated });
		} catch (error) {
			console.log("Feil ved oppdatering av favoritt:", error);
		}
	};

	if (loading) {
		return (
			<View className="flex-1 bg-[#ECFDF3] items-center justify-center">
				<Text className="text-[#064E3B]">Laster profildata...</Text>
			</View>
		);
	}

	// 📏 Samme kortbredde-oppsett som på forsiden
	const cardWidth = Platform.OS === "web" ? "30%" : "46%";

	return (
		<ScrollView
			className="flex-1 bg-[#ECFDF3]"
			contentContainerStyle={{ paddingBottom: 40 }}
		>
			<View className="px-4 pt-10">
				{/* Toppseksjon: brukerinfo */}
				<Text className="text-[#064E3B] text-3xl font-bold mb-2">
					Min profil
				</Text>

				<Text className="text-[#166534] mb-1">
					Innlogget som{" "}
					<Text className="font-semibold">
						{user?.email ?? "ukjent bruker"}
					</Text>
				</Text>

				<Text className="text-[#166534] mb-4">
					Du er påmeldt{" "}
					<Text className="font-semibold">{myDugnads.length}</Text> dugnad
					{myDugnads.length === 1 ? "" : "er"} og har{" "}
					<Text className="font-semibold">{favoriteDugnads.length}</Text>{" "}
					favoritt-dugnad
					{favoriteDugnads.length === 1 ? "" : "er"}.
				</Text>

				{/* Divider */}
				<View className="h-[1px] bg-[#BBF7D0] mb-6" />

				{/* 🔹 Mine dugnader (påmeldte) */}
				<Text className="text-[#064E3B] text-2xl font-semibold mb-3">
					Mine dugnader
				</Text>

				{myDugnads.length === 0 ? (
					<Text className="text-[#166534] mb-10 text-sm">
						Du er ikke påmeldt noen dugnader enda. Finn en dugnad under
						“Dugnader”-fanen og meld deg på.
					</Text>
				) : (
					<View style={{ marginBottom: 16 }}>
						<View style={{ width: "100%", maxWidth: 1000 }}>
							<View className="flex-row flex-wrap justify-between px-2">
								{myDugnads.map((item) => {
									const isFavorite =
										item.favoritedBy?.includes(favUserId) ?? false;

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
				)}

				{/* Divider */}
				<View className="h-[1px] bg-[#BBF7D0] my-6" />

				{/* 🔹 Mine favoritter */}
				<Text className="text-[#064E3B] text-2xl font-semibold mb-3">
					Mine favoritt-dugnader
				</Text>

				{favoriteDugnads.length === 0 ? (
					<Text className="text-[#166534] text-sm mb-10">
						Du har ingen favoritter enda. Trykk på hjertet på en dugnad for å
						lagre den her.
					</Text>
				) : (
					<View>
						<View style={{ width: "100%", maxWidth: 1000 }}>
							<View className="flex-row flex-wrap justify-between px-2">
								{favoriteDugnads.map((item) => (
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
											isFavorite={true}
											onToggleFavorite={() => handleToggleFavorite(item)}
										/>
									</View>
								))}
							</View>
						</View>
					</View>
				)}
			</View>
		</ScrollView>
	);
}
