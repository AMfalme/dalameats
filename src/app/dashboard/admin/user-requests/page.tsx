"use client";
import { useEffect, useMemo, useState } from "react";
import {
  fetchFilteredCartStates,
  fetchUserById,
  updateOrderStatus,
} from "@/lib/utils";
import { CartState } from "@/types/cart";
import { userDetails } from "@/types/user";
import { subDays, startOfDay } from "date-fns";
import { debounce } from "lodash"; // Debounce utility

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

export default function AdminCarts() {
  const [cartStates, setCartStates] = useState<CartState[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, userDetails>>({});
  const [selectedCart, setSelectedCart] = useState<CartState | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState<
    "today" | "week" | "month" | "all"
  >("all");
  const [viewMode, setViewMode] = useState<"user" | "product">("user");

  const fetchCarts = useMemo(
    () =>
      debounce(async () => {
        const now = new Date();
        let startDate: string | undefined;

        switch (selectedDateRange) {
          case "today":
            startDate = startOfDay(now).toISOString();
            break;
          case "week":
            startDate = subDays(now, 7).toISOString();
            break;
          case "month":
            startDate = subDays(now, 30).toISOString();
            break;
        }

        try {
          const carts = await fetchFilteredCartStates(
            selectedStatus === "all" ? undefined : selectedStatus,
            startDate
          );
          console.log('here are the carts that have been fetched: ', carts)
          setCartStates(carts || []);
        } catch (err) {
          console.error("Error fetching carts:", err);
        }
      }, 300),
    [selectedStatus, selectedDateRange]
  );

  useEffect(() => {
    fetchCarts();
    return fetchCarts.cancel;
  }, [fetchCarts]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = [...new Set(cartStates.map((c) => c.user.id))];
      const usersData = await Promise.all(
        userIds.map(async (id) => {
          const user = await fetchUserById(id);
          return { [id]: user || { email: "Unknown", phone: "N/A" } };
        })
      );
      setUsersMap(Object.assign({}, ...usersData));
    };

    if (cartStates.length) fetchUsers();
  }, [cartStates]);

  const productRequests = useMemo(() => {
    const grouped: Record<
      string,
      {
        name: string;
        unitPrice: number;
        requests: { email: string; quantity: number; total: number }[];
        totalQty: number;
        totalAmount: number;
      }
    > = {};

    cartStates.forEach((cart) => {
      const userEmail = usersMap[cart.user.id]?.email || "Unknown";
      cart.items.forEach((item) => {
        const key = item.name.toLowerCase();
        if (!grouped[key]) {
          grouped[key] = {
            name: item.name,
            unitPrice: item.price,
            requests: [],
            totalQty: 0,
            totalAmount: 0,
          };
        }
        const total = item.quantity * item.price;
        grouped[key].requests.push({
          email: userEmail,
          quantity: item.quantity,
          total,
        });
        grouped[key].totalQty += item.quantity;
        grouped[key].totalAmount += total;
      });
    });

    return grouped;
  }, [cartStates, usersMap]);

  const handleCompleteOrder = async () => {
    if (!selectedCart) return;
    setLoading(true);
    console.log(selectedCart.id);
    try {
      await updateOrderStatus(selectedCart.id, "sold");
      setCartStates((prev) =>
        prev.map((c) =>
          c.status === selectedCart.status ? { ...c, status: "sold" } : c
        )
      );
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
      setSelectedCart(null);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-2xl font-bold capitalize">
            {selectedStatus} Carts
          </h1>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-inner">
              {["all", "cart", "ordered", "sold"].map((status) => (
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
            <select
              value={selectedDateRange}
              onChange={(e) =>
                setSelectedDateRange(
                  e.target.value as "today" | "week" | "month" | "all"
                )
              }
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white shadow-sm"
            >
              <option value="all">All Dates</option>
              <option value="today">Sold Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "user" ? "default" : "outline"}
                onClick={() => setViewMode("user")}
              >
                View by User
              </Button>
              <Button
                variant={viewMode === "product" ? "default" : "outline"}
                onClick={() => setViewMode("product")}
              >
                View by Product
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "user" ? (
          cartStates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartStates
                  .filter((c) => c.items.length)
                  .map((cart, i) => (
                    <TableRow key={i}>
                      <TableCell>{usersMap[cart.user.id]?.email}</TableCell>
                      <TableCell>{usersMap[cart.user.id]?.phone}</TableCell>
                      <TableCell>KSH {cart.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>{cart.status}</TableCell>
                      <TableCell>
                        {new Date(cart.updatedAt.toDate()).toLocaleDateString()}
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
                                Are you sure you want to mark this order as{" "}
                                <strong>Completed</strong>?
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
          ) : (
            <p className="text-center text-gray-500">No cart data available.</p>
          )
        ) : (
          <>
            {Object.entries(productRequests).length > 0 ? (
              Object.entries(productRequests).map(([productId, data]) => (
                <div key={productId} className="mb-8 border-b pb-4">
                  <h2 className="text-lg font-semibold mb-2">{data.name}</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.requests.map((req, index) => (
                        <TableRow key={index}>
                          <TableCell>{req.email}</TableCell>
                          <TableCell>{req.quantity}</TableCell>
                          <TableCell>KSH {data.unitPrice}</TableCell>
                          <TableCell>KSH {req.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-2 font-medium">
                    Subtotal for {data.name}: {data.totalQty} units – KSH{" "}
                    {data.totalAmount.toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No product data available.
              </p>
            )}
            <div className="mt-6 text-xl font-bold">
              Grand Total: KSH{" "}
              {Object.values(productRequests)
                .reduce((sum, p) => sum + p.totalAmount, 0)
                .toFixed(2)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
