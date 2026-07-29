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
            element: <Dashboard />,
          },
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "create-product",
            element: <CreateProducts />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "help",
            element: <Help />,
          },
        ],
      },
    ],
  },
]);
