import { Restaurants, Bars } from '@/types/database';
import RestaurantCard from './restaurantCard';
import BarCard from './BarCard';

interface DashboardProps {
  restaurants: Restaurants[];
  bars: Bars[];
}

/**
 * Dashboard component that displays restaurants and bars
 * This separates the display logic from the data fetching
 */
export default function Dashboard({ restaurants, bars }: DashboardProps) {
  // Derive hot spots and date spots from the data
  const hotSpots = [
    ...(restaurants?.filter((r) => r.is_hot_spot) || []),
    ...(bars?.filter((b) => b.vibrant_nightlife) || [])
  ];
  
  const dateSpots = [
    ...(restaurants?.filter((r) => r.good_for_date) || []),
    ...(bars?.filter((b) => b.good_for_date) || [])
  ];

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">SaborMX Dashboard</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Hot Spots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotSpots.length === 0 ? (
            <p className="text-gray-500 col-span-3">No hot spots found. They'll appear here after processing restaurant data.</p>
          ) : (
            hotSpots.map((spot) => (
              'cuisine_type' in spot ? (
                <RestaurantCard
                  key={spot.id}
                  name={spot.name}
                  cuisine_type={spot.cuisine_type}
                  rating={spot.rating}
                  image_url={spot.image_url}
                  price_level={spot.price_range}
                  address={spot.address}
                  city={spot.city}
                />
              ) : (
                <BarCard
                  key={spot.id}
                  name={spot.name}
                  bar_type={spot.bar_type}
                  rating={spot.rating}
                  image_url={spot.image_url}
                  price_range={spot.price_range}
                  address={spot.address}
                  city={spot.city}
                  has_food={spot.has_food}
                />
              )
            ))
          )}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Perfect for Date Night</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dateSpots.length === 0 ? (
            <p className="text-gray-500 col-span-3">No date spots found. They'll appear here after processing restaurant data.</p>
          ) : (
            dateSpots.map((spot) => (
              'cuisine_type' in spot ? (
                <RestaurantCard
                  key={spot.id}
                  name={spot.name}
                  cuisine_type={spot.cuisine_type}
                  rating={spot.rating}
                  image_url={spot.image_url}
                  price_level={spot.price_range}
                  address={spot.address}
                  city={spot.city}
                />
              ) : (
                <BarCard
                  key={spot.id}
                  name={spot.name}
                  bar_type={spot.bar_type}
                  rating={spot.rating}
                  image_url={spot.image_url}
                  price_range={spot.price_range}
                  address={spot.address}
                  city={spot.city}
                  has_food={spot.has_food}
                />
              )
            ))
          )}
        </div>
      </section>
    </main>
  );
} 