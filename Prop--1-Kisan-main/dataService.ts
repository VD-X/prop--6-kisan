import { getSupabase, getSupabaseConfig } from './supabaseClient'

// --- GETTERS ---

const DEMO_SESSION_KEY = 'kisansetu_demo_session_v1'

function canUseBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function getDemoSession(): { userId: string } | null {
  if (!canUseBrowserStorage()) return null
  const raw = window.localStorage.getItem(DEMO_SESSION_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.userId === 'string') return { userId: parsed.userId }
    return null
  } catch {
    return null
  }
}

function setDemoSession(userId: string) {
  if (!canUseBrowserStorage()) return
  window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ userId }))
}

function clearDemoSession() {
  if (!canUseBrowserStorage()) return
  window.localStorage.removeItem(DEMO_SESSION_KEY)
}

async function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function randomHex(bytes = 16) {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function sha256Hex(text: string) {
  const enc = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', enc)
  return toHex(digest)
}

export async function registerWithPhonePassword(phone: string, password: string, seed?: { role?: string, email?: string | null }) {
  const c = getSupabase(); if (!c) return { error: 'Supabase not configured' }
  if (!phone || !password) return { error: 'Missing phone or password' }
  if (password.length < 6) return { error: 'Password must be at least 6 characters' }

  const existing = await c.from('users').select('id').eq('phone', phone).maybeSingle()
  if (existing.error) return { error: existing.error }
  if (existing.data?.id) return { error: { message: 'User already exists', code: 'user_already_exists' } }

  const id = crypto.randomUUID()
  const passwordSalt = randomHex(16)
  const passwordHash = await sha256Hex(`${passwordSalt}:${password}`)

  const userRow: any = {
    id,
    phone,
    email: seed?.email ?? null,
    role: seed?.role ?? null,
    status: 'active',
    profile: null,
    createdAt: new Date().toISOString(),
    passwordSalt,
    passwordHash
  }

  const { data, error } = await c.from('users').insert(userRow).select('*').single()
  if (error) return { error }
  setDemoSession(id)
  const { passwordHash: _ph, passwordSalt: _ps, ...safe } = data as any
  return { data: safe }
}

export async function loginWithPhonePassword(phone: string, password: string) {
  const c = getSupabase(); if (!c) return { error: 'Supabase not configured' }
  if (!phone || !password) return { error: 'Missing phone or password' }

  const { data, error } = await c.from('users').select('*').eq('phone', phone).maybeSingle()
  if (error) return { error }
  if (!data) return { error: { message: 'Invalid login credentials', code: 'invalid_credentials' } }

  const storedSalt = (data as any).passwordSalt
  const storedHash = (data as any).passwordHash
  if (!storedSalt || !storedHash) {
    return { error: { message: 'Password login not enabled for this user', code: 'password_not_set' } }
  }

  const computed = await sha256Hex(`${storedSalt}:${password}`)
  if (computed !== storedHash) return { error: { message: 'Invalid login credentials', code: 'invalid_credentials' } }

  setDemoSession((data as any).id)
  const { passwordHash: _ph, passwordSalt: _ps, ...safe } = data as any
  return { data: safe }
}

export async function getUsers() {
  const c = getSupabase(); if (!c) return []
  const { data, error } = await c.from('users').select('*')
  if (error) { console.error('getUsers error', error); return [] }
  return data
}

export async function getUserById(id: string) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('users').select('*').eq('id', id).maybeSingle()
  if (error) { console.error('getUserById error', error); return null }
  return data || null
}

export async function checkSupabaseConnectivity(timeoutMs = 8000) {
  const cfg = getSupabaseConfig()
  if (!cfg) {
    return { auth: { ok: false }, rest: { ok: false }, note: 'supabase_not_configured' }
  }

  const fetchWithTimeout = async (url: string, init: RequestInit) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, { ...init, signal: controller.signal })
      const text = await res.text().catch(() => '')
      return { ok: true, status: res.status, text }
    } catch (e: any) {
      const name = e?.name || 'Error'
      const message = e?.message || 'unknown_error'
      return { ok: false, error: `${name}: ${message}` }
    } finally {
      clearTimeout(timer)
    }
  }

  const auth = await fetchWithTimeout(`${cfg.url}/auth/v1/health`, {
    method: 'GET',
    headers: { apikey: cfg.anonKey }
  })

  const rest = await fetchWithTimeout(`${cfg.url}/rest/v1/users?select=id&limit=1`, {
    method: 'GET',
    headers: { apikey: cfg.anonKey, Authorization: `Bearer ${cfg.anonKey}` }
  })

  const authOk = auth.ok && typeof (auth as any).status === 'number'
  const restOk = rest.ok && typeof (rest as any).status === 'number'

  return {
    auth: authOk ? { ok: true, status: (auth as any).status } : { ok: false, error: (auth as any).error },
    rest: restOk ? { ok: true, status: (rest as any).status } : { ok: false, error: (rest as any).error }
  }
}

export async function signInWithOtp(phone: string) {
  const c = getSupabase(); if (!c) return { error: 'Supabase not configured' }
  const { data, error } = await c.auth.signInWithOtp({
    phone: phone
  })
  if (error) { console.error('signInWithOtp error', error); return { error } }
  return { data }
}

export async function signInWithEmailOtp(email: string) {
  const c = getSupabase(); if (!c) return { error: 'Supabase not configured' }
  const { data, error } = await c.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: window.location.origin
    }
  })
  if (error) { console.error('signInWithEmailOtp error', error); return { error } }
  return { data }
}

export async function verifyEmailOtp(email: string, token: string) {
  const c = getSupabase(); if (!c) return { error: 'Supabase not configured' }
  const { data, error } = await c.auth.verifyOtp({
    email,
    token,
    type: 'email'
  })
  if (error) { console.error('verifyEmailOtp error', error); return { error } }
  return { data }
}

export async function updateUserPassword(password: string) {
  const c = getSupabase(); if (!c) return { error: 'Supabase not configured' }
  const { data, error } = await c.auth.updateUser({
    password
  })
  if (error) { console.error('updateUserPassword error', error); return { error } }
  return { data }
}

export async function signUpWithPassword(email: string, password: string, options?: any) {
  const c = getSupabase(); if (!c) return { error: 'Supabase not configured' }
  const { data, error } = await c.auth.signUp({
    email,
    password,
    options: {
        ...options,
        emailRedirectTo: window.location.origin
    }
  })
  if (error) { console.error('signUpWithPassword error', error); return { error } }
  return { data }
}

export async function signInWithPassword(email: string, password: string) {
  const c = getSupabase(); if (!c) return { error: 'Supabase not configured' }
  const { data, error } = await c.auth.signInWithPassword({
    email,
    password
  })
  if (error) { console.error('signInWithPassword error', error); return { error } }
  return { data }
}

export async function verifyOtp(phone: string, token: string) {
  const c = getSupabase(); if (!c) return { error: 'Supabase not configured' }
  const { data, error } = await c.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  })
  if (error) { console.error('verifyOtp error', error); return { error } }
  return { data }
}

export async function getCurrentUser() {
  const c = getSupabase(); if (!c) return null
  const session = getDemoSession()
  const userId = session?.userId
  if (!userId) return null

  const { data, error } = await c.from('users').select('*').eq('id', userId).maybeSingle()
  if (error) {
    console.error('getCurrentUser error', error)
    return null
  }
  if (!data) return null
  const { passwordHash: _ph, passwordSalt: _ps, ...safe } = data as any
  return safe || null
}

export async function signOut() {
  clearDemoSession()
}

// Deprecated: loginUser (kept for fallback reference if needed, but we should switch to OTP)
export async function loginUser(phone: string) {
  return signInWithOtp(phone)
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
  const { data, error } = await c.from('users').upsert(userData, { onConflict: 'id' }).select().single()
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
    videoUrl: payload.videoUrl,
    videoDurationSec: payload.videoDurationSec,
    videoSizeBytes: payload.videoSizeBytes,
    videoType: payload.videoType,
    videoThumbnail: payload.videoThumbnail,
    location: payload.location,
    status: payload.status,
    harvestDate: payload.harvestDate,
    variety: payload.variety,
    quantityUnit: payload.quantityUnit,
    priceUnit: payload.priceUnit,
    availableDate: payload.availableDate,
    storageType: payload.storageType,
    moistureContent: payload.moistureContent,
    minOrderQuantity: payload.minOrderQuantity,
    minOrderQuantityUnit: payload.minOrderQuantityUnit,
    packagingDetails: payload.packagingDetails,
    certification: payload.certification,
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
    videoUrl: payload.videoUrl,
    videoDurationSec: payload.videoDurationSec,
    videoSizeBytes: payload.videoSizeBytes,
    videoType: payload.videoType,
    videoThumbnail: payload.videoThumbnail,
    location: payload.location,
    status: payload.status,
    harvestDate: payload.harvestDate,
    variety: payload.variety,
    quantityUnit: payload.quantityUnit,
    priceUnit: payload.priceUnit,
    availableDate: payload.availableDate,
    storageType: payload.storageType,
    moistureContent: payload.moistureContent,
    minOrderQuantity: payload.minOrderQuantity,
    minOrderQuantityUnit: payload.minOrderQuantityUnit,
    packagingDetails: payload.packagingDetails,
    certification: payload.certification,
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
    buyerId: payload.buyerId, // Added for RLS
    buyerLocation: payload.buyerLocation,
    pricePerKg: payload.pricePerKg,
    quantity: payload.quantity,
    quantityRequested: payload.quantityRequested,
    offeredPrice: payload.offeredPrice,
    totalAmount: payload.totalAmount,
    expectedDeliveryDate: payload.expectedDeliveryDate,
    status: payload.status,
    lastActionBy: payload.lastActionBy,
    history: payload.history,
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

export async function updateOffer(id: string, updates: any) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const { data, error } = await c.from('offers').update(updates).eq('id', id).select().single()
  if (error) { console.error('updateOffer error', error); throw error }
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
    farmerId: payload.farmerId, // Added for RLS
    farmerLocation: payload.farmerLocation,
    buyerName: payload.buyerName,
    buyerId: payload.buyerId, // Added for RLS
    buyerLocation: payload.buyerLocation,
    distanceKm: payload.distanceKm,
    transporterId: payload.transporterId,
    paymentStatus: payload.paymentStatus, // <--- Added
    paymentProof: payload.paymentProof    // <--- Added
  }
  console.log("Creating order with payload:", orderData);
  const { data, error } = await c.from('orders').insert(orderData).select().single()
  if (error) { console.error('createOrder error', error); throw error }
  return data
}

export async function updateOrderPayment(id: string, paymentStatus: string, paymentProof?: string) {
  const c = getSupabase(); if (!c) throw new Error('Supabase not configured')
  const { data, error } = await c.from('orders').update({ paymentStatus, paymentProof }).eq('id', id).select().single()
  if (error) { console.error('updateOrderPayment error', error); throw error }
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
  console.log(`[DataService] Updating profile for ${userId}:`, profile);
  const { data, error } = await c.from('users').upsert({ id: userId, profile }).select().single()
  if (error) { console.error('updateUserProfile error', error); throw error }
  console.log('[DataService] Update success:', data);
  return data
}

export async function addInventoryItem(payload: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('inventory_items').insert(payload).select().single()
  if (error) { console.error('addInventoryItem error', error); throw error }
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
  if (error) { console.error('addPayout error', error); throw error }
  return data
}

export async function addRfq(payload: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('rfqs').insert(payload).select().single()
  if (error) { console.error('addRfq error', error); throw error }
  return data
}

export async function addRoutePlan(payload: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('route_plans').insert(payload).select().single()
  if (error) { console.error('addRoutePlan error', error); throw error }
  return data
}

export async function addTransportRequest(payload: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('transport_requests').insert(payload).select().single()
  if (error) { console.error('addTransportRequest error', error); throw error }
  return data
}

export async function updateTransportRequest(id: string, patch: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('transport_requests').update(patch).eq('id', id).select().single()
  if (error) { console.error('updateTransportRequest error', error); throw error }
  return data
}

export async function addTransportBid(payload: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('transport_bids').insert(payload).select().single()
  if (error) { console.error('addTransportBid error', error); throw error }
  return data
}

export async function setTransportBidStatus(id: string, status: string) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('transport_bids').update({ status }).eq('id', id).select().single()
  if (error) { console.error('setTransportBidStatus error', error); throw error }
  return data
}

export async function updateTransportBid(id: string, patch: any) {
  const c = getSupabase(); if (!c) return null
  const { data, error } = await c.from('transport_bids').update(patch).eq('id', id).select().single()
  if (error) { console.error('updateTransportBid error', error); throw error }
  return data
}
