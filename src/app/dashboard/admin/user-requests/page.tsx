"use client";
import { useEffect, useState } from "react";
import {
  fetchFilteredCartStates,
  fetchUserById,
  updateOrderStatus,
} from "@/lib/utils";
import { CartState } from "@/types/cart";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { userDetails } from "@/types/user";

// const statuses = [
//   "all",
//   "pending",
//   "archived",
//   "completed",
//   "wishlist",
//   "active",
// ];
// import { useRouter } from "next/navigation";

// const router = useRouter();

export default function AdminCarts() {
  const [cartStates, setCartStates] = useState<CartState[]>([]);
 
  const [usersMap, setUsersMap] = useState<Record<string, userDetails>>({});
  const [selectedCart, setSelectedCart] = useState<CartState | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState<"today" | "week" | "month" | "all">("all");

  useEffect(() => {
    fetchFilteredCartStates(
      selectedStatus === "all" ? undefined : selectedStatus,
      selectedDateRange === "all" ? undefined : selectedDateRange
    ).then(setCartStates);
  }, [selectedStatus, selectedDateRange]);
  

  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = [...new Set(cartStates.map((cart) => cart.user.id))];
      const usersData = await Promise.all(
        userIds.map(async (userId) => {
          const user = await fetchUserById(userId);
          console.log("user details in user requests: ", user);
          return { [userId]: user || "Unknown User" };
        })
      );
      console.log("usersData: ", usersData);
      setUsersMap(Object.assign({}, ...usersData));
    };

    if (cartStates.length > 0) {
      fetchUsers();
    }
  }, [cartStates]);
  // const handleRedirect = () => {
  //   router.push("/catalogue");
  // };
  // if (user.role !== "admin") {
  //   return null;
  // }
  const handleCompleteOrder = async () => {
    if (!selectedCart) return;
    setLoading(true);

    try {
      await updateOrderStatus(selectedCart.status, "completed"); // Firestore update
      setCartStates((prev) =>
        prev.map((cart) =>
          cart.status === selectedCart.status
            ? { ...cart, status: "completed" }
            : cart
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setLoading(false);
      setSelectedCart(null);
    }
  };

  return (
    <Card className="p-4 space-y-4">
          <CardHeader>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold capitalize">{selectedStatus} Carts</h1>

        <div className="flex gap-2">
        <div className="flex flex-wrap gap-4 items-center justify-between">
  {/* Status filter */}
  <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-inner">
    {["all", "cart", "ordered", "sale"].map((status) => (
      <button
        key={status}
        onClick={() => setSelectedStatus(status)}
        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-150 ${
          selectedStatus === status
            ? "bg-black text-white shadow"
            : "text-gray-700 hover:bg-white"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    ))}
  </div>

  {/* Date filter */}
  <select
    value={selectedDateRange}
    onChange={(e) => setSelectedDateRange(e.target.value)}
    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white shadow-sm"
  >
    <option value="all">All Dates</option>
    <option value="today">Sold Today</option>
    <option value="week">This Week</option>
    <option value="month">This Month</option>
  </select>
</div>
        </div>
      </div>
    </CardHeader>
      <CardContent>
        {/* Cart Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Phone Number</TableHead>

              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartStates.map((cart, i) => (
              <TableRow key={cart.items[i]?.id}>
                <TableCell>
                  {usersMap[cart.user.id]?.email || "Unknown User"}
                </TableCell>
                <TableCell>
                  {usersMap[cart.user.id]?.phone || "Unknown Number"}
                </TableCell>
                <TableCell>KSH {cart.totalPrice.toFixed(2)}</TableCell>
                <TableCell>{cart.status}</TableCell>
                <TableCell>
                  {/* {cart.updatedAt.toDate().toLocaleString()} */}
                </TableCell>
                <TableCell>
                  <ul className="list-disc pl-4">
                    {cart.items.map((item) => (
                      <li key={item.id}>
                        {item.name} ({item.quantity} x {item.price})
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  {cart.status !== "completed" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-blue-600"
                          onClick={() => setSelectedCart(cart)}
                        >
                          Mark as Sold
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Confirm Completion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to mark this order as
                          **Completed**?
                        </DialogDescription>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedCart(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleCompleteOrder}
                            disabled={loading}
                          >
                            {loading ? "Processing..." : "Confirm"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
