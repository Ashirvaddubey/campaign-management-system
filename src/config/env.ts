interface EnvConfig {
  appName: string;
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  googleClientId: string;
  googleClientSecret: string;
  openaiApiKey: string;
}

export const env: EnvConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'CampaignHQ',
  apiUrl: import.meta.env.VITE_API_URL || `${window.location.origin}/api`,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  googleClientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
};