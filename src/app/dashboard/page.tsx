// This is our dashboard page
// It handles data fetching and passes the data to the Dashboard component

import { supabase } from '@/utils/providers/supabase';
import { Restaurants, Bars } from '@/types/database';
import Dashboard from '@/components/Dashboard';

// This makes the page dynamic so it fetches fresh data on each request
export const dynamic = 'force-dynamic';

// Server Component to fetch data and render the Dashboard component
export default async function DashboardPage() {
  console.log('Starting to fetch data...');
  
  // Fetch restaurants from our database
  const { data: restaurants, error: restaurantError } = await supabase
    .from('restaurants')
    .select('*');
  
  if (restaurantError) {
    console.error('Error fetching restaurants:', restaurantError);
  } else {
    console.log('Fetched restaurants:', restaurants?.length || 0);
  }

  // Fetch bars from our database
  const { data: bars, error: barError } = await supabase
    .from('bars')
    .select('*');

  if (barError) {
    console.error('Error fetching bars:', barError);
  } else {
    console.log('Fetched bars:', bars?.length || 0);
  }

  // Render the Dashboard component with the fetched data
  return <Dashboard restaurants={restaurants || []} bars={bars || []} />;
}
