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