import { useState } from "react";
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
} from "lucide-react";

export default function ProductQuickView({ open, setOpen, product }) {
  if (!open || !product) return null;

  const images = product.images?.length
    ? product.images.map((i) => (typeof i === "string" ? i : i.url))
    : [product.image || "https://placehold.co/800x900?text=No+Image"];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("Black");

  const sizes = ["S","M","L","XL","XXL"];
  const colors = ["Black","White","Olive","Blue"];

  const price = product.price?.amount ?? product.price ?? 0;
  const currency = product.price?.currency ?? "INR";
  const symbol = currency==="INR"?"₹":currency==="EUR"?"€":"$";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-6">
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
                alt={product.title}
                className="h-[550px] w-full object-cover transition duration-500 hover:scale-110"
              />
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`overflow-hidden rounded-xl border-2 ${
                    selectedImage === img
                      ? "border-[#004d30]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    className="h-24 w-20 object-cover"
                    alt=""
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Verified Seller
            </span>

            <h1 className="mt-4 text-4xl font-bold">
              {product.title || product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1">
                <Star className="fill-yellow-500 text-yellow-500" size={16}/>
                <span>{product.rating || 4.8}</span>
              </div>
              <span className="text-gray-500">
                ({product.reviews || 120} Reviews)
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-4xl font-bold text-[#004d30]">
                {symbol}{price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {symbol}{product.originalPrice}
                </span>
              )}
              {product.discount && (
                <span className="rounded-full bg-red-500 px-3 py-1 text-white">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <p className="mt-6 leading-7 text-gray-600">
              {product.description ||
                "Premium quality product crafted with attention to detail. Comfortable, durable and perfect for everyday use."}
            </p>

            <div className="mt-8">
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s)=>(
                  <button
                    key={s}
                    onClick={()=>setSize(s)}
                    className={`h-11 w-11 rounded-xl border ${
                      size===s
                        ? "bg-[#004d30] text-white border-[#004d30]"
                        : "border-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((c)=>(
                  <button
                    key={c}
                    onClick={()=>setColor(c)}
                    className={`rounded-xl border px-4 py-2 ${
                      color===c
                        ? "bg-[#004d30] text-white border-[#004d30]"
                        : "border-gray-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <h3 className="font-semibold">Quantity</h3>

              <div className="flex items-center rounded-xl border">
                <button
                  className="p-3"
                  onClick={()=>setQty(Math.max(1,qty-1))}
                >
                  <Minus size={18}/>
                </button>

                <span className="w-10 text-center">{qty}</span>

                <button
                  className="p-3"
                  onClick={()=>setQty(qty+1)}
                >
                  <Plus size={18}/>
                </button>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <button className="rounded-2xl border py-4 font-semibold hover:bg-gray-100 flex items-center justify-center gap-2">
                <Heart size={18}/> Wishlist
              </button>

              <button className="rounded-2xl bg-[#004d30] py-4 text-white font-semibold hover:bg-[#003823] flex items-center justify-center gap-2">
                <ShoppingCart size={18}/> Add to Cart
              </button>

              <button className="rounded-2xl bg-black py-4 text-white font-semibold hover:bg-gray-800">
                Buy Now
              </button>
            </div>

            <div className="mt-10 rounded-3xl bg-gray-50 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="text-[#004d30]"/>
                <span>Free delivery on eligible orders</span>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw className="text-[#004d30]"/>
                <span>7 Days Easy Return</span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#004d30]"/>
                <span>100% Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}