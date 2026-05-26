CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    location text,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    image_url text,
    attendees jsonb DEFAULT '[]'::jsonb
);

CREATE TABLE public.social_groups (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    name text NOT NULL,
    description text,
    image_url text,
    member_count integer DEFAULT 0,
    events_count integer DEFAULT 0
);
