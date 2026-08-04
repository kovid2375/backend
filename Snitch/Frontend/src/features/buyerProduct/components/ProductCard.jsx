import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  BadgeCheck,
} from "lucide-react";
import ProductQuickView from "./ProductQuickView";
import { useState } from "react";
import { useCart } from "../../cart/hook/useCart";
import { getBuyerProductById } from "../services/buyerProduct.api";

export default function ProductCard({ product }) {
  const [open, setOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { handleAddItem } = useCart();
  const {
    title,
    name,
    image,
    images,
    price,
    originalPrice,
    seller,
    rating,
    reviews,
    discount,
  } = product;

  const firstImage = images?.[0];
  const productImage =
    image ||
    (typeof firstImage === "string" ? firstImage : firstImage?.url) ||
    "https://placehold.co/600x800?text=No+Image";

  const sellerName =
    typeof seller === "object"
      ? seller?.fullName || seller?.name
      : seller || "Verified Seller";

  const priceAmount = typeof price === "object" ? price?.amount : price;
  const currency = typeof price === "object" ? price?.currency : "USD";
  const defaultVariantId = product?.variants?.find((variant) => variant?._id)?._id;

  const formatPrice = (val) => {
    if (val === undefined || val === null) return "";
    if (currency === "INR") return `₹${val}`;
    if (currency === "EUR") return `€${val}`;
    return `$${val}`;
  };

  const handleAddToCartClick = async () => {
    if (!product?._id || addingToCart) return;

    try {
      setAddingToCart(true);
      let variantId = defaultVariantId;

      if (!variantId) {
        const data = await getBuyerProductById(product._id);
        const resolvedVariants = data?.product?.variants || [];

        if (resolvedVariants.length === 1 && resolvedVariants[0]?._id) {
          variantId = resolvedVariants[0]._id;
        } else if (resolvedVariants.length === 0) {
          variantId = undefined;
        } else {
          setOpen(true);
          return;
        }
      }

      await handleAddItem({
        productId: product._id,
        variantId,
      });
    } catch (error) {
      window.alert(error?.response?.data?.message || "Failed to add product to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div>
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={productImage}
          alt={title || name}
          className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Discount */}
        {discount && (
          <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist */}
        <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition hover:bg-red-500 hover:text-white">
          <Heart size={18} />
        </button>

        {/* Seller */}
        
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
          {title || name}
        </h3>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1">
            <Star
              size={14}
              className="fill-yellow-500 text-yellow-500"
            />
            <span className="text-xs font-semibold">
              {rating || 4.8}
            </span>
          </div>

          <span className="text-sm text-gray-500">
            ({reviews || 120} Reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mt-5 flex items-center gap-3">
          <span className="text-2xl font-bold text-[#004d30]">
            {formatPrice(priceAmount)}
          </span>

          {originalPrice && (
            <span className="text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleAddToCartClick}
            disabled={addingToCart}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#004d30] py-3 font-semibold text-white transition hover:bg-[#004d28] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingCart size={18} />
            {addingToCart ? "Adding..." : defaultVariantId ? "Add to cart" : "View options"}
          </button>

          <button onClick={()=>setOpen(true)} className="rounded-xl border border-gray-200 p-3 transition hover:bg-gray-100">
            <Eye size={20} />
          </button>
        </div>
        
      </div>
      
    </div>
    {open && <ProductQuickView open={open} setOpen={setOpen} product={product} />}
    </div>
    
  );
}
