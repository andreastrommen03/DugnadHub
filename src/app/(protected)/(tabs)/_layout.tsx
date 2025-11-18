// src/app/(protected)/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,

				// 🌿 God kontrast + pastellstil
				tabBarActiveTintColor: "#ECFDF3", // veldig lys pastell
				tabBarInactiveTintColor: "#BBF7D0", // lys mintgrønn

				tabBarStyle: {
					backgroundColor: "#064E3B", // mørk grønn
					borderTopWidth: 1,
					borderTopColor: "#0B624E", // subtil kontrast
					height: 60, // litt større for lesbarhet
				},

				tabBarLabelStyle: {
					fontSize: 13,
					fontWeight: "600",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Dugnader",
				}}
			/>
			<Tabs.Screen
				name="profilePage"
				options={{
					title: "Profil",
				}}
			/>
		</Tabs>
	);
}
