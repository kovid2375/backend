import { useEffect, useMemo, useState } from "react";
import {
  X,
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { getBuyerProductById } from "../services/buyerProduct.api";
import { getStockStatus } from "../../sellerProduct/services/types.js";
import { useCart } from "../../cart/hook/useCart";

const statusStyles = {
  "in-stock": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "low-stock": "bg-amber-50 text-amber-700 border-amber-200",
  "out-of-stock": "bg-rose-50 text-rose-700 border-rose-200",
};

export default function ProductQuickView({ open, setOpen, product }) {
  const [productDetails, setProductDetails] = useState(product);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState("");
  const { handleAddItem } = useCart();

  useEffect(() => {
    if (!open || !product?._id) return;

    let active = true;

    async function loadDetails() {
      setLoading(true);
      setError("");
      try {
        const data = await getBuyerProductById(product._id);
        if (active) {
          setProductDetails(data.product);
          setSelectedVariantIndex(null);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load product details");
          setProductDetails(product);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      active = false;
    };
  }, [open, product]);

  const variants = productDetails?.variants || [];
  const selectedVariant = variants[selectedVariantIndex] || null;

  const images = useMemo(() => {
    const variantImages = selectedVariant?.images?.length
      ? selectedVariant.images.map((img) => (typeof img === "string" ? img : img.url))
      : [];

    if (variantImages.length > 0) {
      return variantImages;
    }

    if (productDetails?.images?.length) {
      return productDetails.images.map((img) => (typeof img === "string" ? img : img.url));
    }

    return [productDetails?.image || "https://placehold.co/800x900?text=No+Image"];
  }, [productDetails, selectedVariant]);

  useEffect(() => {
    setSelectedImage(images[0] || "");
  }, [images]);

  useEffect(() => {
    setQty(1);
  }, [selectedVariantIndex, productDetails?._id]);

  useEffect(() => {
    if (variants.length === 1 && variants[0]?._id) {
      setSelectedVariantIndex(0);
    }
  }, [variants]);

  if (!open || !product) return null;

  const priceAmount = selectedVariant?.price?.amount ?? productDetails?.price?.amount ?? 0;
  const currency = selectedVariant?.price?.currency ?? productDetails?.price?.currency ?? "INR";
  const symbol = currency === "INR" ? "₹" : currency === "EUR" ? "€" : "$";
  const stock = selectedVariant?.stock ?? null;
  const stockStatus = getStockStatus(stock);
  const variantAttributes = selectedVariant?.attributes
    ? Object.entries(selectedVariant.attributes)
    : [];
  const hasVariantSelected = selectedVariantIndex !== null && !!selectedVariant;

  const formatVariantLabel = (variant, index) => {
    const entries = variant?.attributes ? Object.entries(variant.attributes) : [];
    if (entries.length === 0) return `Variant ${index + 1}`;
    return entries.map(([key, value]) => `${key}: ${value}`).join(" • ");
  };

  const handleAddToCartClick = async () => {
    if (!productDetails?._id || addingToCart) return;

    if (variants.length > 0 && !selectedVariant?._id) return;

    try {
      setAddingToCart(true);
      setError("");
      await handleAddItem({
        productId: productDetails._id,
        variantId: selectedVariant?._id,
        quantity: qty,
      });
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-md">
      <div className="relative max-h-[95vh] w-full max-w-7xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-5 top-5 z-20 rounded-full bg-gray-100 p-2 hover:bg-gray-200"
        >
          <X />
        </button>

        <div className="grid lg:grid-cols-2">
          <div className="p-8">
            <div className="overflow-hidden rounded-3xl bg-gray-100">
              <img
                src={selectedImage}
                alt={productDetails?.title}
                className="h-[550px] w-full object-cover transition duration-500 hover:scale-110"
              />
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  onClick={() => setSelectedImage(img)}
                  className={`overflow-hidden rounded-xl border-2 ${
                    selectedImage === img ? "border-[#004d30]" : "border-transparent"
                  }`}
                >
                  <img src={img} className="h-24 w-20 object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Verified Seller
            </span>

            <h1 className="mt-4 text-4xl font-bold">
              {productDetails?.title || productDetails?.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1">
                <Star className="fill-yellow-500 text-yellow-500" size={16} />
                <span>{productDetails?.rating || 4.8}</span>
              </div>
              <span className="text-gray-500">
                ({productDetails?.reviews || 120} Reviews)
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-4xl font-bold text-[#004d30]">
                {symbol}
                {priceAmount}
              </span>
            </div>

            <p className="mt-6 leading-7 text-gray-600">
              {productDetails?.description ||
                "Premium quality product crafted with attention to detail. Comfortable, durable and perfect for everyday use."}
            </p>

            {loading && (
              <div className="mt-6 text-sm text-gray-500">Loading product variants...</div>
            )}

            {error && (
              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold">Variants</h3>
                <span className="text-sm text-gray-500">
                  {variants.length} available
                </span>
              </div>

              {variants.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-gray-500">
                  No variants available for this product.
                </div>
              ) : (
                <div className="grid gap-3">
                  {variants.map((variant, index) => {
                    const status = getStockStatus(variant.stock ?? 0);
                    const isSelected = index === selectedVariantIndex;

                    return (
                      <button
                        key={`${productDetails?._id}-variant-${index}`}
                        onClick={() => setSelectedVariantIndex(index)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-[#004d30] bg-[#004d30]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {formatVariantLabel(variant, index)}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              {symbol}
                              {variant.price?.amount ?? productDetails?.price?.amount ?? 0}
                            </div>
                          </div>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
                          >
                            {status.replaceAll("-", " ")}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {!hasVariantSelected && variants.length > 0 && (
              <div className="mt-8 rounded-3xl border border-[#004d30]/15 bg-[#004d30]/5 p-5">
                <div className="text-sm font-semibold text-gray-900">
                  Select a variant to view variant-specific details
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Right now you are seeing the original product information. After you click a variant,
                  the image, price, stock, and variant attributes will update.
                </div>
              </div>
            )}

            {selectedVariant && (
              <div className="mt-8 rounded-3xl bg-gray-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-gray-900">Selected variant</div>
                  <button
                    onClick={() => setSelectedVariantIndex(null)}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white"
                  >
                    Show original product
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {variantAttributes.length > 0 ? (
                    variantAttributes.map(([key, value]) => (
                      <span
                        key={`${key}-${value}`}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700"
                      >
                        {key}: {value}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No attributes available</span>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Stock: <span className="font-semibold text-gray-900">{stock}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Status:{" "}
                  <span className="font-semibold capitalize text-gray-900">
                    {stockStatus.replaceAll("-", " ")}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <h3 className="font-semibold">Quantity</h3>

              <div className="flex items-center rounded-xl border">
                <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus size={18} />
                </button>

                <span className="w-10 text-center">{qty}</span>

                <button
                  className="p-3"
                  onClick={() =>
                    setQty(
                      Math.min(hasVariantSelected && stock > 0 ? stock : qty + 1, qty + 1)
                    )
                  }
                  disabled={hasVariantSelected && stock === 0}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <button className="flex items-center justify-center gap-2 rounded-2xl border py-4 font-semibold hover:bg-gray-100">
                <Heart size={18} /> Wishlist
              </button>

              <button
                onClick={handleAddToCartClick}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#004d30] py-4 font-semibold text-white hover:bg-[#003823] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={(variants.length > 0 && !hasVariantSelected) || stock === 0 || addingToCart}
              >
                <ShoppingCart size={18} /> {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <button
                className="rounded-2xl bg-black py-4 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={hasVariantSelected && stock === 0}
              >
                Buy Now
              </button>
            </div>

            <div className="mt-10 space-y-4 rounded-3xl bg-gray-50 p-6">
              <div className="flex items-center gap-3">
                <Truck className="text-[#004d30]" />
                <span>Free delivery on eligible orders</span>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw className="text-[#004d30]" />
                <span>7 Days Easy Return</span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#004d30]" />
                <span>100% Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
