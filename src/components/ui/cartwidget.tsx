import { FunctionComponent } from "react";

// import classes from "./cart-widget.module.scss";
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

  return (
    <button className="flex fex-row text-red fixed rounded-full w-15 fs-5 h-15 content-center text-center top-50 bg-amber-500 right-4 z-50">
      <TbBasketDown className="basket-icon text-white text-center text-lg mt-4 m-auto ml-4" />
      <span className="product-icon">{totalCount}</span>
    </button>
  );
};
