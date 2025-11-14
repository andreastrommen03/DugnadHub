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
			className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
		>
			<Text className="text-lg font-semibold text-black">{dugnad.title}</Text>

			<Text className="text-gray-700 mt-1">{dugnad.location}</Text>

			<Text className="text-gray-500 text-xs mt-1">{dugnad.date}</Text>

			<View className="mt-3 flex-row items-center">
				<Text className="text-xs text-gray-700">
					Påmeldte:{" "}
					<Text className="font-semibold">
						{dugnad.currentVolunteers}/{dugnad.maxVolunteers}
					</Text>
				</Text>
			</View>
		</Pressable>
	);
}
