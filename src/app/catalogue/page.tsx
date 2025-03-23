import { Button } from "@/components/ui/button";
import Image from "next/image";
import data from "./data.json";
export default function ProductList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {data.map((product) => (
        <div
          key={product.id}
          className="bg-background border border-border rounded-2xl shadow-md hover:shadow-lg transition p-4"
        >
          <Image
            src={product.image[0]}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-48 object-cover rounded-xl"
          />
          <h3 className="mt-4 text-lg font-bold">{product.name}</h3>
          <p className="text-muted-foreground">{product.price}</p>
          <div className="mt-4 flex justify-between overflow-x-hidden whitespace-nowrap">
            <Button variant="outline" className="w-1/3 mr-2">
              View Details
            </Button>
            <Button className="w-1/3 ml-2">Add to Cart</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
