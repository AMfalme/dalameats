import { userDetails } from "@/types/user";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  getDocs,
  collection,
  query,
  where,
  Query,
  DocumentData,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { CartState } from "@/types/cart";
export async function fetchUsers() {
  const usersCollection = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollection);
  const users = usersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as { id: string; name: string; email: string; role: string }[];
  console.log("uuuuuusers: ", users);
  return users;
}

export async function getUserDocumentByUID(uid: string) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("id", "==", uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as {
      id: string;
      role?: string;
    };
  } else {
    console.log("User not found in Firestore.");
    return null;
  }
}

export async function fetchUserById(userId: string) {
  console.log("Fetching user:", userId);

  const userRef = doc(db, "users", userId); // Get user doc by ID
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    console.log("User data:", userSnap.data());
    return userSnap.data();
  } else {
    console.log("No user found for ID:", userId);
    return null;
  }
}

export async function updateUser(user: userDetails) {
  if (!user.id) throw new Error("User ID is required for update");

  const userRef = doc(db, "users", user.id); // Adjust collection name if needed

  await updateDoc(userRef, {
    name: user.name,
    email: user.email,
    role: user.role,
    dob: user.dob,
    phone: user.phone,
    address: user.address,
  });
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchFilteredCartStates(
  status?: string
): Promise<CartState[]> {
  let q: Query<DocumentData> = collection(db, "cart");

  if (status) {
    q = query(q, where("status", "==", status));
  }

  const querySnapshot = await getDocs(q);
  console.log("querySnapShots: ", querySnapshot);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<CartState, "id">; // Ensure data matches CartState except for 'id'
    return {
      id: doc.id,
      ...data,
    };
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  const orderRef = doc(db, "cartStates", orderId);
  await updateDoc(orderRef, { status });
}
