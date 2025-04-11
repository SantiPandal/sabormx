// This is our API endpoint for restaurants
// In Next.js 13+ App Router, API endpoints are defined as route handlers

import { NextResponse } from 'next/server';
import supabase from '@/utils/providers/supabase';

// GET handler to fetch all restaurants
export async function GET() {
  try {
    // Query the Supabase database for all restaurants
    const { data, error } = await supabase
      .from('restaurants')
      .select('*');
    
    // Handle any errors from Supabase
    if (error) {
      console.error('Error fetching restaurants:', error);
      return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
    }
    
    // Return the restaurant data as JSON
    return NextResponse.json(data);
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
