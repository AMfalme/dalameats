import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase_app from "../config";
const auth = getAuth(firebase_app);

export default async function LogInWithEmailAndPassword(
  email: string,
  password: string
) {
  let result;
  const error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
    console.log("sign in with email and password response: ", result);
    const user = result.user;
  } catch (error: any) {
    if (error) {
      // display error in the notifications

      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(
        "An error occured here sign in with email and password error: ",
        error,
        errorCode,
        errorMessage
      );
    }
  }
  console.log(result, error);
  return { result, error };
}
