-- Create custom types
CREATE TYPE public.campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');

-- Create campaigns table
CREATE TABLE public.campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rules JSONB NOT NULL DEFAULT '{"combinator": "AND", "rules": []}'::JSONB,
    message TEXT,
    status campaign_status DEFAULT 'draft',
    audience_size INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create campaign_analytics table
CREATE TABLE public.campaign_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create audience_segments table
CREATE TABLE public.audience_segments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rules JSONB NOT NULL DEFAULT '{"combinator": "AND", "rules": []}'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Set up Row Level Security (RLS) policies

-- Campaigns RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own campaigns" 
    ON public.campaigns FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own campaigns" 
    ON public.campaigns FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" 
    ON public.campaigns FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns" 
    ON public.campaigns FOR DELETE 
    USING (auth.uid() = user_id);

-- Campaign Analytics RLS
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics for their campaigns" 
    ON public.campaign_analytics FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE campaigns.id = campaign_analytics.campaign_id 
            AND campaigns.user_id = auth.uid()
        )
    );

-- Audience Segments RLS
ALTER TABLE public.audience_segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audience segments" 
    ON public.audience_segments FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audience segments" 
    ON public.audience_segments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audience segments" 
    ON public.audience_segments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audience segments" 
    ON public.audience_segments FOR DELETE 
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaign_analytics_campaign_id ON public.campaign_analytics(campaign_id);
CREATE INDEX idx_audience_segments_user_id ON public.audience_segments(user_id); 