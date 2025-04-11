// This is our API endpoint for restaurants
// In Next.js 13+ App Router, API endpoints are defined as route handlers

import { NextResponse } from 'next/server';
import supabase from '@/utils/providers/supabase';

// GET handler to fetch all bars
export async function GET() {
  try {
    // Query the Supabase database for all bars
    const { data, error } = await supabase
      .from('bars')
      .select('*');
    
    // Handle any errors from Supabase
    if (error) {
      console.error('Error fetching bars:', error);
      return NextResponse.json({ error: 'Failed to fetch bars' }, { status: 500 });
    }
    
    // Return the bar data as JSON
    return NextResponse.json(data);
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
