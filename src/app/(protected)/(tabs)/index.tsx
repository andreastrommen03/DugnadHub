// src/app/(protected)/(tabs)/index.tsx
import React from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { DugnadData } from "../../../utils/firebaseTypes";

const DUMMY_DUGNADS: DugnadData[] = [
	{
		id: "1",
		title: "Rydding av skolegård",
		description: "Vi rydder søppel og løv rundt skolen.",
		location: "Trondheim vgs",
		date: "12. november 2025, 17:00",
		maxVolunteers: 10,
		currentVolunteers: 3,
	},
	{
		id: "2",
		title: "Dugnad i borettslaget",
		description: "Vaske trapper og rydde bodområder.",
		location: "Lerkendal borettslag",
		date: "15. november 2025, 11:00",
		maxVolunteers: 8,
		currentVolunteers: 5,
	},
];

export default function DugnaderHomeScreen() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Kommende dugnader</Text>
			<FlatList
				data={DUMMY_DUGNADS}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ paddingBottom: 24 }}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.card}
						onPress={() => router.push(`/(protected)/dugnadDetails/${item.id}`)}
					>
						<Text style={styles.cardTitle}>{item.title}</Text>
						<Text style={styles.cardText}>{item.location}</Text>
						<Text style={styles.cardSub}>{item.date}</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#20202A",
		paddingHorizontal: 16,
		paddingTop: 32,
	},
	title: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "bold",
	},
	cardText: {
		fontSize: 14,
	},
	cardSub: {
		fontSize: 12,
		color: "#555",
		marginTop: 4,
	},
});
