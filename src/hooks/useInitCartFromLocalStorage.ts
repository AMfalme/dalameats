import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCart } from "@/app/store/features/cartSlice";
import { AppDispatch } from "@/app/store/store";
import { CartItem } from "@/types/cart";
import { useAuth } from "@/components/providers/auth-provider";

export const useInitCartFromLocalStorage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    // Only run if user is not logged in
    if (!user) {
      const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      ) as CartItem[];
      dispatch(setCart(cart));
    }
  }, [user, dispatch]);
};
