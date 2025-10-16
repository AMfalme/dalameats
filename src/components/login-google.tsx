// components/GoogleLoginButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addNotification } from "@/app/store/features/notificationSlice";
import { saveUserDetails } from "@/lib/firebase/auth/signup";
import { signInWithGoogle } from "@/lib/firebase/auth/googleSignIn";
import { userDetails } from "@/types/user";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const { result } = await signInWithGoogle();
      if (result && result.user) {
        dispatch(
          addNotification({
            type: "success",
            message: "Logged in with Google!",
          })
        );

        const userData: userDetails = {
            id: result.user.uid,
            name: result.user?.email?.split("@")[0] || "",
            email: result.user?.email ?? "",
            phone: "",
            address: "",
            ...(existingUser?.role ? { role: existingUser.role } : {}),
        };

        await saveUserDetails(result.user.uid, userData);
        return router.push("/cart");
      }

      dispatch(
        addNotification({
          type: "info",
          message:
            "Unable to sign in, please check your internet access and try again.",
        })
      );
    } catch (error) {
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
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
   
  );
};

export default GoogleLoginButton;
