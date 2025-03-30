import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import firebase_app from "../config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config";
import { userDetails } from "@/types/user";
const auth = getAuth(firebase_app);
export default async function signUp(email: string, password: string) {
  let result = null;
  const error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    // const user = result.user;
    console.log(result);
    return { result, error };
  } catch (error) {
    console.log(error);
  }

  return { result, error };
}
export async function saveUserDetails(
  userId: string,
  userDetails: userDetails
) {
  const userInfo = await setDoc(doc(db, "users", userId), userDetails);
  console.log(userInfo);
  return userInfo;
}
