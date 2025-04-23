"use client";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { getUserDocumentByUID } from "@/lib/utils";

interface Props {
  children: ReactElement<{ userRole?: string }>; // Extend the type to include userRole
}

export default function AdminLayout({ children }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.uid) {
        const userDoc = await getUserDocumentByUID(user.uid);
        setUserRole(userDoc?.role || "user");
      } else {
        setUserRole("guest");
      }
    };
    fetchUserRole();
  }, [user]);

  if (userRole === null) {
    return <div className="p-10 text-center">Checking permissions...</div>;
  }

  if (userRole !== "admin") {
    router.push("/dashboard");
    return null;
  }

  return <>{cloneElement(children, { userRole })}</>;
}
