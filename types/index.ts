export type Role = 'buyer' | 'farmer' | 'coordinator' | 'driver' | 'admin' | 'finance';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string;
  authProvider: 'password' | 'google';
  emailVerified: boolean;
  businessName?: string;
  address?: string;
  farmName?: string;
  region?: string;
  vehicleLabel?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
  unit: string;
  stock: 'season' | 'limited' | 'low';
  farm: string;
  description: string;
  isFavorite: boolean;
  cartQty: number;
}

export interface CartItem {
  productId: number;
  name: string;
  img: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
}

export interface TrackingStep {
  label: string;
  time: string;
  done: boolean;
}

export interface TraceFarm {
  name: string;
  img: string;
}

export interface OrderDetail {
  id: string;
  orderCode: string;
  address: string;
  subtotal: number;
  logisticsFee: number;
  commission: number;
  total: number;
  deliveryDate: string;
  trackingStage: number;
  status: string;
  eta: string;
  items: CartItem[];
  trackingSteps: TrackingStep[];
  traceFarms: TraceFarm[];
}

export interface OrderSummary {
  id: string;
  orderCode: string;
  status: string;
  total: number;
  deliveryDate: string;
  trackingStage: number;
  createdAt: string;
}

export interface BuyerStats {
  totalOrders: number;
  favoriteCount: number;
  farmsSourced: number;
}

export interface Crop {
  key: string;
  name: string;
  img: string | null;
}

export interface HarvestLog {
  id: string;
  cropKey: string;
  cropName: string;
  img: string | null;
  qtyKg: number;
  expectedHarvestDate: string;
  status: 'awaiting' | 'collected';
  loggedAt: string;
}

export interface MarketPrice {
  name: string;
  img: string;
  price: number;
  trend: 'up' | 'down' | 'flat';
  changePct: string;
}

export interface Payout {
  id: number;
  cropLabel: string;
  amount: number;
  status: 'pending' | 'paid';
  stageIndex: number;
  paidAt: string | null;
}

export interface PayoutsResponse {
  pending: Payout | null;
  completed: Payout[];
}

export interface FarmerStats {
  nextCollection: string;
  coordinatorName: string;
  trustScore: number;
  trustLabel: string;
}

export interface QcPhoto {
  stage: string;
  uploaded: boolean;
}

export interface QcInspection {
  id: string;
  farm: string;
  crop: string;
  img: string;
  expectedWeight: number;
  actualWeight: number | null;
  stage: string;
  status: 'pending' | 'passed' | 'rejected';
  notes: string;
  photos: QcPhoto[];
}

export interface RouteStop {
  seq: number;
  name: string;
  farmsCount: number;
  dispatchTime: string;
}

export interface RouteToday {
  name: string;
  stops: RouteStop[];
}

export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';

export interface Delivery {
  id: string;
  orderId: string;
  orderCode: string;
  address: string;
  deliveryDate: string;
  status: DeliveryStatus;
  pickupConfirmed: boolean;
  deliveryConfirmed: boolean;
  notes: string;
}

export interface DriverOption {
  id: string;
  name: string;
  vehicleLabel: string;
}

export interface CoordDelivery {
  id: string;
  orderCode: string;
  address: string;
  deliveryDate: string;
  status: DeliveryStatus;
  driverId: string | null;
  driverName: string | null;
}

export interface BuyerRequest {
  id: string;
  cropName: string;
  qty: number;
  unit: string;
  neededBy: string;
  preferredGrade: 'A' | 'B' | 'C' | 'any';
  status: 'open' | 'matched' | 'fulfilled' | 'cancelled';
  createdAt: string;
}
