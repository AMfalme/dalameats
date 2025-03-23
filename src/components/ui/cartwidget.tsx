import { FunctionComponent } from "react";

import shoppingCart from "@/static/img/dala_meats_logo.png";
// import classes from "./cart-widget.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconBasket } from "@tabler/icons-react";
interface Props {
  productsCount: number;
}

export const CartWidget: FunctionComponent<Props> = ({ productsCount }) => {
  const navigate = useRouter();
  const navigateToCart = () => {
    navigate.push("/cart");
  };

  return (
    <button onClick={navigateToCart} className="flex fex-row text-red">
      <IconBasket />
      <span>{productsCount}</span>
    </button>
  );
};
