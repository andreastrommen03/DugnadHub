// src/utils/firebaseTypes.ts

export type DugnadData = {
	id: string;
	title: string;
	description: string;
	location: string;
	date: string;
	maxVolunteers: number;
	currentVolunteers: number;
	imageUrl?: string; // hvis du har det
};
