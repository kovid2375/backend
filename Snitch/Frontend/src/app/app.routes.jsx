import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import SellerLayout from "../features/sellerProduct/components/SellerLayout";
import SellerRoute from "../features/sellerProduct/components/SellerRoute";
import Dashboard from "../features/sellerProduct/pages/Dashboard";
import Products from "../features/sellerProduct/pages/Products";
import CreateProducts from "../features/sellerProduct/pages/CreateProducts";
import Settings from "../features/sellerProduct/pages/Settings";
import Help from "../features/sellerProduct/pages/Help";
import Home from "../features/buyerProduct/pages/Home";
import SellerProductDetails from "@/features/sellerProduct/pages/SellerProductDetails";
import Cart from "../features/cart/pages/Cart";
import Protected from "../features/auth/components/Protected";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/seller",
    element: <SellerRoute />,
    children: [
      {
        element: <SellerLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/seller/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <Protected role="seller"><Dashboard/></Protected>,
          },
          {
            path: "products",
            element: <Protected role="seller"><Products/></Protected>,
          },
          {
            path: "products/:id",
            element: <Protected role="seller"><SellerProductDetails/></Protected>,
          },
          {
            path: "create-product",
            element: <Protected role="seller"><CreateProducts/></Protected>,
          },
          
          {
            path: "settings",
            element: <Protected role="seller"><Settings/></Protected>,
          },
          {
            path: "help",
            element: <Protected role="seller"><Help/></Protected>,
          },
        ],
      },
    ],
  },
  {
    path:"/cart",
    element:<Protected role="buyer"><Cart/></Protected>
  }
]);
