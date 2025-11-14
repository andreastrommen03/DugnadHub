// src/components/DugnadCard.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { DugnadData } from "../utils/firebaseTypes";

type Props = {
	dugnad: DugnadData;
	onPress: () => void;
};

export default function DugnadCard({ dugnad, onPress }: Props) {
	return (
		<Pressable
			onPress={onPress}
			className="mb-3 rounded-xl bg-white px-4 py-3 shadow"
		>
			<Text className="text-lg font-semibold text-black">{dugnad.title}</Text>
			<Text className="text-sm text-gray-700">{dugnad.location}</Text>
			<Text className="text-xs text-gray-500 mt-1">{dugnad.date}</Text>

			<Text className="text-xs text-gray-600 mt-2">
				{dugnad.currentVolunteers}/{dugnad.maxVolunteers} påmeldt
			</Text>
		</Pressable>
	);
}
