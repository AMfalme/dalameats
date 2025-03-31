"use client";
import { useEffect, useState } from "react";
import { fetchUsers, updateUser } from "@/lib/utils";
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
export default function UserList() {
  const [users, setUsers] = useState<userDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateUser(selectedUser);
    setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
    setModalOpen(false);
  };
  if (loading) return <p>Loading users...</p>;
  // if (!selectedUser) return null;

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
                    Update
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
              <h2 className="text-xl font-bold">Update User</h2>
            </DialogHeader>
            <div className="space-y-2">
              <Input
                name="name"
                value={selectedUser.name}
                onChange={handleInputChange}
                placeholder="Name"
              />
              <Input
                name="email"
                value={selectedUser.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <Input
                name="role"
                value={selectedUser.role}
                onChange={handleInputChange}
                placeholder="Role"
              />
              <Input
                name="dob"
                value={selectedUser.dob}
                onChange={handleInputChange}
                placeholder="DOB"
              />
              <Input
                name="phone"
                value={selectedUser.phone}
                onChange={handleInputChange}
                placeholder="Phone"
              />
              <Input
                name="address"
                value={selectedUser.address}
                onChange={handleInputChange}
                placeholder="Address"
              />
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
