import { supabase } from '../supabase';

export async function testConnection() {
  try {
    // First, check if we have an authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;

    console.log('Current user:', user);

    // Try to create a test campaign
    if (user) {
      const testCampaign = {
        user_id: user.id,
        name: 'Test Campaign',
        description: 'This is a test campaign',
        rules: {
          id: 'test-rule-group',
          combinator: 'AND',
          rules: []
        },
        message: 'Test campaign message',
        status: 'draft',
        audience_size: 100
      };

      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert([testCampaign])
        .select()
        .single();

      if (campaignError) throw campaignError;
      console.log('Test campaign created:', campaign);

      // Try to read the campaign back
      const { data: campaigns, error: readError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id);

      if (readError) throw readError;
      console.log('All user campaigns:', campaigns);

      return { success: true, user, campaigns };
    } else {
      throw new Error('No authenticated user found');
    }
  } catch (error) {
    console.error('Test failed:', error);
    return { success: false, error };
  }
} 