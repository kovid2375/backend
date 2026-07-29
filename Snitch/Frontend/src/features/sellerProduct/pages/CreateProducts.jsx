import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CloudUpload, X, Plus } from "lucide-react";
import { useProduct } from "../hooks/useProduct";

const MAX_IMAGES = 10;

export default function CreateProducts() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { handleCreateProduct, loading } = useProduct();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addImages = (files) => {
    const fileList = Array.from(files);
    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const toAdd = fileList.slice(0, remaining);
    const newPreviews = toAdd.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setError("");
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addImages(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Product title is required.");
      return;
    }
    if (!form.description.trim()) {
      setError("Product description is required.");
      return;
    }
    if (!form.priceAmount || Number(form.priceAmount) <= 0) {
      setError("Please enter a valid price amount.");
      return;
    }
    if (images.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("priceAmount", form.priceAmount);
    formData.append("priceCurrency", form.priceCurrency);
    images.forEach((file) => formData.append("images", file));

    try {
      await handleCreateProduct(formData);
      setSuccess("Product created successfully!");
      setTimeout(() => navigate("/seller/products"), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to create product. Please try again.";
      setError(msg);
    }
  };

  const handleDiscard = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    navigate("/seller/products");
  };

  const gstAmount = form.priceAmount
    ? (Number(form.priceAmount) * 0.18).toFixed(2)
    : "0.00";
  const finalPrice = form.priceAmount
    ? (Number(form.priceAmount) * 1.18).toFixed(2)
    : "0.00";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 lg:text-3xl">
            Create Product
          </h1>
          <p className="mt-1 text-zinc-500">
            Fill in the details below to add a new product to your inventory.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleDiscard}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Discard
          </button>
          <button
            type="submit"
            form="create-product-form"
            disabled={loading}
            className="rounded-xl bg-[#004d30] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003d26] disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form
        id="create-product-form"
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1fr_340px]"
      >
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-zinc-900">
              <span className="h-5 w-1 rounded-full bg-[#004d30]" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Ergonomic Standing Desk - Oak Edition"
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#004d30]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Provide a detailed description of the product features, materials, and benefits..."
                  className="mt-2 w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#004d30]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-1 flex items-center gap-2 text-base font-bold text-zinc-900">
              <span className="h-5 w-1 rounded-full bg-[#004d30]" />
              Product Media
            </h2>
            <p className="mb-5 text-sm text-zinc-500">
              Upload up to {MAX_IMAGES} high-quality images (
              {images.length}/{MAX_IMAGES} selected)
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 px-6 py-12 transition hover:bg-sky-50"
            >
              <CloudUpload className="h-10 w-10 text-[#004d30]" />
              <p className="mt-3 text-sm font-medium text-zinc-700">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                PNG, JPG or GIF (max 5MB each)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif"
                multiple
                className="hidden"
                onChange={(e) => {
                  addImages(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-7">
              {previews.map((preview, index) => (
                <div key={preview} className="group relative aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {Array.from({
                length: Math.max(0, MAX_IMAGES - previews.length),
              }).map((_, i) => (
                <button
                  key={`empty-${i}`}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 text-zinc-300 transition hover:border-[#004d30] hover:text-[#004d30]"
                >
                  <Plus className="h-6 w-6" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-zinc-900">
              <span className="h-5 w-1 rounded-full bg-[#004d30]" />
              Pricing
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">
                  Amount
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="priceAmount"
                    value={form.priceAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-xl border border-zinc-200 py-3 pl-8 pr-4 text-sm outline-none focus:border-[#004d30]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">
                  Currency
                </label>
                <select
                  name="priceCurrency"
                  value={form.priceCurrency}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#004d30]"
                >
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Tax (GST 18%)</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div className="mt-2 flex justify-between font-bold text-zinc-900">
                  <span>Final Price</span>
                  <span>₹{finalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
