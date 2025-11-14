// src/app/(protected)/(tabs)/profilePage.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useAuthSession } from "../../../providers/authctx";

export default function ProfilePage() {
	const { user, signOut } = useAuthSession();

	const email = user?.email ?? "Ukjent bruker";

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<View className="flex-1 bg-[#20202A] px-4 pt-10">
			<Text className="text-white text-3xl font-bold mb-4">Profil</Text>

			<View className="bg-white rounded-2xl p-4 mb-6">
				<Text className="text-gray-800 font-semibold text-base mb-1">
					Innlogget som:
				</Text>
				<Text className="text-gray-900 text-sm">{email}</Text>
			</View>

			<Pressable
				className="bg-[#FF9B52] rounded-full py-3 items-center"
				onPress={handleSignOut}
			>
				<Text className="text-white font-semibold">Logg ut</Text>
			</Pressable>
		</View>
	);
}
