create table "public"."communities" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "title" character varying not null,
    "description" text not null,
    "creator_id" uuid
);


alter table "public"."communities" enable row level security;

create table "public"."community_members" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "member_id" uuid not null,
    "community_id" bigint not null
);


alter table "public"."community_members" enable row level security;

create table "public"."followers" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "profile_id" uuid not null,
    "follower_id" uuid not null
);


alter table "public"."followers" enable row level security;

create table "public"."likes" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "post_id" bigint not null,
    "profile_id" uuid not null
);


alter table "public"."likes" enable row level security;

create table "public"."notifications" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "comment_id" bigint,
    "is_read" boolean not null,
    "owner_user_id" uuid not null,
    "post_id" bigint not null,
    "type" character varying not null,
    "profile_id" uuid not null
);


alter table "public"."notifications" enable row level security;

create table "public"."posts" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "content" text not null,
    "community_id" bigint,
    "profile_id" uuid,
    "parent_id" bigint
);


alter table "public"."posts" enable row level security;

create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "full_name" character varying,
    "username" character varying not null,
    "avatar_url" character varying,
    "biography" text,
    "user_id" uuid not null
);


alter table "public"."profiles" enable row level security;

create table "public"."reposts" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "post_id" bigint not null,
    "profile_id" uuid not null,
    "repost_date" timestamp with time zone not null
);


alter table "public"."reposts" enable row level security;

CREATE UNIQUE INDEX communities_pkey ON public.communities USING btree (id);

CREATE UNIQUE INDEX community_members_pkey ON public.community_members USING btree (id);

CREATE UNIQUE INDEX followers_pkey ON public.followers USING btree (id);

CREATE UNIQUE INDEX likes_pkey ON public.likes USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX reposts_pkey ON public.reposts USING btree (id);

alter table "public"."communities" add constraint "communities_pkey" PRIMARY KEY using index "communities_pkey";

alter table "public"."community_members" add constraint "community_members_pkey" PRIMARY KEY using index "community_members_pkey";

alter table "public"."followers" add constraint "followers_pkey" PRIMARY KEY using index "followers_pkey";

alter table "public"."likes" add constraint "likes_pkey" PRIMARY KEY using index "likes_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."reposts" add constraint "reposts_pkey" PRIMARY KEY using index "reposts_pkey";

alter table "public"."communities" add constraint "communities_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."communities" validate constraint "communities_creator_id_fkey";

alter table "public"."community_members" add constraint "community_members_community_id_fkey" FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE not valid;

alter table "public"."community_members" validate constraint "community_members_community_id_fkey";

alter table "public"."community_members" add constraint "community_members_member_id_fkey" FOREIGN KEY (member_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."community_members" validate constraint "community_members_member_id_fkey";

alter table "public"."followers" add constraint "followers_follower_id_fkey" FOREIGN KEY (follower_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."followers" validate constraint "followers_follower_id_fkey";

alter table "public"."followers" add constraint "followers_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."followers" validate constraint "followers_profile_id_fkey";

alter table "public"."likes" add constraint "likes_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE not valid;

alter table "public"."likes" validate constraint "likes_post_id_fkey";

alter table "public"."likes" add constraint "likes_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."likes" validate constraint "likes_profile_id_fkey";

alter table "public"."notifications" add constraint "notifications_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES posts(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_comment_id_fkey";

alter table "public"."notifications" add constraint "notifications_owner_user_id_fkey" FOREIGN KEY (owner_user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_owner_user_id_fkey";

alter table "public"."notifications" add constraint "notifications_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_post_id_fkey";

alter table "public"."notifications" add constraint "notifications_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_profile_id_fkey";

alter table "public"."posts" add constraint "posts_community_id_fkey" FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL not valid;

alter table "public"."posts" validate constraint "posts_community_id_fkey";

alter table "public"."posts" add constraint "posts_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES posts(id) ON DELETE CASCADE not valid;

alter table "public"."posts" validate constraint "posts_parent_id_fkey";

alter table "public"."posts" add constraint "posts_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."posts" validate constraint "posts_profile_id_fkey";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."reposts" add constraint "reposts_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE not valid;

alter table "public"."reposts" validate constraint "reposts_post_id_fkey";

alter table "public"."reposts" add constraint "reposts_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."reposts" validate constraint "reposts_profile_id_fkey";

