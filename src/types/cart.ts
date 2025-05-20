import { Timestamp } from "firebase/firestore";
import { userDetails } from "./user";
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
  id: string;
  items: CartItem[];
  status: "cart" | "ordered" | "sold" | "archived";
  createdAt: Timestamp;
  totalPrice: number;
  updatedAt: Timestamp;
  user: userDetails;
  totalQuantity: 0;
  loading: boolean;
}
