import { getSupabase } from './supabaseClient'

// --- GETTERS ---

export async function getUsers() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('users').select('*')
  if (error) { console.error('getUsers error', error); return [] }
  return data
}

export async function loginUser(phone: string) {
  const c = getSupabase(); if (!c) return null
  // Simple login: check if phone exists
  const { data, error } = await c.from('users').select('*').eq('phone', phone).single()
  if (error) { console.error('loginUser error', error); return null }
  return data
}

export async function getListings() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('listings').select('*').order('createdAt', { ascending: false })
  if (error) { console.error('getListings error', error); return [] }
  return data
}

export async function getOffers() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('offers').select('*').order('createdAt', { ascending: false })
  if (error) { console.error('getOffers error', error); return [] }
  return data
}

export async function getOrders() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('orders').select('*').order('date', { ascending: false })
  if (error) { console.error('getOrders error', error); return [] }
  return data
}

export async function getDisputes() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('disputes').select('*').order('createdAt', { ascending: false })
  if (error) { console.error('getDisputes error', error); return [] }
  return data
}

export async function getMessages() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('messages').select('*').order('timestamp', { ascending: true })
  if (error) { console.error('getMessages error', error); return [] }
  return data
}

export async function getInventoryItems() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('inventory_items').select('*').order('createdAt', { ascending: false })
  if (error) { console.error('getInventoryItems error', error); return [] }
  return data
}

export async function getPayouts() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('payouts').select('*').order('createdAt', { ascending: false })
  if (error) { console.error('getPayouts error', error); return [] }
  return data
}

export async function getRfqs() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('rfqs').select('*').order('createdAt', { ascending: false })
  if (error) { console.error('getRfqs error', error); return [] }
  return data
}

export async function getRoutePlans() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('route_plans').select('*').order('createdAt', { ascending: false })
  if (error) { console.error('getRoutePlans error', error); return [] }
  return data
}

export async function getTransportRequests() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('transport_requests').select('*').order('createdAt', { ascending: false })
  if (error) { console.error('getTransportRequests error', error); return [] }
  return data
}

export async function getTransportBids() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('transport_bids').select('*').order('createdAt', { ascending: false })
  if (error) { console.error('getTransportBids error', error); return [] }
  return data
}

// --- MUTATORS ---

export async function addUser(user: any) {
  const c = getSupabase(); if (!c) return null
  // Remove fields that are not in the database schema
  const { confirmPassword, password, ...userData } = user;
  const { data, error } = await c.from('users').insert(userData).select().single()
  if (error) { console.error('addUser error', error); return null }
  return data
}

export async function addListing(payload: any) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const listingData = {
    id: payload.id,
    farmerId: payload.farmerId,
    farmerName: payload.farmerName,
    cropName: payload.cropName,
    grade: payload.grade,
    quantity: payload.quantity,
    availableQuantity: payload.availableQuantity,
    pricePerKg: payload.pricePerKg,
    description: payload.description,
    imageUrls: payload.imageUrls,
    location: payload.location,
    status: payload.status,
    harvestDate: payload.harvestDate,
    createdAt: payload.createdAt
  }
  const { data, error } = await c.from('listings').insert(listingData).select().single()
  if (error) { console.error('addListing error', error); throw error }
  return data
}

export async function updateListing(payload: any) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const listingData = {
    id: payload.id,
    farmerId: payload.farmerId,
    farmerName: payload.farmerName,
    cropName: payload.cropName,
    grade: payload.grade,
    quantity: payload.quantity,
    availableQuantity: payload.availableQuantity,
    pricePerKg: payload.pricePerKg,
    description: payload.description,
    imageUrls: payload.imageUrls,
    location: payload.location,
    status: payload.status,
    harvestDate: payload.harvestDate,
    createdAt: payload.createdAt
  }
  const { data, error } = await c.from('listings').update(listingData).eq('id', payload.id).select().single()
  if (error) { console.error('updateListing error', error); throw error }
  return data
}

export async function updateListingStatus(id: string, status: string) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const { data, error } = await c.from('listings').update({ status }).eq('id', id).select().single()
  if (error) { console.error('updateListingStatus error', error); throw error }
  return data
}

export async function deleteListing(id: string) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const { error } = await c.from('listings').delete().eq('id', id)
  if (error) { console.error('deleteListing error', error); throw error }
  return true
}

export async function placeOffer(payload: any) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const offerData = {
    id: payload.id,
    listingId: payload.listingId,
    cropName: payload.cropName,
    buyerName: payload.buyerName,
    buyerLocation: payload.buyerLocation,
    pricePerKg: payload.pricePerKg,
    quantity: payload.quantity,
    quantityRequested: payload.quantityRequested,
    offeredPrice: payload.offeredPrice,
    totalAmount: payload.totalAmount,
    status: payload.status,
    createdAt: payload.createdAt
  }
  console.log("Placing offer with payload:", offerData);
  const { data, error } = await c.from('offers').insert(offerData).select().single()
  if (error) { console.error('placeOffer error', error); throw error }
  return data
}

export async function setOfferStatus(id: string, status: string) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const { data, error } = await c.from('offers').update({ status }).eq('id', id).select().single()
  if (error) { console.error('setOfferStatus error', error); throw error }
  return data
}

export async function createOrder(payload: any) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const orderData = {
    id: payload.id,
    listingId: payload.listingId,
    cropName: payload.cropName,
    quantity: payload.quantity,
    totalAmount: payload.totalAmount,
    status: payload.status,
    date: payload.date,
    farmerName: payload.farmerName,
    farmerLocation: payload.farmerLocation,
    buyerName: payload.buyerName,
    buyerLocation: payload.buyerLocation,
    distanceKm: payload.distanceKm,
    transporterId: payload.transporterId
  }
  console.log("Creating order with payload:", orderData);
  const { data, error } = await c.from('orders').insert(orderData).select().single()
  if (error) { console.error('createOrder error', error); throw error }
  return data
}

export async function setOrderStatus(id: string, status: string) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const { data, error } = await c.from('orders').update({ status }).eq('id', id).select().single()
  if (error) { console.error('setOrderStatus error', error); throw error }
  return data
}

export async function setOrderTransporter(id: string, transporterId: string) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const { data, error } = await c.from('orders').update({ transporterId }).eq('id', id).select().single()
  if (error) { console.error('setOrderTransporter error', error); throw error }
  return data
}

export async function addMessage(payload: any) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const { data, error } = await c.from('messages').insert(payload).select().single()
  if (error) { console.error('addMessage error', error); throw error }
  return data
}

export async function raiseDispute(payload: any) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const { data, error } = await c.from('disputes').insert(payload).select().single()
  if (error) { console.error('raiseDispute error', error); throw error }
  return data
}

export async function resolveDispute(id: string, status: string) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const { data, error } = await c.from('disputes').update({ status }).eq('id', id).select().single()
  if (error) { console.error('resolveDispute error', error); throw error }
  return data
}

export async function updateUserProfile(userId: string, profile: any) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const { data, error } = await c.from('users').update({ profile }).eq('id', userId).select().single()
  if (error) { console.error('updateUserProfile error', error); throw error }
  return data
}

export async function addInventoryItem(payload: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('inventory_items').insert(payload).select().single()
  if (error) console.error('addInventoryItem error', error)
  return data
}

export async function addPayout(payload: any) {
  const c = getSupabase(); if (!c) return null
  const payoutData = {
    id: payload.id,
    userId: payload.userId,
    listingId: payload.listingId,
    orderId: payload.orderId,
    amount: payload.amount,
    status: payload.status,
    createdAt: payload.createdAt
  }
  const { data, error } = await c.from('payouts').insert(payoutData).select().single()
  if (error) console.error('addPayout error', error)
  return data
}

export async function addRfq(payload: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('rfqs').insert(payload).select().single()
  if (error) console.error('addRfq error', error)
  return data
}

export async function addRoutePlan(payload: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('route_plans').insert(payload).select().single()
  if (error) console.error('addRoutePlan error', error)
  return data
}

export async function addTransportRequest(payload: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('transport_requests').insert(payload).select().single()
  if (error) console.error('addTransportRequest error', error)
  return data
}

export async function updateTransportRequest(id: string, patch: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('transport_requests').update(patch).eq('id', id).select().single()
  if (error) console.error('updateTransportRequest error', error)
  return data
}

export async function addTransportBid(payload: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('transport_bids').insert(payload).select().single()
  if (error) console.error('addTransportBid error', error)
  return data
}

export async function setTransportBidStatus(id: string, status: string) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('transport_bids').update({ status }).eq('id', id).select().single()
  if (error) console.error('setTransportBidStatus error', error)
  return data
}
