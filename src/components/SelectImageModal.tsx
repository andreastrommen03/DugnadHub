import React, { useRef } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Button,
	Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Device from "expo-device";

type SelectImageModalProps = {
	closeModal: () => void;
	setImages: (images: string[]) => void;
	currentImages: string[];
};

export default function SelectImageModal({
	closeModal,
	setImages,
	currentImages,
}: SelectImageModalProps) {
	const cameraRef = useRef<CameraView | null>(null);
	const [permission, requestPermission] = useCameraPermissions();
	const isOSSimulator =
		(Platform.OS === "ios" && !Device.isDevice) ||
		(Platform.OS === "android" && !Device.isDevice);

	if (!permission && !isOSSimulator) {
		return <View />;
	}
	if (!isOSSimulator && permission && !permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					Vi trenger tilgang til kamera for å kunne ta bilde.
				</Text>
				<Button onPress={requestPermission} title="Gi tillatelse" />
			</View>
		);
	}
	const captureImage = async () => {
		const photo = await cameraRef.current?.takePictureAsync();
		if (photo?.uri) {
			setImages([...currentImages, photo.uri]);
			closeModal();
		}
	};

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			allowsMultipleSelection: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			const uris = result.assets.map((a) => a.uri);
			setImages([...currentImages, ...uris]);
			closeModal();
		}
	};

	return (
		<View style={styles.container}>
			{!isOSSimulator ? (
				<View style={styles.previewWrapper}>
					<CameraView
						ref={(r) => (cameraRef.current = r)}
						style={StyleSheet.absoluteFill}
						facing="back"
					/>
					<View style={styles.overlay}>
						<View style={styles.buttonContainer}>
							<TouchableOpacity style={styles.button} onPress={pickImage}>
								<Text style={styles.text}>Velg bilde</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.button, isOSSimulator && styles.buttonDisabled]}
								disabled={isOSSimulator}
								onPress={!isOSSimulator ? captureImage : undefined}
								accessibilityState={{ disabled: isOSSimulator }}
							>
								<Text style={styles.text}>Snap!</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.button} onPress={closeModal}>
								<Text style={styles.text}>Avbryt</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			) : (
				<View style={[StyleSheet.absoluteFill, styles.simPanel]}>
					<Text style={styles.text}>Simulator – bruk "Velg bilde"</Text>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={pickImage}>
							<Text style={styles.text}>Velg bilde</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.button} onPress={closeModal}>
							<Text style={styles.text}>Avbryt</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	previewWrapper: {
		flex: 1,
		position: "relative",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "flex-end",
	},
	simPanel: {
		backgroundColor: "#111",
		alignItems: "center",
		justifyContent: "center",
	},
	buttonContainer: {
		flexDirection: "row",
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 24,
	},
	button: {
		flex: 1,
		alignItems: "center",
	},
	buttonDisabled: {
		opacity: 0.4,
	},
	text: {
		fontSize: 16,
		fontWeight: "bold",
		color: "white",
	},
});
