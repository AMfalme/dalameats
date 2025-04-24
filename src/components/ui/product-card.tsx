"use client";
import Image from "next/image";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/products";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import { CartItem } from "@/types/cart";
import ProductQuantityCounter from "./product-counter";
import { useAddToCart } from "@/hooks/useAddToCart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { handleAddToCart } = useAddToCart();
  const [isOpen, setIsOpen] = useState(false);

  const cartItems: CartItem[] = useSelector(
    (state: RootState) => state.cart.items
  );
  const productCartItem = cartItems.find(
    (item) => item.productId === product.id
  );

  return (
    <>
      <div
        key={product.imageUrl}
        className="bg-background border border-border rounded-2xl shadow-md hover:shadow-lg transition p-4"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-48 object-cover rounded-xl"
        />
        <div className="mt-4 flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold">{product.name}</h3>
            <p className="text-muted-foreground text-xs">
              {product.price} KSH per {product.unit}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-between overflow-x-hidden whitespace-nowrap">
          <Button
            variant="outline"
            className="w-1/3 mr-2 rounded-full mt-2"
            onClick={() => setIsOpen(true)}
          >
            View Details
          </Button>
          {productCartItem ? (
            <ProductQuantityCounter
              item={{ ...productCartItem, id: product.id }}
            />
          ) : (
            <Button
              className="w-1/3 ml-2 rounded-full mt-2"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      {/* POPUP MODAL */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-bold text-gray-800">
                    {product.name}
                  </Dialog.Title>
                  <div className="mt-2">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="mt-4 text-sm text-gray-600">
                      {product.description}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-black">
                      KSH {product.price} per {product.unit}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="destructive"
                    >
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
