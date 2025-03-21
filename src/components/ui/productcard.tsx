// import { Listing } from "@/components/login-form"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import Image from 'next/image';
import beefkidneys from "@/static/img/beef kidneys.png";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    image: string;
    price: string;
  };
}
  export default function ProductCard({ product }: ProductCardProps) {
    const { id, name,  price } = product;
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center   md:p-10">
       <Card key={id} className="shadow-lg">
          <CardHeader>
            <CardTitle>{name}</CardTitle>
          </CardHeader>
          <CardContent>
          <Image src={beefkidneys} alt={name} width={500} height={500} className="w-full h-32 object-cover rounded-md" />
           
            <p className="mt-2 text-lg font-semibold">{price}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  