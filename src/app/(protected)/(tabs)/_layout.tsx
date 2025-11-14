// src/app/(protected)/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Dugnader", // tekst på tab
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
