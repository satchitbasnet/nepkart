import { useEffect, useMemo, useState } from "react";
import { categories, Product } from "@/app/data/products";
import { ProductCard } from "@/app/components/ProductCard";
import { Mountain } from "lucide-react";
import { api } from "@/app/services/api";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const backendProducts = await api.products.list();
        const mapped: Product[] = backendProducts.map((p) => ({
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
        }));
        if (!cancelled) {
          setProducts(mapped);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/himalayan-banner.png" 
            alt="Himalayan mountains" 
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>
        
        {/* Gradient Overlay with 75% opacity */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 opacity-75 z-0"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="h-10 w-10" />
              <h2 className="text-5xl font-bold">Authentic Nepalese Products</h2>
            </div>
            <p className="text-xl text-orange-50">
              Discover handcrafted treasures and traditional delicacies from the
              heart of the Himalayas. Every product supports local artisans and
              communities in Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Our Products
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8" role="group" aria-label="Filter products by category">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                aria-pressed={selectedCategory === category.id}
                aria-label={`Filter by ${category.name}`}
                className={`px-6 py-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  selectedCategory === category.id
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-orange-600 hover:text-orange-600"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div 
              className="py-16 text-center text-gray-600" 
              role="status" 
              aria-live="polite"
              aria-label="Loading products"
            >
              Loading products…
            </div>
          ) : error ? (
            <div 
              className="py-16 text-center text-red-600" 
              role="alert" 
              aria-live="assertive"
            >
              <span className="sr-only">Error: </span>
              {error}
            </div>
          ) : (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              role="list"
              aria-label={`${filteredProducts.length} products found`}
            >
              {filteredProducts.map((product) => (
                <div key={product.id} role="listitem">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Authentic Products
              </h3>
              <p className="text-gray-600">
                All products are sourced directly from Nepal and certified authentic.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fair Trade
              </h3>
              <p className="text-gray-600">
                We ensure fair compensation for all artisans and producers.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fast Shipping
              </h3>
              <p className="text-gray-600">
                Quick and secure delivery to your doorstep worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
