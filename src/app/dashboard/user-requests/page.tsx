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

const statuses = [
  "all",
  "pending",
  "archived",
  "completed",
  "wishlist",
  "active",
];

export default function AdminCarts() {
  const [cartStates, setCartStates] = useState<CartState[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [usersMap, setUsersMap] = useState<Record<string, userDetails>>({});
  const [selectedCart, setSelectedCart] = useState<CartState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFilteredCartStates(
      selectedStatus === "all" ? undefined : selectedStatus
    ).then(setCartStates);
  }, [selectedStatus]);

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

  const handleCompleteOrder = async () => {
    if (!selectedCart) return;
    setLoading(true);

    try {
      await updateOrderStatus(selectedCart.id, "completed"); // Firestore update
      setCartStates((prev) =>
        prev.map((cart) =>
          cart.id === selectedCart.id ? { ...cart, status: "completed" } : cart
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
        <h1 className="text-2xl font-bold">All Carts</h1>
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
            {cartStates.map((cart) => (
              <TableRow key={cart.id}>
                <TableCell>
                  {usersMap[cart.user.id]?.email || "Unknown User"}
                </TableCell>
                <TableCell>
                  {usersMap[cart.user.id]?.phone || "Unknown Number"}
                </TableCell>
                <TableCell>KSH {cart.totalPrice.toFixed(2)}</TableCell>
                <TableCell>{cart.status}</TableCell>
                <TableCell>
                  {cart.updatedAt.toDate().toLocaleString()}
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
                          Mark as Completed
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
