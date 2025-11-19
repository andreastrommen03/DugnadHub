import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#ECFDF3",
				tabBarInactiveTintColor: "#BBF7D0",

				tabBarStyle: {
					backgroundColor: "#064E3B",
					borderTopWidth: 1,
					borderTopColor: "#0B624E",
					height: 60,
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
