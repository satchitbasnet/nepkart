import { createBrowserRouter } from "react-router";
import Root from "@/app/pages/Root";
import ProtectedAdminLayout from "@/app/pages/ProtectedAdminLayout";
import Home from "@/app/pages/Home";
import ProductDetail from "@/app/pages/ProductDetail";
import Cart from "@/app/pages/Cart";
import Checkout from "@/app/pages/Checkout";
import Admin from "@/app/pages/Admin";
import Orders from "@/app/pages/Orders";
import Customers from "@/app/pages/Customers";
import Login from "@/app/pages/Login";
import CustomerLogin from "@/app/pages/CustomerLogin";
import Signup from "@/app/pages/Signup";
import ForgotPassword from "@/app/pages/ForgotPassword";
import ResetPassword from "@/app/pages/ResetPassword";
import NotFound from "@/app/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "login", Component: CustomerLogin },
      { path: "signup", Component: Signup },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/admin/login",
    Component: Login,
  },
  {
    path: "/admin",
    Component: ProtectedAdminLayout,
    children: [
      { index: true, Component: Admin },
      { path: "inventory", Component: Admin },
      { path: "orders", Component: Orders },
      { path: "customers", Component: Customers },
    ],
  },
]);
