# Detailed Backend Infrastructure Documentation

## Overview
Our campaign management system utilizes Supabase as the Backend-as-a-Service (BaaS) solution, providing a robust and scalable serverless architecture. This document details the complete backend infrastructure.

## Database Architecture

### Core Tables

1. **Campaigns Table**
```sql
create table campaigns (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  description text,
  message text,
  rules jsonb,
  status text default 'draft',
  audience_size integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

2. **Campaign Analytics Table**
```sql
create table campaign_analytics (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references campaigns(id),
  impressions integer default 0,
  clicks integer default 0,
  conversions integer default 0,
  date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

3. **Audience Segments Table**
```sql
create table audience_segments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  description text,
  rules jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

## Security Implementation

### Row Level Security (RLS) Policies

#### Campaigns Table Security
```sql
-- Enable RLS
alter table campaigns enable row level security;

-- Select Policy
create policy "Users can view their own campaigns"
  on campaigns for select
  using (auth.uid() = user_id);

-- Insert Policy
create policy "Users can create campaigns"
  on campaigns for insert
  with check (auth.uid() = user_id);

-- Update Policy
create policy "Users can update their own campaigns"
  on campaigns for update
  using (auth.uid() = user_id);

-- Delete Policy
create policy "Users can delete their own campaigns"
  on campaigns for delete
  using (auth.uid() = user_id);
```

#### Audience Segments Security
```sql
-- Enable RLS
alter table audience_segments enable row level security;

-- Access Policies
create policy "Users can view their own segments"
  on audience_segments for select
  using (auth.uid() = user_id);

create policy "Users can create segments"
  on audience_segments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own segments"
  on audience_segments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own segments"
  on audience_segments for delete
  using (auth.uid() = user_id);
```

## API Services Structure

### 1. Campaign Management API
- Location: `src/lib/api/campaigns.ts`
- Functionality:
  - CRUD operations for campaigns
  - Campaign status management
  - Message generation with AI integration
  - Campaign rules processing

### 2. Audience Segmentation API
- Location: `src/lib/api/segments.ts`
- Functionality:
  - Segment creation and management
  - Rule-based targeting
  - Audience size calculation
  - Segment analytics

### 3. Analytics Service
- Location: `src/lib/api/analytics.ts`
- Features:
  - Real-time performance tracking
  - Conversion monitoring
  - Engagement metrics
  - Custom reporting

## Authentication System

### Configuration
- Implementation: Google OAuth
- Location: `src/lib/supabase.ts`
- Features:
  - Social authentication
  - Session management
  - Token handling
  - User profile management

## Environment Configuration

### Required Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Integration Files

1. **Supabase Client Configuration**
   - File: `src/lib/supabase.ts`
   - Purpose: Initialize and configure Supabase client

2. **Campaign Management API**
   - File: `src/lib/api/campaigns.ts`
   - Purpose: Handle campaign-related operations

3. **Audience Segmentation API**
   - File: `src/lib/api/segments.ts`
   - Purpose: Manage audience segments

4. **OpenAI Integration**
   - File: `src/lib/openai.ts`
   - Purpose: AI-powered message generation

## Deployment Information

### Production Environment
- Platform: Supabase Cloud
- Type: Serverless
- Scaling: Automatic
- Database: PostgreSQL (managed by Supabase)

### Access Points
- Main API: https://project-hmj8xg2is-ashirvaddubeys-projects.vercel.app
- Database: Managed through Supabase dashboard
- Authentication: Handled by Supabase Auth

## Technical Stack Overview

### Frontend
- Framework: React with TypeScript
- Build Tool: Vite
- State Management: React Context
- UI Components: Custom components with modern design

### Backend (Supabase)
- Database: PostgreSQL
- Authentication: Supabase Auth
- File Storage: Supabase Storage
- Real-time: Supabase Realtime
- Edge Functions: Supabase Edge Functions

This backend infrastructure provides a secure, scalable, and maintainable foundation for the campaign management system, leveraging the power of Supabase's serverless architecture while maintaining robust security and performance standards. 