import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase_app from "../config";
import { generateFirebaseAuthErrorMessage } from "./firebaseErrorHandler";
import { FirebaseError } from "firebase/app";

import { AppDispatch } from "@/app/store/store";
const auth = getAuth(firebase_app);

export default async function LogInWithEmailAndPassword(
  email: string,
  password: string,
  dispatch: AppDispatch
) {
  let result;
  const error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
    console.log("sign in with email and password response: ", result);
    // const user = result.user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      generateFirebaseAuthErrorMessage(error, dispatch);
    }
  }
  console.log(result, error);
  return { result, error };
}
