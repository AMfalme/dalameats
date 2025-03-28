import { FunctionComponent } from "react";

// import classes from "./cart-widget.module.scss";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

import { IconShoppingCart } from "@tabler/icons-react";

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string[];
  quantity: number;
}

interface Props {
  productsCount: number;
}

export const CartWidget: FunctionComponent<Props> = ({ productsCount }) => {
  // const cartItems: CartItem[] = useSelector(
  //   (state: RootState) => state.cart.items
  // );
  // const cartItemsLength = cartItems.length;

  const navigate = useRouter();
  const navigateToCart = () => {
    navigate.push("/cart");
  };

  return (
    <button onClick={navigateToCart} className="flex fex-row text-red">
      <IconShoppingCart />
      <span className="product-icon">{productsCount}</span>
    </button>
  );
};
