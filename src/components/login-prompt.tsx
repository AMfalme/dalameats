"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./providers/auth-provider"; // adjust path
import LoginWithGoogleButton from "@/components/login-google";

export default function LoginSlideModal() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { user } = useAuth(); // get logged-in user

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setShow(true), 10000); // show after 10s
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleRedirect = () => {
    setShow(false); // close modal
    router.push("/login");
  };

  const handleClose = () => setShow(false);

  if (user) return null; // don't show if already logged in

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* semi-transparent overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose} // close when clicking outside
          />

          {/* sliding modal */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-1/4 left-4 w-80 bg-white rounded-xl shadow-2xl z-50 p-6 flex flex-col gap-4"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-lg font-semibold text-gray-800">Welcome Back 👋</h2>

            {/* Login options */}
            <LoginWithGoogleButton />

            <button
              onClick={handleRedirect}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl shadow-md transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm-4 4v4m0-8V8m0 4H8m8 0h-4"
                />
              </svg>
              Continue with Email
            </button>

            <p className="text-sm text-gray-500 mt-2 text-center">
              Please log in to continue exploring our products.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
