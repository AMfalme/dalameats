"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import ProductQuantityCounter from "@/components/ui/product-counter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/cart";
import { useDispatch } from "react-redux";
import { addNotification } from "@/app/store/features/notificationSlice";
import type { AppDispatch } from "@/app/store/store";
import { updateUserCartStatus } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

export default function CartCatalogue() {
  const { user } = useAuth();

  // const [isLoading, setIsLoading] = useState(false);


  const dispatch = useDispatch<AppDispatch>();
  const cartItems: CartItem[] = useSelector(
    (state: RootState) => state.cart.items
  );
  console.log("cartItems: ", cartItems); 
  const router = useRouter();
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const handleSubmit = async () => {
 try {
  console.log("🛒 handleSubmit triggered");

  if (!user?.uid) {
    console.warn("⚠️ No user UID found — user must log in first.");
    dispatch(
      addNotification({
        type: "error",
        message: "You must be logged in to place an order.",
      })
    );
    return;
  }

  console.log("✅ User logged in with UID:", user.uid);

  console.log("⏳ Updating cart status to 'order' for user:", user.uid);
  const result = await updateUserCartStatus(user.uid, "order");
  console.log("✅ updateUserCartStatus completed:", result);

  // Optional success check — depends on how updateUserCartStatus returns
  if (result === undefined || result === null) {
    console.warn("⚠️ updateUserCartStatus returned empty result. Check Firestore function.");
  } else {
    console.log("🔥 Cart status successfully updated in Firestore!");
  }

  dispatch(
    addNotification({
      type: "success",
      message: "Order placed successfully!",
    })
  );

  console.log("✅ Notification dispatched for success.");
} catch (error) {
  console.error("❌ Error placing order:", error);

  dispatch(
    addNotification({
      type: "error",
      message: "Something went wrong while placing your order.",
    })
  );
}
 finally {
      dispatch(
      addNotification({
        type: "success",
        message: "Your order has been recieved. We will call you back!",
        })
      );
      // setIsLoading(false); // Hide loading indicator
    }
   
    router.push("/");
  };

  // const total = cartItems.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 h-screen p-6">
      {/* Left Section (Cart Items) */}
      <div className="bg-gray-100 p-6 rounded-lg overflow-auto shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        {cartItems.length === 0 ? (
          <div className="flex flex-col">
            <p className="text-gray-500 text-center py-4">No items in cart.</p>
            <h2 className="text-xl font-bold mb-4">Add to Cart</h2>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4 shadow-lg">
                <CardContent className="flex items-center gap-4">
                  {/* Product Image */}
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="h-24 w-24 object-cover rounded-md"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      {item.unit}
                      KSH {isNaN(Number(item.price)) ? '0.00' : Number(item.price).toFixed(2)} per {item.unit}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Total:{" "}
                      <span className="text-blue-600">
                        KSH {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>

                  <ProductQuantityCounter item={item} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Right Section (Order Summary) */}
      <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col h-48">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <p className="text-lg font-semibold">
          Total: <span className="text-blue-600">KSH {totalPrice}</span>
        </p>
        <Button className="w-full mt-4" onClick={handleSubmit}>
          Make order now!
        </Button>
      </div>
    </div>
  );
}
