import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Plus, Search } from "lucide-react";
import { useProduct } from "../hooks/useProduct";

export default function Products() {
  const { sellerProducts, handleGetSellerProducts, loading, error } =
    useProduct();
  const [search, setSearch] = useState("");

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  const formatPrice = (amount, currency = "INR") =>
    currency === "INR"
      ? `₹${Number(amount).toLocaleString("en-IN")}`
      : `${currency} ${Number(amount).toLocaleString()}`;

  const filtered = sellerProducts.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = sellerProducts.reduce(
    (sum, p) => sum + (p.price?.amount || 0),
    0
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 lg:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-zinc-500">
            Manage, track inventory, and update your product catalog.
          </p>
        </div>
        <Link
          to="/seller/create-product"
          className="inline-flex items-center gap-2 rounded-xl bg-[#004d30] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003d26]"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product by name or description..."
              className="w-full rounded-xl border border-zinc-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#004d30]"
            />
          </div>
        </div>
        <div className="rounded-2xl bg-[#004d30] p-6 text-white shadow-sm lg:min-w-[240px]">
          <p className="text-sm font-medium text-emerald-100">
            Total Catalog Value
          </p>
          <p className="mt-2 text-3xl font-bold">
            ₹{totalValue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm">
        {loading && sellerProducts.length === 0 ? (
          <p className="py-16 text-center text-zinc-500">Loading products...</p>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="mx-auto h-12 w-12 text-zinc-300" />
            <p className="mt-4 font-medium text-zinc-600">
              {search ? "No products match your search" : "No products yet"}
            </p>
            {!search && (
              <Link
                to="/seller/create-product"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#004d30] px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Create your first product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-500">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Images</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-zinc-50 transition hover:bg-zinc-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100">
                            <Package className="h-5 w-5 text-zinc-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-zinc-900">
                            {product.title}
                          </p>
                          <p className="text-xs text-zinc-400">
                            Updated{" "}
                            {product.updatedAt
                              ? new Date(product.updatedAt).toLocaleDateString()
                              : "recently"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <p className="line-clamp-2 text-zinc-500">
                        {product.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-800">
                      {formatPrice(
                        product.price?.amount,
                        product.price?.currency
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {product.images?.length || 0} images
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        In Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 text-sm text-zinc-500">
            <span>
              Showing {filtered.length} of {sellerProducts.length} products
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
