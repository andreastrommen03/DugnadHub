// src/components/DugnadCard.tsx
import React from "react";
import { Text, Pressable, View } from "react-native";
import { DugnadData } from "../utils/firebaseTypes";

type Props = {
	dugnad: DugnadData;
	onPress: () => void;
};

export default function DugnadCard({ dugnad, onPress }: Props) {
	return (
		<Pressable
			onPress={onPress}
			className="bg-white rounded-xl p-4 mb-4 shadow"
		>
			<Text className="text-lg font-semibold text-black">{dugnad.title}</Text>
			<Text className="text-gray-700">{dugnad.location}</Text>
			<Text className="text-gray-500 text-xs mt-1">{dugnad.date}</Text>

			<View className="mt-2 flex-row">
				<Text className="text-gray-800 text-xs">
					{dugnad.currentVolunteers}/{dugnad.maxVolunteers} påmeldt
				</Text>
			</View>
		</Pressable>
	);
}
