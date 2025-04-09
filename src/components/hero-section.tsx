import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import heroImage from "@/static/img/hero.png";
import Image from "next/image";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider"; // adjust if different
import { getUserDocumentByUID } from "@/lib/utils";

type HeroHomepageType = {
  ctaButton: string;
  ctaButton2: string; // <-- added this field
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
};

const HeroSection: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.uid) {
        const userDoc = await getUserDocumentByUID(user.uid);
        setIsAdmin(userDoc?.role === "admin");
      }
    };
    fetchUserRole();
  }, [user]);

  const handleRedirect = () => router.push("/catalogue");

  const [homepage, setHomepage] = useState<HeroHomepageType | null>(null);
  const [editing, setEditing] = useState(false);
  const [tempData, setTempData] = useState<HeroHomepageType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepage = async () => {
      const docRef = doc(db, "homepage", "banner");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as HeroHomepageType;
        setHomepage(data);
        setTempData(data);
      }
      setLoading(false);
    };
    fetchHomepage();
  }, []);

  const saveChanges = async () => {
    if (tempData) {
      await updateDoc(doc(db, "homepage", "banner"), tempData);
      setHomepage(tempData);
      setEditing(false);
    }
  };

  if (loading || !homepage) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="relative w-9/10 m-auto mt-5 h-screen flex items-center hero">
      {/* Left Content */}
      <div className="absolute inset-y-0 left-0 w-1/2 flex flex-col justify-center px-8 md:px-16 text-white z-10 rounded-r-lg py-10">
        <h3 className="text-4xl md:text-5xl font-extrabold drop-shadow-xl leading-tight">
          Premium <span className="text-primary">Meat</span>, Freshly Delivered
          to Your Doorstep!
        </h3>

        {editing && isAdmin ? (
          <textarea
            className="mt-4 text-black text-lg md:text-xl font-light bg-white p-2 rounded"
            value={tempData?.title}
            onChange={(e) =>
              setTempData({ ...tempData!, title: e.target.value })
            }
          />
        ) : (
          <p className="mt-4 text-lg md:text-2xl font-light drop-shadow-lg">
            {homepage?.title}
          </p>
        )}

        <div className="mt-6 flex gap-4">
          <Button
            className="px-6 py-5 text-lg bg-primary hover:bg-red-700 rounded-full"
            onClick={handleRedirect}
            disabled={!homepage?.ctaButton}
          >
            {!homepage?.ctaButton ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Loading...
              </>
            ) : (
              homepage.ctaButton
            )}
          </Button>

          {editing && isAdmin ? (
            <textarea
              className="px-6 py-3 text-black text-sm rounded bg-white border"
              value={tempData?.ctaButton2}
              onChange={(e) =>
                setTempData({ ...tempData!, ctaButton2: e.target.value })
              }
            />
          ) : (
            <Button className="px-6 py-5 rounded-full bg-transparent border border-white-500 text-white-500 hover:bg-gray-100">
              {!homepage?.ctaButton2 ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Loading...
                </>
              ) : (
                homepage.ctaButton2
              )}
            </Button>
          )}

          {isAdmin && (
            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button
                    onClick={saveChanges}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                      setTempData(homepage); // reset
                    }}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Edit this section
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 rounded-md">
        <Image
          src={heroImage}
          alt="Fresh Meat Selection"
          fill
          className="object-cover rounded-md"
        />
      </div>
    </div>
  );
};

export default HeroSection;
