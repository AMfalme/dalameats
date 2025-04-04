"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Autoplay from "embla-carousel-autoplay";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { MapPin, Mail, Phone } from "lucide-react";
import { ChangeEventHandler, FormEventHandler } from "react";
import { useInitCartFromLocalStorage } from "@/hooks/useInitCartFromLocalStorage";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaQuoteLeft,
} from "react-icons/fa";

import Image from "next/image";
import heroImage from "@/static/img/hero.png";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import pork from "@/static/img/chicken big legs.png";
import beef from "@/static/img/beef steak.png";
import goat from "@/static/img/goat matumbo 2.png";
import chicken from "@/static/img/chicken big legs.png";
import mutton from "@/static/img/mutton.png";
import lamb from "@/static/img/goat liver.png";
import duck from "@/static/img/chicken drumsticks.png";
import turkey from "@/static/img/chicken gizzards.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PiMoneyWavyLight } from "react-icons/pi";

import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ui/product-card"; // Adjust the path as needed
import Link from "next/link";
import { TbBasketDown } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Adjust the path as needed
import { Product } from "@/types/products";

export default function Home() {
  const router = useRouter();
  useInitCartFromLocalStorage();
  const handleRedirect = () => {
    router.push("/catalogue");
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault(); // Ensure the form doesn't reload the page
    alert("Message sent successfully!");
    setFormData({
      ...formData,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement)
        .value,
    });
  };

  const meatCategories = [
    { name: "Beef", image: beef },
    { name: "Mutton", image: mutton },
    { name: "Chicken", image: chicken },
    { name: "Pork", image: pork },
    { name: "Lamb", image: lamb },
    { name: "Duck", image: duck },
    { name: "Turkey", image: turkey },
    { name: "Goat Meat", image: goat },
  ];
  useEffect(() => {
    const fetchProducts = async () => {
      const productItems = await getProducts();
      setProducts(productItems);
      // Handle productItems if needed
    };
    fetchProducts();
  });
  const testimonials = [
    {
      name: "John Mwangi",
      review:
        "Dalameats delivers fresh and high-quality meat every time. Highly recommended!",
    },
    {
      name: "Aisha Hassan",
      review:
        "Their service is fast, and the meat is always fresh. I love the convenience!",
    },
    {
      name: "Brian Otieno",
      review: "Best prices and top-notch quality. My go-to meat supplier!",
    },
  ];
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-9/10 m-auto mt-5 h-screen flex items-center hero">
        {/* Left Content with Translucent Background */}
        <div className="absolute inset-y-0 left-0 w-1/2 flex flex-col justify-center px-8 md:px-16 text-white z-10 rounded-r-lg py-10">
          <h3 className="text-4xl md:text-5xl font-extrabold drop-shadow-xl leading-tight">
            Premium <span className="text-primary ">Meat</span>, Freshly
            Delivered to Your Doorstep!
          </h3>
          <p className="mt-4 text-lg md:text-2xl font-light drop-shadow-lg">
            Quality Beef, Mutton & Chicken sourced from the finest farms in
            Kenya.
          </p>
          <div className="mt-6 flex gap-4">
            <Button
              className="px-6 py-5 text-lg bg-primary hover:bg-red-700 rounded-full"
              onClick={handleRedirect}
            >
              Shop Now
            </Button>
            <Button className="px-6 py-5 rounded-full bg-transparent border border-white-500 text-white-500 hover:bg-gray-100">
              Learn more
            </Button>
          </div>
        </div>

        {/* Background Image with Gradient */}
        <div className="absolute inset-0 rounded-md">
          <div className="rounded-md absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
          <Image
            src={heroImage}
            alt="Fresh Meat Selection"
            fill
            className="object-cover rounded-md"
          />
        </div>
      </div>
      <section className="relative w-3/4 mt-20 m-auto">
        <h2 className="text-xl font-semibold text-left mb-8">Our Categories</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselContent>
            {Array.from(meatCategories).map((meat, index) => (
              <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                <div className="flex justify-center">
                  <Card className="rounded-full overflow-hidden p-0 h-50 w-50">
                    <Image
                      src={meat.image}
                      alt={meat.name}
                      width={200}
                      height={200}
                      className="object-cover"
                    />
                  </Card>
                </div>
                <p className="text-center mt-3 text-lg font-medium">
                  {meat.name}
                </p>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
      <section className="rw-3/4 mt-4 m-auto flex flex-col items-center justify-center text-center py-20 bg-white text-gray-900 px-4">
        <h1 className="text-2xl font-bold mb-10">
          Enjoy Fresh & Premium Meat, Delivered with Care
        </h1>
        <p className="text-lg mt-10 mb-6 max-w-5xl px-10">
          At Dalameats, we take pride in providing the highest quality beef,
          mutton, and chicken, ensuring freshness and unbeatable value—delivered
          right to your doorstep.
        </p>
        <Button className="mt-6 px-6 py-6 text-lg rounded-full">
          Place Your Order
        </Button>
      </section>
      <section className="w-9/10 relative mt-5 m-auto bg-gradient-to-r from-green-500 to-green-700 text-white py-16 px-10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Fresh. Premium. Delivered to You.
          </h2>
          <p className="text-xl mb-6">
            Discover the finest selection of meats at Dalameats. From grass-fed
            beef to organic chicken, we offer premium cuts delivered right to
            your door. Enjoy the taste of quality in every bite!
          </p>
          <a
            href="/cart"
            className="inline-block bg-white text-green-700 px-8 py-3 rounded-full text-lg font-semibold transition duration-300 hover:bg-green-600 hover:text-white"
          >
            Start Shopping Now
          </a>
        </div>
      </section>
      {/* Featured Products */}
      <h2 className="text-3xl font-bold text-left mb-8 w-9/10 mt-20 mb-20 m-auto">
        Our Best Selections
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-9/10 mt-5 mb-20 m-auto">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* Why Choose Us? */}
      <section className="bg-white text-gray-800 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-green-600">
            Why Choose Dalameats?
          </h2>
          <p className="text-lg mb-12">
            Enjoy premium meats with convenience, affordability, and guaranteed
            freshness.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-100 rounded-full shadow-lg flex flex-col items-center text-center w-65 h-65 mx-auto">
              <MdOutlineWorkspacePremium className="text-green-600 text-7xl mb-3" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm">
                Sourced from trusted farms for unmatched freshness.
              </p>
            </div>

            <div className="p-6 bg-gray-100 rounded-full shadow-lg flex flex-col items-center text-center w-65 h-65 mx-auto">
              <TbBasketDown className="text-green-600 text-7xl mb-3" />
              <h3 className="text-xl font-semibold mb-2">Easy Ordering</h3>
              <p className="text-sm">
                Shop online and get meat delivered to your doorstep.
              </p>
            </div>

            <div className="p-6 bg-gray-100 rounded-full shadow-lg flex flex-col items-center text-center w-65 h-65 mx-auto">
              <PiMoneyWavyLight className="text-green-600 text-7xl mb-3" />

              <h3 className="text-xl font-semibold mb-2">Affordable Prices</h3>
              <p className="text-sm">Great quality at competitive prices.</p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/catalogue"
              className="text-xl font-semibold text-amber-500 hover:underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white text-gray-900 py-12">
        <div className="max-w-4xl mx-auto text-center mt-12">
          <h3 className="text-2xl font-bold text-green-600 mb-20">
            How to Get to Us
          </h3>
          <p className="text-lg text-gray-600 mt-2 mb-10">
            Visit our location for a better experience!
          </p>

          <div className="mt-6 space-y-4 text-gray-700">
            <p className="flex items-center justify-center gap-2 mb-10">
              <MapPin className="w-6 h-6 text-green-600" />
              <span>123 Meat Street, Nairobi, Kenya</span>
            </p>
            <p className="flex items-center justify-center gap-2 mb-10">
              <Phone className="w-6 h-6 text-green-600" />
              <span>+254 700 123 456</span>
            </p>
            <p className="flex items-center justify-center gap-2 mb-10">
              <Mail className="w-6 h-6 text-green-600" />
              <span>info@dalameats.co.ke</span>
            </p>
          </div>
        </div>
        <section className="w-9/10 relative mt-5 m-auto bg-gradient-to-r from-green-500 to-green-700 text-white py-16 px-10 mb-20">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Fresh. Premium. Delivered to You.
            </h2>
            <p className="text-xl mb-6">
              Discover the finest selection of meats at Dalameats. From
              grass-fed beef to organic chicken, we offer premium cuts delivered
              right to your door. Enjoy the taste of quality in every bite!
            </p>
            <a
              href="/cart"
              className="inline-block bg-white text-green-700 px-8 py-3 rounded-full text-lg font-semibold transition duration-300 hover:bg-green-600 hover:text-white"
            >
              Start Shopping Now
            </a>
          </div>
        </section>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-600">Contact Us</h2>
          <p className="text-lg text-gray-600 mt-2">
            {`Have questions? Reach out and we'll respond ASAP!`}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-1/3 mx-auto mt-8 p-6 bg-gray-50 rounded-lg shadow-md"
        >
          <div className="mb-10">
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>
          <div className="mb-10">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
          </div>
          <div className="mb-10">
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={4}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 text-white mb-10"
          >
            Send Message
          </Button>
        </form>

        {/* How to Get to Us Section */}
      </section>
      {/* Testimonials */}
      <section className="bg-gray-50 text-gray-900 py-16">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-green-700 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            See why people love Dalameats!
          </p>

          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 4000 })]}
            className="max-w-3xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="shadow-xl border border-gray-200 rounded-lg">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <FaQuoteLeft className="text-green-500 text-5xl mb-4" />
                      <p className="text-gray-700 italic leading-relaxed mb-5">
                        {testimonial.review}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {testimonial.name}
                      </h3>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Dalameats</h3>
            <p>Premium quality meat delivered fresh to your doorstep.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="text-white hover:text-red-400">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-white hover:text-red-400">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-white hover:text-red-400">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>
        <p className="text-center mt-8 text-sm">
          © 2025 Dalameats. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
