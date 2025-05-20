"use client";
import { useEffect, useState } from "react";
import {  updateUser } from "@/lib/utils";
import { fetchUsers } from "@/lib/users"
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { userDetails } from "@/types/user";
import { useAuth } from "@/components/providers/auth-provider"; // adjust if different
import { getUserDocumentByUID } from "@/lib/utils";

export default function UserList() {
  const [users, setUsers] = useState<userDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<userDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth(); // Fetch logged-in user

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.uid) {
        const userDoc = await getUserDocumentByUID(user.uid);
        setIsAdmin(userDoc?.role === "admin");
      }
    };
    fetchUserRole();
  }, [user]);

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data || []))
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateClick = (user: userDetails) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleInputChange = (e: {
    target: { name: string; value: unknown };
  }) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (selectedUser) {
      console.log("selectedUser: ", selectedUser);

      // Add dob if it's missing or null
      if (!selectedUser.dob) {
        selectedUser.dob = ""; // or a default value like new Date().toISOString()
      }

      await updateUser(selectedUser);

      setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
      setModalOpen(false);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <Card className="p-4 space-y-4">
      <CardHeader>
        <h1 className="text-2xl font-bold">Users</h1>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input
            id="search-users"
            type=""
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/3"
          />
          <Button>Add User</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.dob}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>
                  <Button onClick={() => handleUpdateClick(user)}>
                    Update User Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {modalOpen && selectedUser && (
        <Dialog open={modalOpen} onOpenChange={() => setModalOpen(!modalOpen)}>
          <DialogContent>
            <DialogHeader>
              <h2 className="text-xl font-bold">Update User Role</h2>
            </DialogHeader>
            <div className="space-y-2">
              <Input
                name="name"
                value={selectedUser.name}
                placeholder="Name"
                disabled
              />
              <Input
                name="email"
                value={selectedUser.email}
                placeholder="Email"
                disabled
              />
              <Input
                name="dob"
                value={selectedUser.dob ? selectedUser.dob : ""}
                placeholder="DOB"
                disabled
              />
              <Input
                name="phone"
                value={selectedUser.phone}
                placeholder="Phone"
                disabled
              />
              <Input
                name="address"
                value={selectedUser.address}
                placeholder="Address"
                disabled
              />
              {isAdmin && (
                <div>
                  <label htmlFor="role">Role</label>
                  <select
                    name="role"
                    value={selectedUser.role}
                    onChange={handleInputChange}
                    className="w-full p-2 border"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="rider">Rider</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
