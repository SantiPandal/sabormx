interface RestaurantCardProps {
  name: string;
  cuisine_type: string;
  rating: number;
  image_url: string; // Keeping this in the interface even though we won't display it
  price_level: number;
  address: string;
  city: string;
}

export default function RestaurantCard({ 
  name,
  cuisine_type,
  rating,
  image_url, // Keeping this in the props even though we won't display it
  price_level,
  address,
  city
}: RestaurantCardProps) {
  // Function to format price into $ symbols
  const getPriceSymbol = (price: number) => {
    return '$'.repeat(price);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex flex-col">
        {/* Restaurant Name and Price Level */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <span className="text-green-600 font-medium">{getPriceSymbol(price_level)}</span>
        </div>
        
        {/* Cuisine Type with Pill Style */}
        <div className="mb-3">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
            {cuisine_type}
          </span>
        </div>
        
        {/* Address */}
        <p className="text-gray-500 text-sm mb-3">{address}, {city}</p>
        
        {/* Rating with Star */}
        <div className="flex items-center mt-auto">
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-gray-700 text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
