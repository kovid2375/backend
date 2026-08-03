import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  CheckCircle2,
  Package,
  Plus,
  X,
} from "lucide-react";
import { useProduct } from "../hooks/useProduct";
import { getStockStatus } from "../services/types.js";

const statusConfig = {
  "in-stock": {
    label: "In stock",
    classes: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  "low-stock": {
    label: "Low stock",
    classes: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
  "out-of-stock": {
    label: "Out of stock",
    classes: "bg-rose-50 text-rose-700 ring-rose-600/20",
    dot: "bg-rose-500",
  },
};

export default function SellerProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAddProductVariant, handleGetProductById } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [savingVariant, setSavingVariant] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError("");
      try {
        const data = await handleGetProductById(id);
        if (active) {
          setProduct(data);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to fetch product details");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadProduct();
    }

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const variants = product?.variants || [];
  const totalStock = useMemo(
    () => variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0),
    [variants]
  );

  const counts = useMemo(
    () => ({
      all: variants.length,
      "in-stock": variants.filter((variant) => getStockStatus(variant.stock) === "in-stock").length,
      "low-stock": variants.filter((variant) => getStockStatus(variant.stock) === "low-stock").length,
      "out-of-stock": variants.filter((variant) => getStockStatus(variant.stock) === "out-of-stock").length,
    }),
    [variants]
  );

  const formatPrice = (amount, currency = "INR") =>
    currency === "INR"
      ? `₹${Number(amount || 0).toLocaleString("en-IN")}`
      : `${currency} ${Number(amount || 0).toLocaleString()}`;

  const basePrice = product?.price?.amount || 0;
  const baseCurrency = product?.price?.currency || "INR";

  async function handleAddVariant(formValues) {
    if (!product?._id) return;

    setSavingVariant(true);
    try {
      const updatedProduct = await handleAddProductVariant(product._id, {
        images: formValues.images,
        stock: formValues.stock,
        price: formValues.price,
        priceCurrency: baseCurrency,
        attributes: {
          [formValues.optionName]: formValues.optionValue,
        },
      });

      setProduct(updatedProduct);
      setShowAddModal(false);
      setToast({ type: "success", msg: "Variant created successfully" });
    } catch (err) {
      setToast({
        type: "error",
        msg: err.response?.data?.message || "Failed to create variant",
      });
    } finally {
      setSavingVariant(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
        <button
          onClick={() => navigate("/seller/products")}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ring-1 ${
            toast.type === "success"
              ? "bg-white text-slate-700 ring-slate-200"
              : "bg-rose-50 text-rose-700 ring-rose-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          )}
          {toast.msg}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/seller/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:p-8">
            <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-32">
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <Package className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                <Package className="h-3.5 w-3.5" />
                Product
              </span>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                {product.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{product.description}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">
                  {formatPrice(basePrice, baseCurrency)}
                </span>
                <span className="text-sm text-slate-400">base price</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200">
            <StatBlock label="Variants" value={counts.all} icon={<Boxes className="h-4 w-4" />} />
            <StatBlock label="Total stock" value={totalStock} icon={<Package className="h-4 w-4" />} />
            <StatBlock
              label="Low / out"
              value={counts["low-stock"] + counts["out-of-stock"]}
              icon={<AlertTriangle className="h-4 w-4" />}
              warn={counts["low-stock"] + counts["out-of-stock"] > 0}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Product variants</h2>
              <p className="text-sm text-slate-500">
                Variants are loaded from the backend and created with the product routes.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#004D30] px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add variant
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            {variants.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Boxes className="h-6 w-6 text-slate-400" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-700">No variants yet</p>
                <p className="mt-1 text-sm text-slate-400">
                  Add the first variant for this product.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-3 font-medium">Variant</th>
                      <th className="px-6 py-3 font-medium">Price</th>
                      <th className="px-6 py-3 font-medium">Stock</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Images</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {variants.map((variant, index) => {
                      const status = statusConfig[getStockStatus(variant.stock)];
                      const attributes = variant.attributes
                        ? Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`)
                        : [];

                      return (
                        <tr key={variant._id || `${index}-${attributes.join("-")}`} className="hover:bg-slate-50/60">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">
                              {attributes.length > 0 ? attributes.join(", ") : `Variant ${index + 1}`}
                            </div>
                            <div className="text-xs text-slate-400">
                              Created {new Date(variant.createdAt || product.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700">
                            {formatPrice(
                              variant.price?.amount ?? basePrice,
                              variant.price?.currency ?? baseCurrency
                            )}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {variant.stock || 0}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${status.classes}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {variant.images?.length || 0} images
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddVariantModal
          currency={baseCurrency}
          loading={savingVariant}
          onClose={() => {
            if (!savingVariant) {
              setShowAddModal(false);
            }
          }}
          onSubmit={handleAddVariant}
        />
      )}
    </div>
  );
}

function StatBlock({ label, value, icon, warn }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          warn ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </div>
      <div>
        <div className="text-lg font-semibold text-slate-900">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  );
}

function AddVariantModal({ currency, loading, onClose, onSubmit }) {
  const [optionName, setOptionName] = useState("Size");
  const [optionValue, setOptionValue] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  async function submit() {
    if (!optionName.trim() || !optionValue.trim()) {
      setError("Option name and option value are required");
      return;
    }

    const parsedStock = Number(stock);
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      setError("Stock must be 0 or more");
      return;
    }

    const parsedPrice = price === "" ? "" : Number(price);
    if (price !== "" && (Number.isNaN(parsedPrice) || parsedPrice < 0)) {
      setError("Price must be a valid number");
      return;
    }

    setError("");
    await onSubmit({
      optionName: optionName.trim(),
      optionValue: optionValue.trim(),
      stock: parsedStock,
      price: parsedPrice === "" ? "" : parsedPrice,
      images,
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Add variant</h3>
            <p className="text-sm text-slate-500">
              Create a variant using the backend product route.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Option name</label>
              <input
                value={optionName}
                onChange={(e) => setOptionName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Option value</label>
              <input
                value={optionValue}
                onChange={(e) => setOptionValue(e.target.value)}
                placeholder="Large / Blue"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Stock</label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">
                Price ({currency})
              </label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Leave blank to use base price"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {loading ? "Saving..." : "Create variant"}
          </button>
        </div>
      </div>
    </div>
  );
}
