import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Package,
  TrendingUp,
  IndianRupee,
  ImageIcon,
  Plus,
} from "lucide-react";
import { useProduct } from "../hooks/useProduct";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const { sellerProducts, handleGetSellerProducts, loading } = useProduct();

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  const totalProducts = sellerProducts.length;
  const totalValue = sellerProducts.reduce(
    (sum, p) => sum + (p.price?.amount || 0),
    0
  );
  const recentProducts = sellerProducts.slice(0, 5);

  const formatPrice = (amount, currency = "INR") =>
    currency === "INR"
      ? `₹${Number(amount).toLocaleString("en-IN")}`
      : `${currency} ${Number(amount).toLocaleString()}`;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 lg:text-3xl">
            Welcome back, {user?.fullName?.split(" ")[0] || "Seller"}!
          </h1>
          <p className="mt-1 text-zinc-500">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/seller/create-product"
            className="inline-flex items-center gap-2 rounded-xl bg-[#004d30] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003d26]"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
          <Link
            to="/seller/products"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            View Products
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-[#004d30] p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-emerald-100">Total Products</p>
            <Package className="h-5 w-5 text-emerald-200" />
          </div>
          <p className="mt-3 text-4xl font-bold">{totalProducts}</p>
          <p className="mt-2 flex items-center gap-1 text-xs text-emerald-100">
            <TrendingUp className="h-3 w-3" />
            Active in your catalog
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500">Catalog Value</p>
            <IndianRupee className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="mt-3 text-3xl font-bold text-zinc-900">
            {formatPrice(totalValue)}
          </p>
          <p className="mt-2 text-xs text-zinc-400">Sum of product prices</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500">With Images</p>
            <ImageIcon className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="mt-3 text-3xl font-bold text-zinc-900">
            {sellerProducts.filter((p) => p.images?.length > 0).length}
          </p>
          <p className="mt-2 text-xs text-zinc-400">Products with media</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500">Latest Added</p>
            <TrendingUp className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="mt-3 text-3xl font-bold text-zinc-900">
            {recentProducts.length}
          </p>
          <p className="mt-2 text-xs text-zinc-400">Recently created</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900">Recent Products</h2>
          <Link
            to="/seller/products"
            className="text-sm font-medium text-[#004d30] hover:underline"
          >
            View all
          </Link>
        </div>

        {loading && sellerProducts.length === 0 ? (
          <p className="py-8 text-center text-zinc-500">Loading products...</p>
        ) : recentProducts.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-zinc-300" />
            <p className="mt-4 font-medium text-zinc-600">No products yet</p>
            <p className="mt-1 text-sm text-zinc-400">
              Create your first product to get started.
            </p>
            <Link
              to="/seller/create-product"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#004d30] px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Create Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-500">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Images</th>
                  <th className="pb-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-zinc-50 last:border-0"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                            <Package className="h-4 w-4 text-zinc-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-zinc-900">
                            {product.title}
                          </p>
                          <p className="line-clamp-1 max-w-xs text-xs text-zinc-400">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-zinc-700">
                      {formatPrice(
                        product.price?.amount,
                        product.price?.currency
                      )}
                    </td>
                    <td className="py-4 text-zinc-500">
                      {product.images?.length || 0}
                    </td>
                    <td className="py-4 text-zinc-500">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
