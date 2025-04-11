interface BarCardProps {
  name: string;
  bar_type: string;
  rating: number;
  image_url: string;
  price_range: number;
  address: string;
  city: string;
  has_food?: boolean;
}

/**
 * Card component for displaying bar information
 */
export default function BarCard({ 
  name,
  bar_type,
  rating,
  image_url,
  price_range,
  address,
  city,
  has_food
}: BarCardProps) {
  // Function to format price into $ symbols
  const getPriceSymbol = (price: number) => {
    return '$'.repeat(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <img 
          src={image_url || '/placeholder-bar.jpg'} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-2">{address}, {city}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">{bar_type}</span>
          <span className="text-green-600 font-medium">{getPriceSymbol(price_range)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
          </div>
          {has_food && (
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Food Available
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 