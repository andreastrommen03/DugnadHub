// src/app/(protected)/dugnadDetails/[id].tsx

import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ActivityIndicator,
	Image,
	ScrollView,
	Pressable,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { DugnadData } from "../../../utils/firebaseTypes";
import { getDugnadById, updateDugnad } from "../../../api/dugnadApi";
import { useAuthSession } from "../../../providers/authctx";
import { Ionicons } from "@expo/vector-icons";

export default function DugnadDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const [dugnad, setDugnad] = useState<DugnadData | null>(null);
	const [loading, setLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);

	const { user } = useAuthSession();
	const userId = user?.email ?? user?.uid ?? "Ukjent"; // brukes til deltakere
	const favUserId = user?.uid ?? user?.email ?? "Ukjent"; // brukes til favoritt

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

	// 🔹 Påmelding / avmelding (samme logikk som før)
	const handleToggleJoin = async () => {
		if (!dugnad || !userId) return;

		setIsUpdating(true);

		const currentParticipants = dugnad.participants ?? [];
		const alreadyJoined = currentParticipants.includes(userId);

		const updatedParticipants = alreadyJoined
			? currentParticipants.filter((p) => p !== userId)
			: [...currentParticipants, userId];

		const newCount = alreadyJoined
			? Math.max(0, dugnad.currentVolunteers - 1)
			: dugnad.currentVolunteers + 1;

		const updatedDugnad: DugnadData = {
			...dugnad,
			participants: updatedParticipants,
			currentVolunteers: newCount,
		};

		setDugnad(updatedDugnad);

		try {
			await updateDugnad(dugnad.id, {
				participants: updatedParticipants,
				currentVolunteers: newCount,
			});
		} catch (error) {
			console.error("❌ Feil ved oppdatering av dugnad:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	// 🔹 Favoritt (samme stil som likes hos Yuan)
	const handleToggleFavorite = async () => {
		if (!dugnad || !favUserId) return;

		const currentFavs = dugnad.favoritedBy ?? [];
		const alreadyFav = currentFavs.includes(favUserId);

		const updatedFavs = alreadyFav
			? currentFavs.filter((u) => u !== favUserId)
			: [...currentFavs, favUserId];

		// Oppdater UI
		setDugnad({ ...dugnad, favoritedBy: updatedFavs });

		try {
			await updateDugnad(dugnad.id, { favoritedBy: updatedFavs });
		} catch (error) {
			console.error("❌ Feil ved oppdatering av favoritt:", error);
		}
	};

	if (loading) {
		return (
			<View className="flex-1 bg-[#ECFDF3] justify-center items-center">
				<ActivityIndicator />
				<Text className="text-[#064E3B] mt-2">Laster dugnad...</Text>
			</View>
		);
	}

	if (!dugnad) {
		return (
			<View className="flex-1 bg-[#ECFDF3] items-center justify-center px-4">
				<Text className="text-[#064E3B] text-lg font-semibold mb-2">
					Fant ikke dugnaden
				</Text>
				<Text className="text-[#166534] text-sm">ID: {id}</Text>
			</View>
		);
	}

	const participants = dugnad.participants ?? [];
	const alreadyJoined = participants.includes(userId);
	const isFull = dugnad.currentVolunteers >= dugnad.maxVolunteers;

	const favList = dugnad.favoritedBy ?? [];
	const isFavorite = favList.includes(favUserId);

	return (
		<View className="flex-1 bg-[#ECFDF3]">
			{/* Header-tittel med grønn styling */}
			<Stack.Screen
				options={{
					title: dugnad?.title ?? "Dugnad",
					headerStyle: { backgroundColor: "#064E3B" },
					headerTintColor: "#D9F2E3",
					headerTitleStyle: { color: "#D9F2E3" },
				}}
			/>

			<ScrollView contentContainerClassName="px-4 pt-6 pb-10">
				{/* Bilde hvis det finnes */}
				{dugnad.imageUrls && dugnad.imageUrls.length > 0 ? (
					<ScrollView
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						className="w-full h-56 rounded-2xl mb-4"
					>
						{dugnad.imageUrls.map((url, idx) => (
							<Image
								key={`${url}-${idx}`}
								source={{ uri: url }}
								className="w-80 h-56 mr-2 rounded-2xl"
								resizeMode="cover"
							/>
						))}
					</ScrollView>
				) : dugnad.imageUrl ? (
					<Image
						source={{ uri: dugnad.imageUrl }}
						className="w-full h-56 rounded-2xl mb-4"
						resizeMode="cover"
					/>
				) : null}

				{/* Kort med innhold – nå i samme grønne stil som kortene dine */}
				<View className="bg-[#f4fbf7] rounded-2xl p-5 mb-6 border border-[#166534]">
					{/* Tittel + favoritt-hjerte på én rad */}
					<View className="flex-row items-center justify-between mb-3">
						<Text className="text-2xl font-bold text-[#064E3B] flex-1 pr-4">
							{dugnad.title}
						</Text>
						<Pressable
							onPress={handleToggleFavorite}
							className="p-2 rounded-full bg-black/10"
						>
							<Ionicons
								name={isFavorite ? "heart" : "heart-outline"}
								size={24}
								color={isFavorite ? "red" : "#4B5563"}
							/>
						</Pressable>
					</View>

					{/* Kategori-pill */}
					<View className="self-start bg-[#D9F2E3] px-3 py-1 rounded-full mb-3">
						<Text className="text-xs font-semibold text-[#064E3B] uppercase">
							{dugnad.category ?? "Ukjent kategori"}
						</Text>
					</View>

					<Text className="text-base text-[#166534] mb-4">
						{dugnad.description}
					</Text>

					<View className="h-[1px] bg-[#166534] mb-3" />

					<Text className="text-sm text-[#166534] mb-3">
						Sted:{" "}
						<Text className="font-semibold text-[#064E3B]">
							{dugnad.location}
						</Text>
					</Text>

					<Text className="text-sm text-[#166534] mb-3">
						Tidspunkt:{" "}
						<Text className="font-semibold text-[#064E3B]">{dugnad.date}</Text>
					</Text>

					<Text className="text-sm text-[#166534] mb-3">
						Nødvendige frivillige:{" "}
						<Text className="font-semibold text-[#064E3B]">
							{dugnad.maxVolunteers}
						</Text>
					</Text>

					<Text className="text-sm text-[#166534]">
						Påmeldte:{" "}
						<Text className="font-semibold">
							{dugnad.currentVolunteers}/{dugnad.maxVolunteers}
						</Text>
					</Text>
				</View>

				{/* 🔹 Deltakerliste – gjort lys og grønn */}
				<View className="bg-[#F0FDF4] rounded-2xl p-4 mb-8 border border-[#166534]">
					<Text className="text-[#064E3B] text-lg font-semibold mb-2">
						Deltakere
					</Text>

					{participants.length === 0 ? (
						<Text className="text-[#166534] text-sm">
							Ingen er påmeldt enda. Vær den første som melder deg på!
						</Text>
					) : (
						<View className="space-y-1">
							{participants.map((p, index) => (
								<Text key={`${p}-${index}`} className="text-[#166534] text-sm">
									• {p}
								</Text>
							))}
						</View>
					)}
				</View>

				{/* Påmeldingsknapp – samme funksjon, grønn stil */}
				<View className="mb-10">
					{isFull && !alreadyJoined ? (
						<View className="py-3 rounded-xl items-center bg-[#9CA3AF]">
							<Text className="text-white font-semibold">Dugnaden er full</Text>
						</View>
					) : (
						<Pressable
							onPress={handleToggleJoin}
							disabled={isUpdating}
							className="py-3 rounded-xl items-center"
							style={{
								backgroundColor: alreadyJoined ? "#B91C1C" : "#064E3B",
								opacity: isUpdating ? 0.8 : 1,
							}}
						>
							<Text className="text-white font-semibold text-lg">
								{alreadyJoined ? "Meld meg av" : "Meld meg på dugnaden"}
							</Text>
						</Pressable>
					)}
				</View>
			</ScrollView>
		</View>
	);
}
