export type UserRole = 'farmer' | 'buyer' | 'transporter' | 'admin' | null;

export interface Address {
  label?: string;
  line1: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  contactName?: string;
  phone?: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  listingId?: string;
  orderId?: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface InventoryItem {
  id: string;
  listingId: string;
  batchId: string;
  grade: 'A' | 'B' | 'C';
  quantityKg: number;
  storageLocation?: string;
  expiryDate?: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  userId: string;
  listingId?: string;
  orderId?: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  createdAt: string;
}

export interface RFQ {
  id: string;
  buyerId: string;
  cropName: string;
  quantityKg: number;
  targetPricePerKg: number;
  status: 'open' | 'closed';
  createdAt: string;
}

export interface RoutePlan {
  id: string;
  transporterId: string;
  orderId: string;
  stops: Array<{ name: string; eta: string }>;
  createdAt: string;
}

export interface FarmerProfile {
  fullName: string;
  village: string;
  district: string;
  state: string;
  language: string;
  // Extended Profile
  pincode?: string;
  totalLandArea?: string;
  landUnit?: 'Acres' | 'Hectares';
  landType?: 'Owned' | 'Leased' | 'Mixed';
  irrigationSource?: 'Rain-fed' | 'Borewell' | 'Canal' | 'Drip';
  soilType?: string;
  currentCrops?: string[];
  seasonalCrops?: {
    kharif?: string[];
    rabi?: string[];
    zaid?: string[];
  };
  farmingPractices?: string[]; // e.g. "Organic", "Natural"
  addresses?: Address[];
  // Trust Stats
  rating?: number;
  totalSales?: number;
  memberSince?: string;
}

export interface BuyerProfile {
  fullName: string;
  businessName?: string;
  city: string;
  state: string;
  pincode?: string;
  language: string;
  addresses?: Address[];
  // Business Info
  buyerType?: 'Wholesaler' | 'Retailer' | 'Exporter' | 'Processor' | 'Individual Trader';
  gstNumber?: string;
  yearsInBusiness?: number;
  // Procurement
  procurementRegions?: string[];
  preferredCrops?: string[];
  qualityPreference?: 'Standard' | 'Premium' | 'Organic';
  packagingPreference?: 'Loose' | 'Bags' | 'Boxes';
  // Capacity
  purchaseCapacity?: 'Small (≤ 1 ton)' | 'Medium (1–5 tons)' | 'Large (5+ tons)';
  purchaseFrequency?: 'Daily' | 'Weekly' | 'Seasonal';
  // Trust Stats
  rating?: number;
  completedDeals?: number;
  memberSince?: string;
}

export interface TransporterProfile {
  fullName: string;
  vehicleType: string; // 'Mini Truck' | 'Pickup' | 'Tractor' | 'Truck'
  maxCapacity: string; // kg
  vehicleNumber?: string;
  vehicleName?: string;
  numberPlatePhoto?: string;
  vehiclePhoto?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';

  // Personal
  language?: string;
  city?: string; // Base Location
  state?: string;

  // Routes & Area
  operatingRegions?: string[]; // Districts/States
  routeType?: 'Local' | 'Inter-district' | 'Inter-state';

  // Handling
  canHandlePerishables?: boolean;
  canHandleBulk?: boolean;
  isCoveredVehicle?: boolean;

  // Business Details
  businessName?: string;
  gstin?: string;
  pan?: string;

  // Bank Details
  bankDetails?: {
    accountNumber: string;
    ifsc: string;
    holderName: string;
    bankName: string;
  };

  // Documents
  documents?: {
    license?: { number: string; url?: string; status: 'verified' | 'pending' | 'rejected' };
    rc?: { number: string; url?: string; status: 'verified' | 'pending' | 'rejected' };
    insurance?: { number: string; url?: string; status: 'verified' | 'pending' | 'rejected' };
  };

  // Availability
  availability?: 'Full-time' | 'Part-time';
  preferredJobType?: 'Short distance' | 'Long haul';

  // Trust Stats
  rating?: number;
  totalDeliveries?: number;
  onTimeDeliveryRate?: number; // Percentage
  memberSince?: string;
}

export interface User {
  id: string;
  phone: string;
  email?: string;
  role: UserRole;
  status: 'active' | 'suspended';
  profile?: FarmerProfile | BuyerProfile | TransporterProfile;
  createdAt: string;
}

export type ListingStatus = 'active' | 'paused' | 'sold_out';

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  variety?: string;
  grade: 'A' | 'B' | 'C';
  quantity: number;
  quantityUnit?: 'kg' | 'quintal' | 'ton' | 'gram';
  availableQuantity: number;
  pricePerKg: number;
  priceUnit?: 'per_kg' | 'per_quintal' | 'per_ton' | 'per_gram';
  description: string;
  imageUrls: string[];
  videoUrl?: string;
  videoDurationSec?: number;
  videoSizeBytes?: number;
  videoType?: 'video/mp4' | 'video/webm';
  videoThumbnail?: string;
  location: string;
  status: ListingStatus;
  harvestDate?: string;
  createdAt: string;
  storageType?: 'Ambient' | 'Cold Storage' | 'Hermetic Bag' | 'Open Sacks';
  certification?: string[];
  minOrderQuantity?: number;
  minOrderQuantityUnit?: 'kg' | 'quintal' | 'ton' | 'gram';
  availableDate?: string;
  minOrderQuantity?: number;
  packagingDetails?: string;
  moistureContent?: number;
}

export interface Offer {
  id: string;
  listingId: string;
  cropName: string;
  buyerName: string;
  buyerBusiness?: string;
  buyerLocation: string;
  offeredPrice: number;
  quantityRequested: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export type OrderStatus = 'confirmed' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  listingId: string;
  cropName: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  date: string;

  // Logistics
  farmerName: string;
  farmerLocation: string;
  buyerName: string;
  buyerLocation: string;
  transporterId?: string;
  distanceKm?: number; // Simulated
}

export type TransportMode = 'farmer_arranged' | 'marketplace' | 'buyer_own';
export type TransportRequestStatus = 'draft' | 'open' | 'awaiting_farmer' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
export type TransportBidStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface TransportRequest {
  id: string;
  orderId: string;
  buyerId: string;
  farmerId: string;
  pickupLocation: string;
  dropLocation: string;
  weightKg: number;
  vehicleType: 'Bike' | 'Auto' | 'Mini Truck' | 'Pickup' | 'Truck';
  mode: TransportMode;
  status: TransportRequestStatus;
  estimatedFare: number;
  finalFare?: number;
  transporterId?: string;
  deliveryOtp?: string;
  createdAt: string;
}

export interface TransportBid {
  id: string;
  requestId: string;
  transporterId: string;
  amount: number;
  message?: string;
  status: TransportBidStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'sale' | 'purchase' | 'delivery';
  itemName: string; // Crop Name or Route
  counterpartyName: string; // Buyer/Farmer Name
  amount: number; // Price or Earnings
  quantity?: number;
  status: 'completed' | 'cancelled' | 'disputed';
  rating?: number;
}

export interface Dispute {
  id: string;
  orderId: string;
  raisedBy: string; // User Name
  role: UserRole;
  issue: string;
  details?: string; // Detailed description of the issue
  amount?: number; // Dispute amount involved
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface SystemConfig {
  offerExpiryHours: number;
  maxListingsPerFarmer: number;
  maxActiveJobsPerTransporter: number;
  platformFeePercent: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AiAnalysisResult {
  cropName: string;
  grade: 'A' | 'B' | 'C';
  estimatedPrice: number;
  qualityDescription: string;
  confidence: number;
}
