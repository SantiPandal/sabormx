// This is our dashboard page
// It will display restaurants and bars in different categories

import supabase from '@/utils/supabase';
import { Restaurants, Bars } from '@/types/database';

// This makes the page dynamic so it fetches fresh data on each request
export const dynamic = 'force-dynamic';

// Server Component to fetch and display data
export default async function Dashboard() {
  // Fetch restaurants and bars from our database
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*');
  
  const { data: bars } = await supabase
    .from('bars')
    .select('*');

  // Filter for hot spots
  const hotSpots = [
    ...(restaurants?.filter(r => r.is_hot_spot) || []),
    ...(bars?.filter(b => b.vibrant_nightlife) || [])
  ];
  
  // Filter for date spots (from both restaurants and bars)
  const dateSpots = [
    ...(restaurants?.filter(r => r.good_for_date) || []),
    ...(bars?.filter(b => b.good_for_date) || [])
  ];

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">SaborMX Dashboard</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Hot Spots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotSpots.map((spot) => (
            <div key={spot.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-medium">{spot.name}</h3>
              <p className="text-gray-600">{spot.address}, {spot.city}</p>
              <p>Type: {'cuisine_type' in spot ? spot.cuisine_type : (spot as Bars).bar_type}</p>
              <p>Rating: {spot.rating}/5</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Perfect for Date Night</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dateSpots.map((spot) => (
            <div key={spot.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-medium">{spot.name}</h3>
              <p className="text-gray-600">{spot.address}, {spot.city}</p>
              <p>Type: {'cuisine_type' in spot ? spot.cuisine_type : (spot as Bars).bar_type}</p>
              <p>Rating: {spot.rating}/5</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
