import { Button } from "@/components/ui/button";
// import { Link } from "lucide-react";
import React from "react";

import heroImage from "@/static/img/hero.png";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
type HeroHomepageType = {
  ctaButton: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
};
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const HeroSection: React.FC = () => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/catalogue");
  };
  const [homepage, setHomepage] = useState<HeroHomepageType | null>(null);
  useEffect(() => {
    const fetchHomepage = async () => {
      const docRef = doc(db, "homepage", "banner");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHomepage(docSnap.data() as HeroHomepageType);
      }
    };
    fetchHomepage();
    console.log("homepage: ", homepage);
  }, [homepage]);
  return (
    <div className="relative w-9/10 m-auto mt-5 h-screen flex items-center hero">
      {/* Left Content with Translucent Background */}
      <div className="absolute inset-y-0 left-0 w-1/2 flex flex-col justify-center px-8 md:px-16 text-white z-10 rounded-r-lg py-10">
        <h3 className="text-4xl md:text-5xl font-extrabold drop-shadow-xl leading-tight">
          Premium <span className="text-primary ">Meat</span>, Freshly Delivered
          to Your Doorstep!
        </h3>
        <p className="mt-4 text-lg md:text-2xl font-light drop-shadow-lg">
          {homepage?.title}
        </p>
        <div className="mt-6 flex gap-4">
          <Button
            className="px-6 py-5 text-lg bg-primary hover:bg-red-700 rounded-full"
            onClick={handleRedirect}
          >
            {homepage?.ctaButton}
          </Button>
          <Button className="px-6 py-5 rounded-full bg-transparent border border-white-500 text-white-500 hover:bg-gray-100">
            Call us: +254 717 416898
          </Button>
        </div>
      </div>

      {/* Background Image with Gradient */}
      <div className="absolute inset-0 rounded-md">
        <Image
          src={heroImage}
          alt="Fresh Meat Selection"
          fill
          className="object-cover rounded-md"
        />
        <p>0717468898</p>
      </div>
    </div>
  );
};

export default HeroSection;
