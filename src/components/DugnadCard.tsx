import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DugnadData } from "../utils/firebaseTypes";

type Props = {
	dugnad: DugnadData;
	onPress: () => void;
	isFavorite?: boolean;
	onToggleFavorite?: () => void;
};

export default function DugnadCard({
	dugnad,
	onPress,
	isFavorite = false,
	onToggleFavorite,
}: Props) {
	const imageSource =
		(dugnad.imageUrls && dugnad.imageUrls[0]) || dugnad.imageUrl || null;

	return (
		<Pressable onPress={onPress} className="mb-4">
			<View className="bg-[#f4fbf7] rounded-xl overflow-hidden shadow-sm">
				{/* Bilde */}
				{imageSource && (
					<View className="w-full h-28 relative">
						<Image
							source={{ uri: imageSource }}
							className="w-full h-full"
							resizeMode="cover"
						/>

						{/* Hjerte */}
						{onToggleFavorite && (
							<Pressable
								onPress={(e) => {
									e.stopPropagation();
									onToggleFavorite();
								}}
								className="absolute top-1 right-1 bg-black/40 rounded-full p-1.5"
							>
								<Ionicons
									name={isFavorite ? "heart" : "heart-outline"}
									size={18}
									color={isFavorite ? "red" : "#F9FAFB"}
								/>
							</Pressable>
						)}
					</View>
				)}

				{/* Innhold */}
				<View className="p-3">
					{/* Tittel */}
					<Text
						className="text-[14px] font-bold text-[#064E3B] mb-2"
						numberOfLines={1}
					>
						{dugnad.title}
					</Text>

					{/* Kategori */}
					{dugnad.category && (
						<View className="self-start bg-[#D9F2E3] px-2 py-1 rounded-full mb-2">
							<Text className="text-[10px] font-semibold text-[#064E3B] uppercase">
								{dugnad.category}
							</Text>
						</View>
					)}

					{/* Lokasjon */}
					<Text className="text-[12px] text-gray-600 mb-1" numberOfLines={1}>
						{dugnad.location}
					</Text>

					{/* Dato */}
					<Text className="text-[11px] text-gray-500 mb-2" numberOfLines={1}>
						{dugnad.date}
					</Text>

					{/* Påmeldte */}
					<Text className="text-[11px] text-gray-700">
						Påmeldte:{" "}
						<Text className="font-semibold">
							{dugnad.currentVolunteers}/{dugnad.maxVolunteers}
						</Text>
					</Text>
				</View>
			</View>
		</Pressable>
	);
}
