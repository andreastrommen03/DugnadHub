// src/utils/firebaseTypes.ts

export type DugnadData = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string; // f.eks. "12. nov 2025, 17:00"
  maxVolunteers: number;
  currentVolunteers: number;
  imageUrl?: string; // valgfri
};
