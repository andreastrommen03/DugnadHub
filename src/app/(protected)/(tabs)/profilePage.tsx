import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Platform, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

import { useAuthSession } from "../../../providers/authctx";
import { getDugnads, updateDugnad } from "../../../api/dugnadApi";
import { DugnadData } from "../../../utils/firebaseTypes";
import DugnadCard from "../../../components/DugnadCard";

export default function ProfilePage() {
	const router = useRouter();
	const { user, signOut } = useAuthSession();

	const userIdForParticipants = user?.email ?? user?.uid ?? "Ukjent";
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

	useFocusEffect(
		useCallback(() => {
			loadMyDugnads();
		}, [loadMyDugnads])
	);

	const myDugnads = allDugnads.filter((d) =>
		d.participants?.includes(userIdForParticipants)
	);

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
	const cardWidth = Platform.OS === "web" ? "18%" : "30%";

	return (
		<ScrollView
			className="flex-1 bg-[#ECFDF3]"
			contentContainerStyle={{ paddingBottom: 40 }}
		>
			<View className="px-4 pt-20">
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
				<View className="h-[1px] bg-[#064E3B] mb-6" />
				<Text className="text-[#064E3B] text-2xl font-semibold mb-3">
					Mine påmeldte dugnader
				</Text>
				{myDugnads.length === 0 ? (
					<Text className="text-[#166534] mb-10 text-sm">
						Du er ikke påmeldt noen dugnader enda.
					</Text>
				) : (
					<View style={{ marginBottom: 16 }}>
						<View style={{ width: "100%", maxWidth: 1000 }}>
							<View className="flex-row flex-wrap justify-start px-2">
								{myDugnads.map((item) => {
									const isFavorite =
										item.favoritedBy?.includes(favUserId) ?? false;

									return (
										<View
											key={item.id}
											style={{
												width: cardWidth,
												marginBottom: 16,
												marginRight: 8,
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
				<View className="h-[1px] bg-[#064E3B] my-6" />
				<Text className="text-[#064E3B] text-2xl font-semibold mb-3">
					Mine favoritt-dugnader
				</Text>
				{favoriteDugnads.length === 0 ? (
					<Text className="text-[#166534] text-sm mb-10">
						Du har ingen favoritter enda.
					</Text>
				) : (
					<View>
						<View style={{ width: "100%", maxWidth: 1000 }}>
							<View className="flex-row flex-wrap justify-start px-2">
								{favoriteDugnads.map((item) => (
									<View
										key={item.id}
										style={{
											width: cardWidth,
											marginBottom: 16,
											marginRight: 8,
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
				{/* Logg ut knapp*/}
				<View className="mt-8 mb-6 items-center">
					<Pressable
						onPress={async () => {
							await signOut();
							router.replace("/authentication");
						}}
						className="px-6 py-2 rounded-full"
						style={{
							backgroundColor: "#DC6E6E", // dus rød
							alignSelf: "center", // midtstilt
						}}
					>
						<Text className="text-white font-semibold text-base">Logg ut</Text>
					</Pressable>
				</View>
			</View>
		</ScrollView>
	);
}
