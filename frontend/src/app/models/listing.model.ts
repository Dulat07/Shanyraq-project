export interface Listing {
  id: number;
  ownerId?: string;
  title: string;
  price: number;
  city: string;
  image: string;
  description: string;
  rooms: number;
  area: number;
  category: 'buy' | 'rent';
  type: 'Apartment' | 'House' | 'Commercial';
  furnished: boolean;
  parking: boolean;
  createdAt: string;
}
