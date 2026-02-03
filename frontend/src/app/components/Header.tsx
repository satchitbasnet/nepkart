import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="bg-white border-b sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <Link 
            to="/" 
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
            aria-label="NEPKART home"
          >
            <img
              src="/nepkart-logo.png"
              alt="NEPKART - Authentic Nepalese Products"
              className="h-14 w-auto"
            />
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition"
            aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ', empty'}`}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span 
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold"
                aria-label={`${totalItems} items in cart`}
              >
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
