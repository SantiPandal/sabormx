import { supabase } from '../providers/supabase';
import { ProcessedRestaurantData } from './types';
import { Restaurants } from '../../types/database';

/**
 * Saves processed restaurant data to the Supabase database
 * @param data The processed restaurant data to save
 * @returns The saved restaurant data from the database
 */
export async function saveRestaurantToDatabase(data: ProcessedRestaurantData): Promise<Restaurants> {
  try {
    console.log(`Saving restaurant to database: ${data.name}`);
    
    // Convert our processed data to match the database structure
    const restaurantData: Partial<Restaurants> = {
      name: data.name,
      address: data.address,
      city: data.city,
      cuisine_type: data.cuisine_type,
      price_range: data.price_level as 1 | 2 | 3 | 4,
      rating: data.rating,
      image_url: data.image_url || '',
      is_hot_spot: data.is_hot_spot,
      good_for_date: data.good_for_date,
      good_for_groups: false, // Default value since our AI doesn't extract this
    };
    
    // Insert the data into the restaurants table
    const { data: savedData, error } = await supabase
      .from('restaurants')
      .insert(restaurantData)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!savedData) {
      throw new Error('Failed to retrieve saved restaurant data');
    }
    
    console.log(`Successfully saved restaurant with ID: ${savedData.id}`);
    return savedData;
    
  } catch (error) {
    console.error('Error saving restaurant to database:', error);
    throw new Error(`Failed to save restaurant to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Saves multiple restaurants to the database
 * @param dataArray Array of processed restaurant data
 * @returns Array of saved restaurant data from the database
 */
export async function batchSaveToDatabase(dataArray: ProcessedRestaurantData[]): Promise<Restaurants[]> {
  try {
    console.log(`Saving ${dataArray.length} restaurants to database`);
    
    // For each restaurant in our data...
    const savedRestaurants: Restaurants[] = [];
    
    // Process one at a time to handle errors individually
    for (const data of dataArray) {
      try {
        const savedRestaurant = await saveRestaurantToDatabase(data);
        savedRestaurants.push(savedRestaurant);
      } catch (error) {
        // Log the error but continue with other restaurants
        console.error(`Error saving restaurant "${data.name}":`, error);
      }
    }
    
    console.log(`Successfully saved ${savedRestaurants.length} of ${dataArray.length} restaurants`);
    return savedRestaurants;
    
  } catch (error) {
    console.error('Error in batch save:', error);
    throw new Error(`Failed to save restaurants to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Checks if a restaurant already exists in the database
 * @param name Restaurant name
 * @param address Restaurant address
 * @returns True if the restaurant exists, false otherwise
 */
export async function restaurantExists(name: string, address: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('id')
      .eq('name', name)
      .eq('address', address)
      .maybeSingle();
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    return !!data; // Convert to boolean (true if data exists, false otherwise)
    
  } catch (error) {
    console.error('Error checking if restaurant exists:', error);
    throw new Error(`Failed to check if restaurant exists: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
