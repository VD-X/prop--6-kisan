import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://ykvatttsnpjrwqfhhysu.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
  console.error(
    "Missing VITE_SUPABASE_ANON_KEY in environment. Set it before running."
  );
  process.exit(1);
}

function assertOk(label, value) {
  if (!value) throw new Error(`${label} failed`);
  return value;
}

async function signUpOrSignIn(email, password) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const signUp = await supabase.auth.signUp({ email, password });
  if (signUp.error && signUp.error.message?.toLowerCase().includes("already")) {
    const signIn = await supabase.auth.signInWithPassword({ email, password });
    if (signIn.error) throw signIn.error;
    return { supabase, user: signIn.data.user, session: signIn.data.session };
  }
  if (signUp.error) throw signUp.error;
  if (!signUp.data.session) {
    throw new Error(
      "Signup succeeded but no session was returned. Disable email confirmation (Auth settings) or use a confirmed test email."
    );
  }
  return { supabase, user: signUp.data.user, session: signUp.data.session };
}

async function main() {
  const ts = Date.now();
  const password = `Passw0rd!${ts}`;

  const farmerEmail = `farmer.${ts}@gmail.com`;
  const buyerEmail = `buyer.${ts}@gmail.com`;
  const transporterEmail = `transporter.${ts}@gmail.com`;

  const farmer = await signUpOrSignIn(farmerEmail, password);
  const buyer = await signUpOrSignIn(buyerEmail, password);
  const transporter = await signUpOrSignIn(transporterEmail, password);

  const farmerId = assertOk("farmer user", farmer.user)?.id;
  const buyerId = assertOk("buyer user", buyer.user)?.id;
  const transporterId = assertOk("transporter user", transporter.user)?.id;

  const userUpserts = await Promise.all([
    farmer.supabase.from("users").upsert({
      id: farmerId,
      email: farmerEmail,
      role: "farmer",
      status: "active",
      profile: { fullName: "E2E Farmer" },
    }),
    buyer.supabase.from("users").upsert({
      id: buyerId,
      email: buyerEmail,
      role: "buyer",
      status: "active",
      profile: { fullName: "E2E Buyer" },
    }),
    transporter.supabase.from("users").upsert({
      id: transporterId,
      email: transporterEmail,
      role: "transporter",
      status: "active",
      profile: { fullName: "E2E Transporter" },
    }),
  ]);
  for (const r of userUpserts) if (r.error) throw r.error;

  const listingId = `lst_${ts}`;
  const listingInsert = await farmer.supabase
    .from("listings")
    .insert({
      id: listingId,
      farmerId,
      farmerName: "E2E Farmer",
      cropName: "Wheat",
      grade: "A",
      quantity: 1000,
      availableQuantity: 1000,
      pricePerKg: 25,
      description: "E2E listing",
      imageUrls: [],
      location: "Bhopal, MP",
      status: "active",
      harvestDate: new Date().toISOString().slice(0, 10),
    })
    .select()
    .single();
  if (listingInsert.error) throw listingInsert.error;

  const offerId = `off_${ts}`;
  const offerInsert = await buyer.supabase
    .from("offers")
    .insert({
      id: offerId,
      listingId,
      cropName: "Wheat",
      buyerName: "E2E Buyer",
      buyerId,
      buyerLocation: "Indore, MP",
      pricePerKg: 25,
      quantityRequested: 100,
      offeredPrice: 24,
      totalAmount: 2400,
      status: "pending",
      lastActionBy: "buyer",
      history: [],
    })
    .select()
    .single();
  if (offerInsert.error) throw offerInsert.error;

  const orderId = `ord_${ts}`;
  const orderInsert = await farmer.supabase
    .from("orders")
    .insert({
      id: orderId,
      listingId,
      cropName: "Wheat",
      quantity: 100,
      totalAmount: 2400,
      status: "confirmed",
      paymentStatus: "pending",
      farmerName: "E2E Farmer",
      farmerId,
      farmerLocation: "Bhopal, MP",
      buyerName: "E2E Buyer",
      buyerId,
      buyerLocation: "Indore, MP",
      distanceKm: 200,
    })
    .select()
    .single();
  if (orderInsert.error) throw orderInsert.error;

  const requestId = `tr_${ts}`;
  const trInsert = await farmer.supabase
    .from("transport_requests")
    .insert({
      id: requestId,
      orderId,
      buyerId,
      farmerId,
      pickupLocation: "Bhopal, MP",
      dropLocation: "Indore, MP",
      weightKg: 100,
      vehicleType: "Truck",
      mode: "market",
      status: "open",
      estimatedFare: 5000,
    })
    .select()
    .single();
  if (trInsert.error) throw trInsert.error;

  const bidId = `tb_${ts}`;
  const bidInsert = await transporter.supabase
    .from("transport_bids")
    .insert({
      id: bidId,
      requestId,
      transporterId,
      amount: 4500,
      message: "E2E bid",
      status: "pending",
    })
    .select()
    .single();
  if (bidInsert.error) throw bidInsert.error;

  const bidAccept = await farmer.supabase
    .from("transport_bids")
    .update({ status: "accepted" })
    .eq("id", bidId)
    .select()
    .single();
  if (bidAccept.error) throw bidAccept.error;

  const trAssign = await farmer.supabase
    .from("transport_requests")
    .update({ status: "assigned", transporterId, finalFare: 4500 })
    .eq("id", requestId)
    .select()
    .single();
  if (trAssign.error) throw trAssign.error;

  const messageId = `msg_${ts}`;
  const msgInsert = await buyer.supabase
    .from("messages")
    .insert({
      id: messageId,
      fromUserId: buyerId,
      toUserId: farmerId,
      listingId,
      orderId,
      text: "E2E message",
    })
    .select()
    .single();
  if (msgInsert.error) throw msgInsert.error;

  const buyerMessages = await buyer.supabase
    .from("messages")
    .select("id")
    .eq("orderId", orderId);
  if (buyerMessages.error) throw buyerMessages.error;

  console.log("E2E OK:", {
    farmerEmail,
    buyerEmail,
    transporterEmail,
    listingId,
    offerId,
    orderId,
    requestId,
    bidId,
    messageId,
    buyerMessageCount: buyerMessages.data.length,
  });
}

main().catch((e) => {
  console.error("E2E FAILED:", e);
  process.exit(1);
});
