// src/app/(protected)/createDugnad.tsx

import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	ScrollView,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { createDugnad } from "../../api/dugnadApi";

export default function CreateDugnadScreen() {
	const router = useRouter();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [date, setDate] = useState("");
	const [maxVolunteers, setMaxVolunteers] = useState("");
	const [category, setCategory] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleCreate = async () => {
		if (!title.trim() || !description.trim() || !location.trim()) {
			Alert.alert(
				"Manglende informasjon",
				"Tittel, beskrivelse og sted må fylles ut."
			);
			return;
		}

		if (!maxVolunteers.trim() || isNaN(Number(maxVolunteers))) {
			Alert.alert(
				"Ugyldig antall",
				"Skriv inn et gyldig tall for maks frivillige."
			);
			return;
		}

		const max = Number(maxVolunteers);

		setIsSubmitting(true);

		try {
			await createDugnad({
				title: title.trim(),
				description: description.trim(),
				location: location.trim(),
				date: date.trim(), // enkel string, det er greit for eksamen
				maxVolunteers: max,
				category: category.trim() || "Ukjent",
				imageUrl: null, // vi legger til ekte bilde senere
			});

			// Tilbake til dugnad-listen
			router.replace("/(protected)/(tabs)");
		} catch (error) {
			console.error("Feil ved oppretting av dugnad:", error);
			Alert.alert(
				"Noe gikk galt",
				"Kunne ikke opprette dugnad. Prøv igjen senere."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View className="flex-1 bg-[#20202A]">
			<Stack.Screen
				options={{
					title: "Ny dugnad",
				}}
			/>

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				className="flex-1"
			>
				<ScrollView
					contentContainerClassName="px-4 pt-6 pb-10"
					keyboardShouldPersistTaps="handled"
				>
					<Text className="text-white text-2xl font-bold mb-4">
						Opprett en ny dugnad
					</Text>

					{/* Tittel */}
					<View className="mb-4">
						<Text className="text-gray-200 mb-1">Tittel</Text>
						<TextInput
							value={title}
							onChangeText={setTitle}
							placeholder="F.eks. Loppemarked for idrettslaget"
							placeholderTextColor="#9CA3AF"
							className="bg-[#111827] text-white px-3 py-2 rounded-lg border border-gray-700"
						/>
					</View>

					{/* Beskrivelse */}
					<View className="mb-4">
						<Text className="text-gray-200 mb-1">Beskrivelse</Text>
						<TextInput
							value={description}
							onChangeText={setDescription}
							placeholder="Hva skal gjøres på dugnaden?"
							placeholderTextColor="#9CA3AF"
							multiline
							numberOfLines={4}
							textAlignVertical="top"
							className="bg-[#111827] text-white px-3 py-2 rounded-lg border border-gray-700"
						/>
					</View>

					{/* Kategori */}
					<View className="mb-4">
						<Text className="text-gray-200 mb-1">Kategori</Text>
						<TextInput
							value={category}
							onChangeText={setCategory}
							placeholder="F.eks. Nabolag, Miljø, Idrett..."
							placeholderTextColor="#9CA3AF"
							className="bg-[#111827] text-white px-3 py-2 rounded-lg border border-gray-700"
						/>
					</View>

					{/* Sted */}
					<View className="mb-4">
						<Text className="text-gray-200 mb-1">Sted</Text>
						<TextInput
							value={location}
							onChangeText={setLocation}
							placeholder="Hvor skjer dugnaden?"
							placeholderTextColor="#9CA3AF"
							className="bg-[#111827] text-white px-3 py-2 rounded-lg border border-gray-700"
						/>
					</View>

					{/* Dato / tidspunkt */}
					<View className="mb-4">
						<Text className="text-gray-200 mb-1">Dato og tidspunkt</Text>
						<TextInput
							value={date}
							onChangeText={setDate}
							placeholder="F.eks. 23. november 2025, 11:00"
							placeholderTextColor="#9CA3AF"
							className="bg-[#111827] text-white px-3 py-2 rounded-lg border border-gray-700"
						/>
					</View>

					{/* Maks frivillige */}
					<View className="mb-6">
						<Text className="text-gray-200 mb-1">Maks antall frivillige</Text>
						<TextInput
							value={maxVolunteers}
							onChangeText={setMaxVolunteers}
							placeholder="F.eks. 10"
							placeholderTextColor="#9CA3AF"
							keyboardType="number-pad"
							className="bg-[#111827] text-white px-3 py-2 rounded-lg border border-gray-700"
						/>
					</View>

					{/* Knapp */}
					<TouchableOpacity
						onPress={handleCreate}
						disabled={isSubmitting}
						className={`py-3 rounded-xl items-center ${
							isSubmitting ? "bg-gray-500" : "bg-emerald-600"
						}`}
					>
						{isSubmitting ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text className="text-white font-semibold text-lg">
								Opprett dugnad
							</Text>
						)}
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
