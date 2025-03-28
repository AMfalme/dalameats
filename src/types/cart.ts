import { Timestamp } from "firebase/firestore";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  productId: string;
}

export interface CartState {
  items: CartItem[];
  status: "idle" | "active" | "completed";
  createdAt: Timestamp;
  totalPrice: number;
  updatedAt: Timestamp;
  userId: string;
}
