"use client";
import { useEffect, useState } from "react";
import { fetchFilteredCartStates } from "@/lib/utils";
import { CartState } from "@/types/cart";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

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

  useEffect(() => {
    fetchFilteredCartStates(
      selectedStatus === "all" ? undefined : selectedStatus
    ).then(setCartStates);
  }, [selectedStatus]);

  return (
    <Card className="p-4 space-y-4">
      <CardHeader>
        <h1 className="text-2xl font-bold">All Carts</h1>
      </CardHeader>
      <CardContent>
        {/* Filter Dropdown */}
        <Select onValueChange={setSelectedStatus} defaultValue={selectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Cart Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dated Created</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Items requested</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartStates.map((cart) => (
              <TableRow key={cart.userId}>
                <TableCell>Today</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
