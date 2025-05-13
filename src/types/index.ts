export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string | number | boolean;
}

export interface RuleGroup {
  id: string;
  combinator: 'AND' | 'OR';
  rules: (Rule | RuleGroup)[];
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  rules: RuleGroup;
  message: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  audience_size: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignAnalytics {
  id: string;
  campaign_id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  user_id: string;
  rules: RuleGroup;
  created_at: string;
  updated_at: string;
}

export interface FieldOption {
  id: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  operators: string[];
}