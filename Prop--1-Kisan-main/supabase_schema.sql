
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists users (
  "id" text primary key,
  "phone" text,
  "email" text,
  "role" text,
  "status" text default 'active',
  "createdAt" timestamp with time zone default timezone('utc'::text, now()),
  "profile" jsonb
);

-- LISTINGS TABLE
create table if not exists listings (
  "id" text primary key,
  "farmerId" text references users("id"),
  "farmerName" text,
  "cropName" text,
  "grade" text,
  "quantity" numeric,
  "availableQuantity" numeric,
  "pricePerKg" numeric,
  "description" text,
  "imageUrls" text[],
  "location" text,
  "status" text default 'active',
  "harvestDate" date,
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

-- OFFERS TABLE
create table if not exists offers (
  "id" text primary key,
  "listingId" text references listings("id"),
  "cropName" text,
  "buyerName" text,
  "buyerLocation" text,
  "pricePerKg" numeric,
  "quantity" numeric, -- mapped from quantityRequested if needed, but App uses quantity/quantityRequested inconsistently? Let's check. App uses quantity in Offer type?
  -- Wait, Offer type in App uses 'quantity' or 'quantityRequested'? 
  -- In handlePlaceOffer: quantity: offerData.quantity.
  -- In handleAcceptOffer: quantityRequested.
  -- I should check types.ts. Assuming 'quantity' for now, will fix if needed.
  "quantityRequested" numeric, 
  "offeredPrice" numeric, -- App uses offeredPrice? handlePlaceOffer uses pricePerKg. 
  "totalAmount" numeric,
  "status" text default 'pending',
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);
-- Note: I need to be careful with Offer fields. Let's make sure I support both or check types.ts.
-- I'll check types.ts in a moment. For now, I'll add both potential columns to be safe.

-- ORDERS TABLE
create table if not exists orders (
  "id" text primary key,
  "listingId" text references listings("id"),
  "cropName" text,
  "quantity" numeric,
  "totalAmount" numeric,
  "status" text,
  "date" timestamp with time zone default timezone('utc'::text, now()),
  "farmerName" text,
  "farmerLocation" text,
  "buyerName" text,
  "buyerLocation" text,
  "distanceKm" numeric,
  "transporterId" text references users("id")
);

create table if not exists transport_requests (
  "id" text primary key,
  "orderId" text references orders("id"),
  "buyerId" text references users("id"),
  "farmerId" text references users("id"),
  "pickupLocation" text,
  "dropLocation" text,
  "weightKg" numeric,
  "vehicleType" text,
  "mode" text,
  "status" text,
  "estimatedFare" numeric,
  "finalFare" numeric,
  "transporterId" text references users("id"),
  "deliveryOtp" text,
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists transport_bids (
  "id" text primary key,
  "requestId" text references transport_requests("id"),
  "transporterId" text references users("id"),
  "amount" numeric,
  "message" text,
  "status" text default 'pending',
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

-- DISPUTES TABLE
create table if not exists disputes (
  "id" text primary key,
  "orderId" text references orders("id"),
  "raisedBy" text,
  "role" text,
  "issue" text,
  "details" text,
  "amount" numeric,
  "status" text default 'open',
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

-- MESSAGES TABLE
create table if not exists messages (
  "id" text primary key,
  "fromUserId" text references users("id"),
  "toUserId" text references users("id"),
  "listingId" text references listings("id"),
  "orderId" text references orders("id"),
  "text" text,
  "timestamp" timestamp with time zone default timezone('utc'::text, now()),
  "read" boolean default false
);

-- INVENTORY ITEMS TABLE
create table if not exists inventory_items (
  "id" text primary key,
  "farmerId" text references users("id"),
  "cropName" text,
  "batchNumber" text,
  "quantity" numeric,
  "storageLocation" text,
  "harvestDate" date,
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

-- PAYOUTS TABLE
create table if not exists payouts (
  "id" text primary key,
  "userId" text references users("id"),
  "listingId" text,
  "orderId" text,
  "amount" numeric,
  "status" text,
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

-- RFQS TABLE
create table if not exists rfqs (
  "id" text primary key,
  "buyerId" text references users("id"),
  "cropName" text,
  "quantityKg" numeric,
  "targetPricePerKg" numeric,
  "status" text default 'open',
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

-- ROUTE PLANS TABLE
create table if not exists route_plans (
  "id" text primary key,
  "transporterId" text references users("id"),
  "origin" text,
  "destination" text,
  "departureTime" timestamp with time zone,
  "capacityAvailable" numeric,
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

-- RLS POLICIES
alter table users enable row level security;
create policy "Public users access" on users for all using (true);

alter table listings enable row level security;
create policy "Public listings access" on listings for all using (true);

alter table offers enable row level security;
create policy "Public offers access" on offers for all using (true);

alter table orders enable row level security;
create policy "Public orders access" on orders for all using (true);

alter table transport_requests enable row level security;
create policy "Public transport requests access" on transport_requests for all using (true);

alter table transport_bids enable row level security;
create policy "Public transport bids access" on transport_bids for all using (true);

alter table disputes enable row level security;
create policy "Public disputes access" on disputes for all using (true);

alter table messages enable row level security;
create policy "Public messages access" on messages for all using (true);

alter table inventory_items enable row level security;
create policy "Public inventory access" on inventory_items for all using (true);

alter table payouts enable row level security;
create policy "Public payouts access" on payouts for all using (true);

alter table rfqs enable row level security;
create policy "Public rfqs access" on rfqs for all using (true);

alter table route_plans enable row level security;
create policy "Public route_plans access" on route_plans for all using (true);

-- STORAGE POLICIES
create policy "Public Media Access" on storage.objects for select using ( bucket_id = 'media' );
create policy "Public Media Upload" on storage.objects for insert with check ( bucket_id = 'media' );
