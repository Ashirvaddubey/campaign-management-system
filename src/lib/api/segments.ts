import { supabase } from '../supabase';
import { AudienceSegment } from '../../types';

export async function getSegments() {
  const { data, error } = await supabase
    .from('audience_segments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSegment(id: string) {
  const { data, error } = await supabase
    .from('audience_segments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createSegment(segment: Omit<AudienceSegment, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('audience_segments')
    .insert([segment])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSegment(id: string, updates: Partial<AudienceSegment>) {
  const { data, error } = await supabase
    .from('audience_segments')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSegment(id: string) {
  const { error } = await supabase
    .from('audience_segments')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Calculate estimated audience size for a segment
export async function calculateSegmentSize(rules: any) {
  // In a real application, this would query your customer database
  // For now, we'll return a random number
  return Math.floor(Math.random() * 10000);
} 