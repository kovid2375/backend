import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useCart } from "../hook/useCart";

const SHIPPING_THRESHOLD = 150;
const FLAT_SHIPPING = 9.95;
const TAX_RATE = 0.08;

function formatPrice(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function normalizeVariants(variants) {
  if (Array.isArray(variants)) {
    return variants;
  }

  if (variants && typeof variants === "object") {
    return [variants];
  }

  return [];
}

function getVariant(item) {
  return normalizeVariants(item?.product?.variants).find(
    (variant) => String(variant._id) === String(item.variant),
  );
}

function getVariantLabel(item) {
  const variant = getVariant(item);

  if (!variant?.attributes) {
    return item?.variant ? "Selected variant" : "Standard";
  }

  return Object.entries(variant.attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" • ");
}

function getItemImage(item) {
  const variant = getVariant(item);
  const variantImage = variant?.images?.[0];
  const productImage = item?.product?.images?.[0];

  return (
    (typeof variantImage === "string" ? variantImage : variantImage?.url) ||
    (typeof productImage === "string" ? productImage : productImage?.url) ||
    item?.product?.image ||
    "https://placehold.co/300x300?text=No+Image"
  );
}

function getUnitPrice(item) {
  const variant = getVariant(item);

  return variant?.price?.amount || item?.product?.price?.amount || 0;
}

function Cart() {
  const [error, setError] = useState("");
  const [pendingKey, setPendingKey] = useState("");
  const { handleGetCart, handleIncrementCartItem } = useCart();
  const { items, totalPrice, currency } = useSelector((state) => state.cart);

  useEffect(() => {
    let active = true;

    async function loadCart() {
      try {
        setError("");
        await handleGetCart();
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Failed to load cart.");
        }
      }
    }

    loadCart();

    return () => {
      active = false;
    };
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [items],
  );
  const subtotal = totalPrice || 0;
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = (subtotal + shipping) * TAX_RATE;
  const total = subtotal + shipping + tax;
  const remainingForFreeShipping = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress =
    subtotal === 0 ? 0 : Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);

  const handleIncreaseQuantity = async (item) => {
    const key = `${item.product?._id}-${item.variant}`;

    try {
      setPendingKey(key);
      setError("");
      await handleIncrementCartItem({
        productId: item.product?._id,
        variantId: item.variant,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update cart quantity.");
    } finally {
      setPendingKey("");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Continue shopping</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-neutral-900">Snitch</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="hidden sm:inline">Cart</span>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
              {itemCount}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Your cart
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {items.length === 0
              ? "Your cart is empty."
              : `${itemCount} ${itemCount === 1 ? "item" : "items"} ready for checkout.`}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mb-6 rounded-2xl border border-neutral-100 bg-white p-5 shadow-soft">
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-brand" />
                  {remainingForFreeShipping > 0 ? (
                    <span className="text-neutral-600">
                      Add{" "}
                      <span className="font-semibold text-neutral-900">
                        {formatPrice(remainingForFreeShipping, currency)}
                      </span>{" "}
                      more for free shipping
                    </span>
                  ) : (
                    <span className="font-medium text-brand">
                      You've unlocked free shipping!
                    </span>
                  )}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {items.map((item) => {
                  const unitPrice = getUnitPrice(item);
                  const itemPrice = unitPrice * (item.quantity || 0);
                  const itemKey = `${item.product?._id}-${item.variant}`;

                  return (
                    <div
                      key={itemKey}
                      className="group flex gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-soft transition-all duration-300 hover:shadow-card sm:p-5"
                    >
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-50 sm:h-28 sm:w-28">
                        <img
                          src={getItemImage(item)}
                          alt={item.product?.title || item.product?.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-neutral-900 sm:text-base">
                              {item.product?.title || item.product?.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-neutral-500 sm:text-sm">
                              {getVariantLabel(item)}
                            </p>
                          </div>
                          <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                            Synced
                          </div>
                        </div>

                        <div className="mt-auto flex items-end justify-between pt-3">
                          <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white">
                            <button
                              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 disabled:opacity-40"
                              disabled
                              title="Decrease endpoint is not available yet"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncreaseQuantity(item)}
                              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:text-brand disabled:opacity-40"
                              disabled={pendingKey === itemKey}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-neutral-900 sm:text-base">
                              {formatPrice(itemPrice, currency)}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {formatPrice(unitPrice, currency)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-neutral-100 bg-white p-6 shadow-card">
                <h2 className="text-lg font-semibold text-neutral-900">Order summary</h2>

                <dl className="mt-6 space-y-3 border-t border-neutral-100 pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Subtotal</dt>
                    <dd className="font-medium text-neutral-900">
                      {formatPrice(subtotal, currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Shipping</dt>
                    <dd className="font-medium text-neutral-900">
                      {shipping === 0 ? (
                        <span className="text-brand">Free</span>
                      ) : (
                        formatPrice(shipping, currency)
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Estimated tax</dt>
                    <dd className="font-medium text-neutral-900">
                      {formatPrice(tax, currency)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-end justify-between border-t border-neutral-100 pt-5">
                  <span className="text-base font-semibold text-neutral-900">Total</span>
                  <span className="text-2xl font-bold tracking-tight text-neutral-900">
                    {formatPrice(total, currency)}
                  </span>
                </div>

                <button className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-card active:scale-[0.99]">
                  Checkout
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-neutral-100 pt-5">
                  <TrustBadge icon={Truck} label="Free shipping" />
                  <TrustBadge icon={RotateCcw} label="30-day returns" />
                  <TrustBadge icon={ShieldCheck} label="Secure pay" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-neutral-400 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Lumen. Crafted with care.
        </div>
      </footer>
    </div>
  );
}

function TrustBadge({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <Icon className="h-4 w-4 text-brand" />
      <span className="text-[11px] font-medium leading-tight text-neutral-500">{label}</span>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-20 text-center shadow-soft">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-50">
        <ShoppingBag className="h-9 w-9 text-neutral-300" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-neutral-900">Your cart is empty</h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        Looks like you haven&apos;t added anything yet. Let&apos;s find something you&apos;ll love.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Start shopping
      </Link>
    </div>
  );
}

export default Cart;
