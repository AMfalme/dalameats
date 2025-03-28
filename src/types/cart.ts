import { Timestamp } from "firebase/firestore";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  productId: string;
  description: string;
  isAvailable: true;
  salesCount: number;

  stock: number;
  unit: string;
}

export interface CartState {
  items: CartItem[];
  status: "idle" | "active" | "completed";
  createdAt: Timestamp;
  totalPrice: number;
  updatedAt: Timestamp;
  userId: string;
}
