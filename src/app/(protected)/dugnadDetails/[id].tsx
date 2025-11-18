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

	// 🔹 Påmelding / avmelding (BEHOLDT AKKURAT SOM DU HADDE)
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

	// 🔹 Favoritt (ny – i samme stil som likes hos Yuan)
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

	const participants = dugnad.participants ?? [];
	const alreadyJoined = participants.includes(userId);
	const isFull = dugnad.currentVolunteers >= dugnad.maxVolunteers;

	const favList = dugnad.favoritedBy ?? [];
	const isFavorite = favList.includes(favUserId);

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

				{/* Kort med innhold */}
				<View className="bg-white rounded-2xl p-5 mb-6">
					{/* Tittel + favoritt-hjerte på én rad */}
					<View className="flex-row items-center justify-between mb-2">
						<Text className="text-2xl font-bold text-gray-900 flex-1 pr-4">
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
					<View className="self-start bg-orange-100 px-3 py-1 rounded-full mb-3">
						<Text className="text-xs font-semibold text-orange-700 uppercase">
							{dugnad.category ?? "Ukjent kategori"}
						</Text>
					</View>

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

				{/* 🔹 Deltakerliste (BEHOLDT) */}
				<View className="bg-[#111827] rounded-2xl p-4 mb-8">
					<Text className="text-white text-lg font-semibold mb-2">
						Deltakere
					</Text>

					{participants.length === 0 ? (
						<Text className="text-gray-400 text-sm">
							Ingen er påmeldt enda. Vær den første som melder deg på!
						</Text>
					) : (
						<View className="space-y-1">
							{participants.map((p, index) => (
								<Text key={`${p}-${index}`} className="text-gray-200 text-sm">
									• {p}
								</Text>
							))}
						</View>
					)}
				</View>

				{/* Påmeldingsknapp (BEHOLDT) */}
				<View className="mb-10">
					{isFull && !alreadyJoined ? (
						<View className="bg-gray-600 py-3 rounded-xl items-center">
							<Text className="text-white font-semibold">Dugnaden er full</Text>
						</View>
					) : (
						<Pressable
							onPress={handleToggleJoin}
							disabled={isUpdating}
							className={`py-3 rounded-xl items-center ${
								alreadyJoined ? "bg-red-600" : "bg-emerald-600"
							}`}
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
