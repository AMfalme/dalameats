import { useAuth } from "@/components/providers/auth-provider";
import { useDispatch } from "react-redux";
import { addItemToCart, setCart } from "@/app/store/features/cartSlice";
import { useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/app/store/store";
import { Product } from "@/types/products";
import { CartItem } from "@/types/cart";

export const useAddToCart = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleAddToCart = (item: Product) => {
    let updatedCart = [...cartItems];

    console.log("We are adding this product: ", item);

    if (user && user?.uid) {
      dispatch(addItemToCart({ uid: user?.uid, item }));
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]"); // Get existing cart or create a new one
      //check if the item already exists in the cart list

      const existingItem = cart.find(
        (cartItem: CartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...item, quantity: 1, productId: item.id });
      }

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      updatedCart = cart;
      // const cartItems = JSON.stringify(cart);
      dispatch(setCart(updatedCart));
    }
  };
  return { handleAddToCart };
};
