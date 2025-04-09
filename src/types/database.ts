// Define types for our database models
// These help TypeScript understand the shape of our data

export interface Restaurants {
  id: string;
  name: string;
  address: string;
  city: string;
  cuisine_type: string;
  price_range: 1 | 2 | 3 | 4; // 1-4 representing $ to $$$$
  rating: number;
  image_url: string;
  is_hot_spot: boolean;
  good_for_date: boolean;
  good_for_groups: boolean;
  created_at: string;
}

export interface Bars {
  id: string;
  name: string;
  address: string;
  city: string;
  bar_type: string; // cocktail, beer, wine, etc.
  price_range: 1 | 2 | 3 | 4;
  rating: number;
  image_url: string;
  has_food: boolean;
  good_for_date: boolean;
  vibrant_nightlife: boolean;
  created_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  place_id: string;
  place_type: 'restaurant' | 'bar';
  created_at: string;
}
