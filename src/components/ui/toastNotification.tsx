"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/app/store/store";
import { removeNotification } from "@/app/store/features/notificationSlice";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const toastStyles = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};

export default function ToastNotification() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notification.notifications
  );

  useEffect(() => {
    const timers = notifications.map(
      ({ id }) => setTimeout(() => dispatch(removeNotification(id)), 2000) // Auto-remove after 5s
    );

    return () => timers.forEach(clearTimeout); // Cleanup on unmount
  }, [notifications, dispatch]);

  return (
    <div className="fixed bottom-5 right-5 space-y-2 z-50">
      <AnimatePresence>
        {notifications.map(({ id, type, message }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg",
              toastStyles[type]
            )}
          >
            <span className="text-sm">{message}</span>
            <button onClick={() => dispatch(removeNotification(id))}>
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
