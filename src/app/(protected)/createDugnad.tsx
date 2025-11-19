import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	ScrollView,
	Pressable,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Image,
	Modal,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { createDugnad } from "../../api/dugnadApi";
import SelectImageModal from "../../components/SelectImageModal";

export default function CreateDugnadScreen() {
	const router = useRouter();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [date, setDate] = useState("");
	const [maxVolunteers, setMaxVolunteers] = useState("");
	const [category, setCategory] = useState("");

	const [localImages, setLocalImages] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);

	const handleCreate = async () => {
		if (!title.trim() || !description.trim() || !location.trim()) {
			Toast.show({
				type: "error",
				text1: "Manglende informasjon",
				text2: "Tittel, beskrivelse og sted må fylles ut.",
			});
			return;
		}

		if (!maxVolunteers.trim() || isNaN(Number(maxVolunteers))) {
			Toast.show({
				type: "error",
				text1: "Ugyldig antall",
				text2: "Skriv inn et gyldig tall for maks frivillige.",
			});
			return;
		}

		const max = Number(maxVolunteers);
		setIsSubmitting(true);

		try {
			await createDugnad({
				title: title.trim(),
				description: description.trim(),
				location: location.trim(),
				date: date.trim(),
				maxVolunteers: max,
				category: category.trim() || "Ukjent",
				images: localImages,
			});

			router.replace("/(protected)/(tabs)");
		} catch (error) {
			console.error("Feil ved oppretting av dugnad:", error);
			Toast.show({
				type: "error",
				text1: "Noe gikk galt",
				text2: "Kunne ikke opprette dugnad. Prøv igjen senere.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View className="flex-1 bg-[#ECFDF3]">
			<Stack.Screen
				options={{
					title: "Ny dugnad",
					headerStyle: { backgroundColor: "#064E3B" },
					headerTintColor: "#D9F2E3",
					headerTitleStyle: { color: "#D9F2E3" },
				}}
			/>

			{/* SelectImageModal for kamera / galleri */}
			<Modal visible={isImageModalOpen} animationType="slide">
				<SelectImageModal
					closeModal={() => setIsImageModalOpen(false)}
					setImages={setLocalImages}
					currentImages={localImages}
				/>
			</Modal>

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				className="flex-1"
			>
				<ScrollView
					contentContainerClassName="px-4 pt-6 pb-10"
					keyboardShouldPersistTaps="handled"
				>
					<Text className="text-[#064E3B] text-2xl font-bold mb-4">
						Opprett en ny dugnad
					</Text>

					{/* Tittel */}
					<View className="mb-4">
						<Text className="text-[#064E3B] mb-1">Tittel</Text>
						<TextInput
							value={title}
							onChangeText={setTitle}
							placeholder="F.eks. Loppemarked for idrettslaget"
							placeholderTextColor="#6B7280"
							className="bg-[#f4fbf7] text-[#064E3B] px-3 py-2 rounded-lg border border-[#064E3B]"
						/>
					</View>

					{/* Beskrivelse */}
					<View className="mb-4">
						<Text className="text-[#064E3B] mb-1">Beskrivelse</Text>
						<TextInput
							value={description}
							onChangeText={setDescription}
							placeholder="Hva skal gjøres på dugnaden?"
							placeholderTextColor="#6B7280"
							multiline
							numberOfLines={4}
							textAlignVertical="top"
							className="bg-[#f4fbf7] text-[#064E3B] px-3 py-2 rounded-lg border border-[#064E3B]"
						/>
					</View>

					{/* Kategori */}
					<View className="mb-4">
						<Text className="text-[#064E3B] mb-1">Kategori</Text>
						<TextInput
							value={category}
							onChangeText={setCategory}
							placeholder="F.eks. Nabolag"
							placeholderTextColor="#6B7280"
							className="bg-[#f4fbf7] text-[#064E3B] px-3 py-2 rounded-lg border border-[#064E3B]"
						/>
					</View>

					{/* Sted */}
					<View className="mb-4">
						<Text className="text-[#064E3B] mb-1">Sted</Text>
						<TextInput
							value={location}
							onChangeText={setLocation}
							placeholder="Hvor skjer dugnaden?"
							placeholderTextColor="#6B7280"
							className="bg-[#f4fbf7] text-[#064E3B] px-3 py-2 rounded-lg border border-[#064E3B]"
						/>
					</View>

					{/* Dato */}
					<View className="mb-4">
						<Text className="text-[#064E3B] mb-1">Dato og tidspunkt</Text>
						<TextInput
							value={date}
							onChangeText={setDate}
							placeholder="F.eks. 23. november 2025, 11:00"
							placeholderTextColor="#6B7280"
							className="bg-[#f4fbf7] text-[#064E3B] px-3 py-2 rounded-lg border border-[#064E3B]"
						/>
					</View>

					{/* Maks frivillige */}
					<View className="mb-6">
						<Text className="text-[#064E3B] mb-1">Maks antall frivillige</Text>
						<TextInput
							value={maxVolunteers}
							onChangeText={setMaxVolunteers}
							placeholder="F.eks. 10"
							placeholderTextColor="#6B7280"
							keyboardType="number-pad"
							className="bg-[#f4fbf7] text-[#064E3B] px-3 py-2 rounded-lg border border-[#064E3B]"
						/>
					</View>

					{/* Bilder */}
					<View className="mb-6">
						<Text className="text-[#064E3B] mb-2">Bilder (valgfritt)</Text>

						{localImages.length > 0 ? (
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								className="mb-3"
							>
								{localImages.map((uri, idx) => (
									<Image
										key={`${uri}-${idx}`}
										source={{ uri }}
										className="w-32 h-32 rounded-lg mr-3"
										resizeMode="cover"
									/>
								))}
							</ScrollView>
						) : (
							<Text className="text-[#166534] mb-3 text-sm">
								Du har ikke valgt noen bilder ennå.
							</Text>
						)}

						<View className="flex-row gap-3">
							<Pressable
								onPress={() => setIsImageModalOpen(true)}
								className="flex-1 py-2 rounded-xl items-center"
								style={{ backgroundColor: "#064E3B" }}
							>
								<Text className="text-white font-semibold text-sm">
									Velg fra galleri
								</Text>
							</Pressable>

							<Pressable
								onPress={() => setIsImageModalOpen(true)}
								className="flex-1 py-2 rounded-xl items-center"
								style={{ backgroundColor: "#064E3B" }}
							>
								<Text className="text-white font-semibold text-sm">
									Ta bilde
								</Text>
							</Pressable>
						</View>
					</View>

					{/* Opprett-knapp */}
					<Pressable
						onPress={handleCreate}
						disabled={isSubmitting}
						className="py-3 rounded-xl items-center"
						style={{
							backgroundColor: isSubmitting ? "#9CA3AF" : "#064E3B",
						}}
					>
						{isSubmitting ? (
							<ActivityIndicator color="#ffffff" />
						) : (
							<Text className="text-white font-semibold text-lg">
								Opprett dugnad
							</Text>
						)}
					</Pressable>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
