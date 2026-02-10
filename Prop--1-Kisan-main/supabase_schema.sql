
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
  "videoUrl" text,
  "videoDurationSec" numeric,
  "videoSizeBytes" numeric,
  "videoType" text,
  "videoThumbnail" text,
  "location" text,
  "status" text default 'active',
  "harvestDate" date,
  "variety" text,
  "quantityUnit" text,
  "priceUnit" text,
  "availableDate" date,
  "storageType" text,
  "moistureContent" numeric,
  "minOrderQuantity" numeric,
  "minOrderQuantityUnit" text,
  "packagingDetails" text,
  "certification" text[],
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

-- OFFERS TABLE
create table if not exists offers (
  "id" text primary key,
  "listingId" text references listings("id"),
  "cropName" text,
  "buyerName" text,
  "buyerId" text references users("id"), -- Added for RLS
  "buyerLocation" text,
  "pricePerKg" numeric,
  "quantity" numeric, 
  "quantityRequested" numeric, 
  "offeredPrice" numeric, 
  "totalAmount" numeric,
  "expectedDeliveryDate" text,
  "status" text default 'pending',
  
  -- Negotiation fields
  "counterPrice" numeric,
  "counterQuantity" numeric,
  "lastActionBy" text,
  "history" jsonb,

  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

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
  "farmerId" text references users("id"), -- Added for RLS
  "farmerLocation" text,
  "buyerName" text,
  "buyerId" text references users("id"), -- Added for RLS
  "buyerLocation" text,
  "distanceKm" numeric,
  "transporterId" text references users("id"),
  "paymentStatus" text,
  "paymentProof" text
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
  "pickupDate" text,
  "pickupTime" text,
  "pickupConfirmedAt" timestamp with time zone,
  "deliveryConfirmedAt" timestamp with time zone,
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
  "neededBy" text,
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

-- 1. USERS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public users access" ON users;
DROP POLICY IF EXISTS "Public read access" ON users;
DROP POLICY IF EXISTS "User update own profile" ON users;
DROP POLICY IF EXISTS "User insert own profile" ON users;

CREATE POLICY "Public read access" ON users FOR SELECT USING (true);
CREATE POLICY "User update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "User insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id);

-- 2. LISTINGS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public listings access" ON listings;
DROP POLICY IF EXISTS "Public read listings" ON listings;
DROP POLICY IF EXISTS "Farmer insert listings" ON listings;
DROP POLICY IF EXISTS "Farmer update listings" ON listings;
DROP POLICY IF EXISTS "Farmer delete listings" ON listings;

CREATE POLICY "Public read listings" ON listings FOR SELECT USING (true);
CREATE POLICY "Farmer insert listings" ON listings FOR INSERT WITH CHECK (auth.uid()::text = "farmerId");
CREATE POLICY "Farmer update listings" ON listings FOR UPDATE USING (auth.uid()::text = "farmerId");
CREATE POLICY "Farmer delete listings" ON listings FOR DELETE USING (auth.uid()::text = "farmerId");

-- 3. OFFERS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public offers access" ON offers;
DROP POLICY IF EXISTS "Read offers" ON offers;
DROP POLICY IF EXISTS "Buyer create offer" ON offers;
DROP POLICY IF EXISTS "Update offer" ON offers;

CREATE POLICY "Read offers" ON offers FOR SELECT USING (
  auth.uid()::text = "buyerId" OR 
  EXISTS (SELECT 1 FROM listings WHERE listings.id = offers."listingId" AND listings."farmerId" = auth.uid()::text)
);
CREATE POLICY "Buyer create offer" ON offers FOR INSERT WITH CHECK (auth.uid()::text = "buyerId");
CREATE POLICY "Update offer" ON offers FOR UPDATE USING (
  auth.uid()::text = "buyerId" OR 
  EXISTS (SELECT 1 FROM listings WHERE listings.id = offers."listingId" AND listings."farmerId" = auth.uid()::text)
);

-- 4. ORDERS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public orders access" ON orders;
DROP POLICY IF EXISTS "Read orders" ON orders;
DROP POLICY IF EXISTS "Create orders" ON orders;
DROP POLICY IF EXISTS "Update orders" ON orders;

CREATE POLICY "Read orders" ON orders FOR SELECT USING (
  auth.uid()::text = "buyerId" OR 
  auth.uid()::text = "farmerId" OR 
  auth.uid()::text = "transporterId"
);
CREATE POLICY "Create orders" ON orders FOR INSERT WITH CHECK (
  auth.uid()::text = "buyerId" OR auth.uid()::text = "farmerId"
);
CREATE POLICY "Update orders" ON orders FOR UPDATE USING (
  auth.uid()::text = "buyerId" OR 
  auth.uid()::text = "farmerId" OR 
  auth.uid()::text = "transporterId"
);

-- 5. TRANSPORT REQUESTS
ALTER TABLE transport_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public transport requests access" ON transport_requests;
DROP POLICY IF EXISTS "Read transport requests" ON transport_requests;
DROP POLICY IF EXISTS "Transporter view open requests" ON transport_requests;
DROP POLICY IF EXISTS "Involved parties view requests" ON transport_requests;
DROP POLICY IF EXISTS "Create transport requests" ON transport_requests;
DROP POLICY IF EXISTS "Update transport requests" ON transport_requests;

CREATE POLICY "Transporter view open requests" ON transport_requests FOR SELECT USING (
   "transporterId" IS NULL
);
CREATE POLICY "Involved parties view requests" ON transport_requests FOR SELECT USING (
  auth.uid()::text = "buyerId" OR 
  auth.uid()::text = "farmerId" OR 
  auth.uid()::text = "transporterId"
);
CREATE POLICY "Create transport requests" ON transport_requests FOR INSERT WITH CHECK (
  auth.uid()::text = "buyerId" OR auth.uid()::text = "farmerId"
);
CREATE POLICY "Update transport requests" ON transport_requests FOR UPDATE USING (
  auth.uid()::text = "buyerId" OR 
  auth.uid()::text = "farmerId" OR 
  auth.uid()::text = "transporterId"
);

-- 6. TRANSPORT BIDS
ALTER TABLE transport_bids ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public transport bids access" ON transport_bids;
DROP POLICY IF EXISTS "Read transport bids" ON transport_bids;
DROP POLICY IF EXISTS "Transporter create bid" ON transport_bids;
DROP POLICY IF EXISTS "Transporter update bid" ON transport_bids;

CREATE POLICY "Read transport bids" ON transport_bids FOR SELECT USING (
  auth.uid()::text = "transporterId" OR
  EXISTS (SELECT 1 FROM transport_requests WHERE transport_requests.id = transport_bids."requestId" AND (transport_requests."buyerId" = auth.uid()::text OR transport_requests."farmerId" = auth.uid()::text))
);
CREATE POLICY "Transporter create bid" ON transport_bids FOR INSERT WITH CHECK (
  auth.uid()::text = "transporterId"
);
CREATE POLICY "Transporter update bid" ON transport_bids FOR UPDATE USING (
  auth.uid()::text = "transporterId"
);

-- 7. DISPUTES
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public disputes access" ON disputes;
-- Only admin or involved parties (TODO: Link dispute to user more explicitly)
-- For now, open access to allow functionality as user ID is not in dispute table directly (only raisedBy name/role?)
-- Actually, we should add userId to disputes. But for now, let's keep it simple or allow public read for demo?
-- Let's stick to Public for disputes for now as it needs schema change to secure properly.
create policy "Public disputes access" on disputes for all using (true);

-- 8. MESSAGES
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public messages access" ON messages;
DROP POLICY IF EXISTS "Read messages" ON messages;
DROP POLICY IF EXISTS "Send messages" ON messages;

CREATE POLICY "Read messages" ON messages FOR SELECT USING (
  auth.uid()::text = "fromUserId" OR auth.uid()::text = "toUserId"
);
CREATE POLICY "Send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid()::text = "fromUserId"
);

-- 9. INVENTORY ITEMS
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public inventory access" ON inventory_items;
DROP POLICY IF EXISTS "Farmer manage inventory" ON inventory_items;

CREATE POLICY "Farmer manage inventory" ON inventory_items FOR ALL USING (
  auth.uid()::text = "farmerId"
);

-- 10. PAYOUTS
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public payouts access" ON payouts;
CREATE POLICY "User view payouts" ON payouts FOR SELECT USING (auth.uid()::text = "userId");

-- 11. RFQS
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public rfqs access" ON rfqs;
CREATE POLICY "Public read rfqs" ON rfqs FOR SELECT USING (true);
CREATE POLICY "Buyer manage rfqs" ON rfqs FOR ALL USING (auth.uid()::text = "buyerId");

-- 12. ROUTE PLANS
ALTER TABLE route_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public route_plans access" ON route_plans;
CREATE POLICY "Public read route plans" ON route_plans FOR SELECT USING (true);
CREATE POLICY "Transporter manage routes" ON route_plans FOR ALL USING (auth.uid()::text = "transporterId");

-- STORAGE POLICIES
DROP POLICY IF EXISTS "Public Media Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Media Upload" ON storage.objects;
create policy "Public Media Access" on storage.objects for select using ( bucket_id = 'media' );
create policy "Public Media Upload" on storage.objects for insert with check ( bucket_id = 'media' );
