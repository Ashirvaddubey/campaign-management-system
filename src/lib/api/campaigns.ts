import { supabase } from '../supabase';
import { Campaign } from '../../types';

export async function getCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCampaign(id: string) {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      campaign_analytics (
        impressions,
        clicks,
        conversions,
        date
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('campaigns')
    .insert([campaign])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCampaign(id: string, updates: Partial<Campaign>) {
  const { data, error } = await supabase
    .from('campaigns')
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

export async function deleteCampaign(id: string) {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getCampaignAnalytics(campaignId: string) {
  const { data, error } = await supabase
    .from('campaign_analytics')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
} 