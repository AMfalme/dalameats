"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import logo from "@/static/img/dala_meats_logo.png";
import poultryCategory from "@/static/img/chicken big legs.png";
import goatCategory from "@/static/img/goatmeat.png";
import fishCategory from "@/static/img/tilapia.jpg";
import heroImage from "@/static/img/hero dalameats.png";
import { useRouter } from "next/navigation";
import data from "./catalogue/data.json";

export default function Home() {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/catalogue");
  };
  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        <Image
          src={heroImage}
          alt="Fresh Meat Selection"
          width={500}
          height={200}
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
            Fresh. Quality. Delivered.
          </h1>
          <p className="mt-3 text-lg md:text-xl drop-shadow-md">
            Premium Goat, Beef & Chicken – Just a Click Away!
          </p>
          <Button className="mt-6 px-6 py-3 text-lg" onClick={handleRedirect}>
            Shop Now
          </Button>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Our Best Selections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-white border border-border rounded-2xl shadow-md hover:shadow-lg transition p-4"
            >
              <Image
                src={item.imageUrl}
                alt="Beef Selection"
                width={500}
                height={200}
                className="w-full h-48 object-cover rounded-xl"
              />
              <Button className="mt-4 w-full">View More</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
