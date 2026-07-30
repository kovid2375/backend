import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import { useBuyerProduct } from "../hooks/useBuyerProduct";

export default function ProductSection() {
  const { products, loading } = useSelector((state) => state.buyerProduct);
  const { handleGetAllProducts } = useBuyerProduct();

  useEffect(() => {
    handleGetAllProducts();
  }, []);
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#004d30]">
              Marketplace
            </p>

            <h2 className="mt-2 text-4xl font-bold text-gray-900">
              Latest Products
            </h2>

            <p className="mt-3 max-w-xl text-gray-500">
              Explore premium products created by trusted sellers from around
              the world.
            </p>
          </div>

          {/* Sort */}

          <select className="rounded-xl border border-gray-200 bg-white px-5 py-3 outline-none transition focus:border-violet-500">
            <option>Recommended</option>
            <option>Newest</option>
            <option>Price : Low to High</option>
            <option>Price : High to Low</option>
          </select>
        </div>

        {/* Loading */}

        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="h-[430px] animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        )}

        {/* Empty */}

        {!loading && products.length === 0 && (
          <div className="rounded-3xl bg-white py-24 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-700">
              No Products Found
            </h3>

            <p className="mt-3 text-gray-500">
              Sellers haven't added any products yet.
            </p>
          </div>
        )}

        {/* Products */}

        {!loading && products.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}