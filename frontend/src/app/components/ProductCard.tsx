import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/app/data/products";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <article 
      className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2"
      aria-labelledby={`product-${product.id}-name`}
    >
      <Link
        to={`/product/${product.id}`}
        className="block focus:outline-none"
        aria-label={`View details for ${product.name}`}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image || "/placeholder-product.svg"}
            alt={`${product.name} - ${product.description || 'Nepalese product'}`}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-product.svg";
            }}
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center" aria-hidden="true">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold" role="status">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-orange-600 font-semibold uppercase mb-1" aria-label={`Category: ${product.category}`}>
            {product.category}
          </p>
          <h3 id={`product-${product.id}-name`} className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900" aria-label={`Price: $${product.price.toFixed(2)}`}>
              <span className="sr-only">Price: </span>
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          aria-label={`Add ${product.name} to cart`}
          aria-disabled={!product.inStock}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">Add to Cart</span>
        </button>
      </div>
    </article>
  );
}
