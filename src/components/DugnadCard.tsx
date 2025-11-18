// src/components/DugnadCard.tsx
import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DugnadData } from "../utils/firebaseTypes";

type Props = {
	dugnad: DugnadData;
	onPress: () => void;
	isFavorite: boolean;
	onToggleFavorite: () => void;
};

export default function DugnadCard({
	dugnad,
	onPress,
	isFavorite,
	onToggleFavorite,
}: Props) {
	return (
		<Pressable
			onPress={onPress}
			className="bg-white rounded-2xl mb-3 overflow-hidden"
		>
			{/* Topp: bilde + hjerte */}
			{dugnad.imageUrl ? (
				<View>
					<Image
						source={{ uri: dugnad.imageUrl }}
						className="w-full h-40"
						resizeMode="cover"
					/>
					{/* Hjerte oppe til høyre */}
					<Pressable
						onPress={(e) => {
							e.stopPropagation();
							onToggleFavorite();
						}}
						className="absolute right-3 top-3 bg-black/50 rounded-full p-1.5"
					>
						<Ionicons
							name={isFavorite ? "heart" : "heart-outline"}
							size={20}
							color={isFavorite ? "red" : "white"}
						/>
					</Pressable>
				</View>
			) : (
				<View className="px-4 pt-3 pb-1 flex-row justify-between items-center">
					<Text className="text-xs text-gray-400">Ingen bilde</Text>
					<Pressable
						onPress={(e) => {
							e.stopPropagation();
							onToggleFavorite();
						}}
						className="rounded-full p-1"
					>
						<Ionicons
							name={isFavorite ? "heart" : "heart-outline"}
							size={20}
							color={isFavorite ? "red" : "#9CA3AF"}
						/>
					</Pressable>
				</View>
			)}

			{/* Innhold */}
			<View className="px-4 py-3">
				<Text className="text-lg font-semibold text-gray-900">
					{dugnad.title}
				</Text>
				<Text className="text-sm text-gray-600 mt-1">{dugnad.location}</Text>
				<Text className="text-xs text-gray-500 mt-1">{dugnad.date}</Text>

				<View className="flex-row justify-between items-center mt-2">
					<Text className="text-xs text-gray-700">
						{dugnad.currentVolunteers}/{dugnad.maxVolunteers} påmeldt
					</Text>

					{dugnad.category ? (
						<View className="bg-orange-100 px-2 py-1 rounded-full">
							<Text className="text-[10px] font-semibold text-orange-700">
								{dugnad.category}
							</Text>
						</View>
					) : null}
				</View>
			</View>
		</Pressable>
	);
}
