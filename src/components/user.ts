import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userDetails } from "@/types/user";
export const saveUserDetails = async (uid: string, data: userDetails) => {
  await setDoc(doc(db, "users", uid), data, { merge: true });
};