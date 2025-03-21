import ProductCard from "@/components/ui/productcard";

import data from "./data.json"


interface Product {
    id: number;
    name: string;
    image: string;
    price: string;
  }
export default function ProductListingPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-row items-center justify-center p-6 md:p-10">
        {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  );
}
