import { useDispatch, useSelector } from "react-redux";
import { removeCartItem, setCart } from "@/app/store/features/cartSlice";
import { AppDispatch, RootState } from "@/app/store/store";
import { useAuth } from "@/components/providers/auth-provider";
import { CartItem } from "@/types/cart";

export const useRemoveFromCart = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleRemoveFromCart = (item: CartItem) => {
    let updatedCart = [...cartItems];

    if (user && user?.uid) {
      dispatch(
        removeCartItem({ userId: user?.uid, item: { id: item.productId } })
      );
    } else {
      // Handle guest cart
      const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      ) as CartItem[];

      const newCart = cart.reduce((acc: CartItem[], cartItem) => {
        if (cartItem.id === item.productId) {
          if (cartItem.quantity > 1) {
            acc.push({ ...cartItem, quantity: cartItem.quantity - 1 });
          }
          // else quantity === 1, item not added (i.e. removed)
        } else {
          acc.push(cartItem);
        }
        return acc;
      }, []);
      localStorage.setItem("cart", JSON.stringify(newCart));
      updatedCart = newCart;
      dispatch(setCart(updatedCart));
    }
  };

  return { handleRemoveFromCart };
};
