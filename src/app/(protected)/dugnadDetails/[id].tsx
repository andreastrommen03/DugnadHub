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
import { Ionicons } from "@expo/vector-icons";

import { DugnadData } from "../../../utils/firebaseTypes";
import { getDugnadById, updateDugnad } from "../../../api/dugnadApi";
import { useAuthSession } from "../../../providers/authctx";

export default function DugnadDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const [dugnad, setDugnad] = useState<DugnadData | null>(null);
	const [loading, setLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);

	const { user } = useAuthSession();

	// Deltakere/påmeldte
	const userId = user?.email ?? user?.uid ?? "Ukjent";

	// Favoritter
	const favUserId = user?.uid ?? user?.email ?? "Ukjent";

	// Hent dugnad basert på ID fra URL
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

	// Påmelding/avmelding
	const handleToggleJoin = async () => {
		if (!dugnad || !userId) return;

		setIsUpdating(true);

		const currentParticipants = dugnad.participants ?? [];
		const alreadyJoined = currentParticipants.includes(userId);

		const updatedParticipants = alreadyJoined
			? currentParticipants.filter((p) => p !== userId)
			: [...currentParticipants, userId];

		// Oppdater antall frivillige
		const newCount = alreadyJoined
			? Math.max(0, dugnad.currentVolunteers - 1)
			: dugnad.currentVolunteers + 1;

		const updatedDugnad: DugnadData = {
			...dugnad,
			participants: updatedParticipants,
			currentVolunteers: newCount,
		};

		// Oppdater lokalt UI
		setDugnad(updatedDugnad);

		try {
			await updateDugnad(dugnad.id, {
				participants: updatedParticipants,
				currentVolunteers: newCount,
			});
		} catch (error) {
			console.error("Feil ved oppdatering av dugnad:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleToggleFavorite = async () => {
		if (!dugnad || !favUserId) return;

		const currentFavs = dugnad.favoritedBy ?? [];
		const alreadyFav = currentFavs.includes(favUserId);

		const updatedFavs = alreadyFav
			? currentFavs.filter((u) => u !== favUserId)
			: [...currentFavs, favUserId];

		setDugnad({ ...dugnad, favoritedBy: updatedFavs });

		try {
			await updateDugnad(dugnad.id, { favoritedBy: updatedFavs });
		} catch (error) {
			console.error("Feil ved oppdatering av favoritt:", error);
		}
	};

	if (loading) {
		return (
			<View className="flex-1 bg-[#E5F4EC] justify-center items-center">
				<ActivityIndicator />
				<Text className="text-[#064E3B] mt-2">Laster dugnad...</Text>
			</View>
		);
	}

	if (!dugnad) {
		return (
			<View className="flex-1 bg-[#E5F4EC] items-center justify-center px-4">
				<Text className="text-[#064E3B] text-lg font-semibold mb-2">
					Fant ikke dugnaden
				</Text>
				<Text className="text-[#064E3B] text-sm">ID: {id}</Text>
			</View>
		);
	}

	const participants = dugnad.participants ?? [];
	const alreadyJoined = participants.includes(userId);
	const isFull = dugnad.currentVolunteers >= dugnad.maxVolunteers;

	const favList = dugnad.favoritedBy ?? [];
	const isFavorite = favList.includes(favUserId);

	return (
		<View className="flex-1 bg-[#E5F4EC]">
			<Stack.Screen
				options={{
					title: dugnad?.title ?? "Dugnad",
				}}
			/>

			<ScrollView contentContainerClassName="px-4 pt-6 pb-10">
				{/* Bildekarusell eller enkeltbilde */}
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

				{/* Card med detaljifno */}
				<View className="bg-[#f4fbf7] rounded-2xl p-5 mb-6">
					{/* Tittel + favoritt-hjerte */}
					<View className="flex-row items-center justify-between mb-2">
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

					{/* Kategori */}
					<View className="self-start bg-[#D9F2E3] px-3 py-1 rounded-full mb-3">
						<Text className="text-xs font-semibold text-[#064E3B] uppercase">
							{dugnad.category ?? "Ukjent kategori"}
						</Text>
					</View>

					{/* Beskrivelse */}
					<Text className="text-base text-[#064E3B] mb-4">
						{dugnad.description}
					</Text>

					<View className="h-[1px] bg-gray-200 mb-3" />

					{/* Sted */}
					<Text className="text-sm text-[#064E3B] mb-1">
						Sted:{" "}
						<Text className="font-semibold text-[#064E3B]">
							{dugnad.location}
						</Text>
					</Text>

					{/* Tidspunkt */}
					<Text className="text-sm text-[#064E3B] mb-3">
						Tidspunkt:{" "}
						<Text className="font-semibold text-[#064E3B]">{dugnad.date}</Text>
					</Text>

					{/* Påmeldte */}
					<Text className="text-sm text-[#064E3B]">
						Påmeldte:{" "}
						<Text className="font-semibold">
							{dugnad.currentVolunteers}/{dugnad.maxVolunteers}
						</Text>
					</Text>
				</View>

				{/* Deltakerliste */}
				<View className="bg-[#f4fbf7]  rounded-2xl p-4 mb-8">
					<Text className="text-[#064E3B] text-lg font-semibold mb-2">
						Deltakere
					</Text>

					{participants.length === 0 ? (
						<Text className="text-[#064E3B] text-sm">
							Ingen er påmeldt enda. Vær den første som melder deg på!
						</Text>
					) : (
						<View className="space-y-1">
							{participants.map((p, index) => (
								<Text key={`${p}-${index}`} className="text-[#064E3B] text-sm">
									• {p}
								</Text>
							))}
						</View>
					)}
				</View>

				{/* Påmeldingsknapp */}
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
								alreadyJoined ? "bg-[#DC6E6E]" : "bg-[#064E3B]"
							}`}
						>
							<Text className="text-[#f4fbf7]  font-semibold text-lg">
								{alreadyJoined ? "Meld meg av" : "Meld meg på dugnaden"}
							</Text>
						</Pressable>
					)}
				</View>
			</ScrollView>
		</View>
	);
}
