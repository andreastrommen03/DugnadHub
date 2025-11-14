// src/app/(protected)/dugnadDetails/[id].tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
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

export default function DugnadDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const dugnad = DUMMY_DUGNADS.find((d) => d.id === id);

	if (!dugnad) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Fant ikke dugnaden</Text>
				<Text style={styles.text}>ID: {id}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{dugnad.title}</Text>
			<Text style={styles.text}>{dugnad.description}</Text>
			<Text style={styles.text}>Sted: {dugnad.location}</Text>
			<Text style={styles.text}>Tidspunkt: {dugnad.date}</Text>
			<Text style={styles.text}>
				Påmeldte: {dugnad.currentVolunteers}/{dugnad.maxVolunteers}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#20202A",
		padding: 16,
	},
	title: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 12,
	},
	text: {
		color: "#fff",
		fontSize: 14,
		marginBottom: 4,
	},
});
