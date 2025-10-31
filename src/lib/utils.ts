import { userDetails } from "@/types/user";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// type ProductSummary = {
//   product: string;
//   size: string;
//   totalQty: number;
//   totalAmount: number;
// };

// type UserSummary = {
//   user: string;
//   totalOrders: number;
//   totalAmount: number;
//   items: { product: string; size: string; qty: number }[];
// };
import {
  getDocs,
  collection,
  query,
  where,
  // Query,
  QueryConstraint,
  // DocumentData,
  doc,
  getDoc,
  updateDoc,
  // Timestamp,
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

// function getStartTimestamp(range?: string): Timestamp | null {
//   const now = new Date();
//   const start = new Date();

//   switch (range) {
//     case "today":
//       start.setHours(0, 0, 0, 0);
//       break;
//     case "week":
//       start.setDate(now.getDate() - 7);
//       break;
//     case "month":
//       start.setMonth(now.getMonth() - 1);
//       break;
//     default:
//       return null;
//   }

//   return Timestamp.fromDate(start);
// }

export async function fetchFilteredCartStates(
  status?: string,
  startDate?: string // ISO timestamp
): Promise<CartState[]> {
  const constraints: QueryConstraint[] = [];

  if (status) {
    constraints.push(where("status", "==", status));
  }

  if (startDate) {
    constraints.push(where("status", "==", "sale")); // required if filtering by soldAt
    constraints.push(where("soldAt", ">=", new Date(startDate)));
  }

  const q = query(collection(db, "cart"), ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<CartState, "id">;
    return {
      id: doc.id,
      ...data,
    };
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  const orderRef = doc(db, "cart", orderId);
  await updateDoc(orderRef, {
    status: status,
    updatedAt: new Date()
  });
}

export async function updateUserCartStatus(userId: string, status: string) {


   const cartRef = collection(db, "cart");
      const cartQuery = query(
        cartRef,
        where("user.id", "==", userId),
        where("status", "==", "cart")
      );
      const cartSnapshot = await getDocs(cartQuery);

    if (!cartSnapshot.empty) {


    const cartDoc = cartSnapshot.docs[0];

await updateDoc(cartDoc.ref, {
  status,
  updatedAt: new Date(),
});


    return true;
  }
    console.warn("No active cart found for user:", userId);
    // Optionally, you can create a new cart if none exists
    // await addDoc(userCartRef, { userId, status, items: [], createdAt: new Date() });
    return false;
  }
