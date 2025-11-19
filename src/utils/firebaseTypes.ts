export type DugnadData = {
	id: string;
	title: string;
	description: string;
	location: string;
	date: string;
	maxVolunteers: number;
	currentVolunteers: number;
	imageUrl?: string;
	imageUrls?: string[];
	category: string;
	participants?: string[];
	favoritedBy?: string[];
};
