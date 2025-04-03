import { FunctionComponent } from "react";

// import classes from "./cart-widget.module.scss";
import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "../store/store";

import { TbBasketDown } from "react-icons/tb";

// interface CartItem {
//   id: number;
//   name: string;
//   price: string;
//   image: string[];
//   quantity: number;
// }

import { selectTotalCount } from "@/app/store/features/cartSlice";
import { useSelector } from "react-redux";

export const CartWidget: FunctionComponent = () => {
  // const cartItems: CartItem[] = useSelector(
  //   (state: RootState) => state.cart.items
  // );
  // const cartItemsLength = cartItems.length;
  const totalCount = useSelector(selectTotalCount);

  const navigate = useRouter();
  const navigateToCart = () => {
    navigate.push("/cart");
  };

  return (
    <button onClick={navigateToCart} className="flex fex-row text-red">
      <TbBasketDown className="basket-icon" />
      <span className="product-icon">{totalCount}</span>
    </button>
  );
};
