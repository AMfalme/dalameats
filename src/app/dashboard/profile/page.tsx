"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addNotification } from "@/app/store/features/notificationSlice";
import { useRouter } from "next/navigation";

type User = {
  fullName: string;
  email: string;
  role: string;
  dob: string;
  phone: string;
  address: string;
};

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState<User>({
    fullName: "Arnold Malapa",
    email: "arnold@example.com",
    role: "Admin",
    dob: "1996-08-12",
    phone: "+254712345678",
    address: "Nairobi, Kenya",
  });

  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting user update:", user);
      await new Promise((res) => setTimeout(res, 1000)); // fake API

      dispatch(
        addNotification({
          type: "success",
          message: "Profile updated successfully!",
        })
      );
      setEditMode(false);
      router.refresh();
    } catch (error) {
      console.log(error);
      dispatch(
        addNotification({
          type: "error",
          message: "Failed to update. Try again!",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-1 flex-col px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Button variant="outline" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={user.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <p
              id="role"
            >
              {user.role}
            </p>
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={user.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={user.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={user.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* Personal Info */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">
              Personal Info
            </h2>
            <div className="grid sm:grid-cols-2 gap-8 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Full Name</p>
                <p className="text-base font-medium">
                  {user.fullName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Role</p>
                <p className="text-base font-medium">{user.role || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Date of Birth</p>
                <p className="text-base font-medium">{user.dob || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">
              Contact Info
            </h2>
            <div className="grid sm:grid-cols-2 gap-8 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Email</p>
                <p className="text-base font-medium">{user.email || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Phone</p>
                <p className="text-base font-medium">{user.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">
              Address
            </h2>
            <p className="text-base font-medium">{user.address || "N/A"}</p>
          </div>
        </div>
      )}
    </section>
  );
}
