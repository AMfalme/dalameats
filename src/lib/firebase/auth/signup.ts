import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import firebase_app from "../config";

const auth = getAuth(firebase_app);
export default async function signUp(email: string, password: string) {
  let result = null;
  const error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }

  return { result, error };
}
