// components/GoogleLoginButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addNotification } from "@/app/store/features/notificationSlice";
import { saveUserDetails } from "@/lib/firebase/auth/signup";
import { signInWithGoogle } from "@/lib/firebase/auth/googleSignIn";
import { userDetails } from "@/types/user";
import Image from "next/image";
import {fetchUserById} from "@/lib/utils"

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const { result } = await signInWithGoogle();
  
      if (!result || !result.user) {
        dispatch(
          addNotification({
            type: "info",
            message: "Unable to sign in, please check your internet access.",
          })
        );
        return;
      }
  
      const uid = result.user.uid;
  
      // 1️⃣ Check if user exists in your DB
      const existingUser = await fetchUserById(uid);
      console.log("Existing user data:", existingUser); // Debug log  
      if (existingUser) {
        // User exists, preserve role and redirect]
        console.log("logged in user exists in user db")
        dispatch(
          addNotification({
            type: "success",
            message: "Welcome back!",
          })
        );
        return router.push("/dashboard");
      }
  
      // 2️⃣ User does NOT exist, create new record
      const userData: userDetails = {
        id: uid,
        name: result.user.email?.split("@")[0] || "",
        email: result.user.email ?? "",
        phone: "",
        address: "",
        role: "customer", // default role for new users
      };
      console.log("Creating new user with data:", userData); // Debug log
      
        await saveUserDetails(uid, userData);
  
      dispatch(
        addNotification({
          type: "success",
          message: "Account created! Logged in successfully.",
        })
      );
  
      // 3️⃣ Redirect
      return router.push("/dashboard");
    } catch (error) {
      console.error(error);
      dispatch(
        addNotification({
          type: "error",
          message: "An unexpected error occurred during login.",
        })
      );
    }
  };

  return (
       <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-xl shadow-sm transition-all duration-200 mb-3"
          >
            <Image
              src={"https://www.svgrepo.com/show/355037/google.svg"}
              alt="Google"
              className="w-5 h-5"
              width={20}
              height={`20`} 
            />

            Continue with Google
          </button>
   
  );
};

export default GoogleLoginButton;
