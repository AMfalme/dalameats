import ProductCard from "@/components/ui/product-card";
import { getProducts } from "@/lib/products";
import { Product } from "@/types/products";
// import { Product } from "@/types/products";

export default async function ProductListPage() {
  const products = await getProducts();
  return <ProductList products={products} />;
}

function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
