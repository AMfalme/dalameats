import Image from "next/image";
import { Button } from "@/components/ui/button";
import logo from "@/static/img/dala_meats_logo.png";
import beefCategory from "@/static/img/beef steak.png";
import poultryCategory from "@/static/img/chicken big legs.png";
import goatCategory from "@/static/img/goatmeat.png";
import fishCategory from "@/static/img/tilapia.jpg";
import heroImage from "@/static/img/hero dalameats.png";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import data from "../app/listing/data.json";
const categories = [
  {
    name: "Recent",
    posts: [
      {
        id: 1,
        title: "Does drinking coffee make you smarter?",
        date: "5h ago",
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: "2h ago",
        commentCount: 3,
        shareCount: 2,
      },
    ],
  },
  {
    name: "Popular",
    posts: [
      {
        id: 1,
        title: "Is tech making coffee better or worse?",
        date: "Jan 7",
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: "The most innovative things happening in coffee",
        date: "Mar 19",
        commentCount: 24,
        shareCount: 12,
      },
    ],
  },
  {
    name: "Trending",
    posts: [
      {
        id: 1,
        title: "Ask Me Anything: 10 answers to your questions about coffee",
        date: "2d ago",
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: "4d ago",
        commentCount: 1,
        shareCount: 2,
      },
    ],
  },
];
export default function Home() {
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
          <Button className="mt-6 px-6 py-3 text-lg">Shop Now</Button>
        </div>
      </div>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>

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
                src={item.image[0]}
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
