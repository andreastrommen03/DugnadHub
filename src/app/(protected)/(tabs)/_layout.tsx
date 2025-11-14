// src/app/(protected)/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#FF9B52",
				tabBarInactiveTintColor: "#cccccc",
				tabBarStyle: {
					backgroundColor: "#20202A",
					borderTopColor: "#333333",
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
