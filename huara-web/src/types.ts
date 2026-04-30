export type AppView =
  | "splash"
  | "onboarding"
  | "login"
  | "home"
  | "menu"
  | "rewards"
  | "locations"
  | "profile";

export enum HuaraTier {
  BRONCE = "bronce",
  PLATA = "plata",
  ORO = "oro",
}

export enum OrderStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  READY = "ready",
  COMPLETED = "completed",
}

export enum PickupMethod {
  COUNTER = "counter",
  CURBSIDE = "curbside",
  DRIVE_THRU = "drive_thru",
}

export enum PaymentMethod {
  CARD = "card",
  APPLE_PAY = "apple_pay",
  CASH = "cash",
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  desc: string;
  image?: string;
  category: string;
  hasSalsa?: boolean;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    allergens: string[];
  };
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  salsa?: string;
  extras?: string[];
  customization?: Record<string, string | string[]>;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  branch: string;
  pickupMethod: PickupMethod;
  paymentMethod: PaymentMethod;
  rating?: number;
  feedback?: string;
  pointsEarned: number;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  discountType: "percentage" | "fixed" | "freebie";
  value: number;
  image: string;
  expiresAt: string;
  badge?: string;
}

export interface RewardItem {
  id: string;
  name: string;
  pointsCost: number;
  image: string;
  category: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phones: string[];
  hours: string;
  mapsQuery: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: HuaraTier;
  balance: number;
  visitCount: number;
  referralCode: string;
  favoriteIds: string[];
  hasSeenOnboarding: boolean;
  birthday?: string;
  notifOffers: boolean;
  notifOrders: boolean;
  lastShareDate?: string;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  selectionType: "single" | "multiple";
  options: string[];
}
