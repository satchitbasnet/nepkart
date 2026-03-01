import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import type { Product } from "@/app/data/products";
import { useCart } from "@/app/context/CartContext";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/services/api";
import { getProductImageUrl } from "@/app/utils/imageUrl";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const p = await api.products.get(id);
        const mapped: Product = {
          id: p.id,
          sku: p.sku,
          name: p.name,
          description: p.description || "",
          price: Number(p.price),
          category: p.category as Product["category"],
          // Use imageUrl from backend (supports base64 data URLs and regular URLs)
          image: p.imageUrl || "/placeholder-product.svg",
          origin: p.origin,
          weight: Number(p.weight),
          stock: p.stock,
          lowStockThreshold: p.lowStockThreshold,
          inStock: p.stock > 0,
        };
        if (!cancelled) {
          setProduct(mapped);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-600">
        Loading…
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error ? "Failed to Load Product" : "Product Not Found"}
        </h2>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img
            src={getProductImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getProductImageUrl(null);
            }}
          />
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-orange-600 font-semibold uppercase mb-2">
            {product.category}
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-gray-900 mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          {product.inStock ? (
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                In Stock ({product.stock})
              </span>
            </div>
          ) : (
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          <div className="text-sm text-gray-600 mb-6">
            <span className="font-semibold text-gray-700">Origin:</span>{" "}
            {product.origin}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-orange-600 text-white text-lg font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ShoppingCart className="h-6 w-6" />
            Add to Cart
          </button>

          <div className="mt-12 border-t pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Product Details
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>100% authentic and sourced directly from Nepal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Supports local artisans and communities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Fair trade certified</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Worldwide shipping available</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
