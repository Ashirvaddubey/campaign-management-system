# Backend Infrastructure (Supabase)

This application uses Supabase as its backend infrastructure. Supabase is a powerful open-source Firebase alternative that provides all the backend services needed for this application.

## Database Schema

### Tables

1. `campaigns`
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

2. `campaign_analytics`
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

3. `audience_segments`
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

## Authentication

- Google OAuth integration
- Row Level Security (RLS) policies for data protection
- User management through Supabase Auth

## API Services

The backend provides the following services:

1. Campaign Management
   - Create, read, update, delete campaigns
   - Campaign analytics tracking
   - AI-powered message generation

2. Audience Segmentation
   - Create and manage audience segments
   - Apply targeting rules
   - Calculate audience size

3. Analytics
   - Track campaign performance
   - Generate insights
   - Real-time analytics updates

## Row Level Security (RLS) Policies

### Campaigns Table
```sql
-- Enable RLS
alter table campaigns enable row level security;

-- Create policy for select
create policy "Users can view their own campaigns"
  on campaigns for select
  using (auth.uid() = user_id);

-- Create policy for insert
create policy "Users can create campaigns"
  on campaigns for insert
  with check (auth.uid() = user_id);

-- Create policy for update
create policy "Users can update their own campaigns"
  on campaigns for update
  using (auth.uid() = user_id);

-- Create policy for delete
create policy "Users can delete their own campaigns"
  on campaigns for delete
  using (auth.uid() = user_id);
```

### Audience Segments Table
```sql
-- Enable RLS
alter table audience_segments enable row level security;

-- Create policies
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

## Environment Variables

The following environment variables are required for backend configuration:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Backend Services Integration

The backend services are integrated into the frontend through the following service files:

1. `src/lib/supabase.ts` - Supabase client configuration
2. `src/lib/api/campaigns.ts` - Campaign management API
3. `src/lib/api/segments.ts` - Audience segmentation API
4. `src/lib/openai.ts` - OpenAI integration for message generation

## Deployment

The backend is hosted on Supabase's infrastructure. No additional deployment steps are required as Supabase handles all backend hosting and scaling automatically. 