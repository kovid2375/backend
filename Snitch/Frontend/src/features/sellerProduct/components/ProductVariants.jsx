import { useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  UploadCloud,
  Package,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const MAX_VARIANT_IMAGES = 5;

export default function ProductVariants({
  variants,
  setVariants,
}) {
  const fileInputRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);

  const emptyVariant = {
    stock: 0,

    price: {
      amount: "",
      currency: "INR",
    },

    attributes: [
      {
        key: "",
        value: "",
      },
    ],

    images: [],
    previews: [],
  };

  const [variant, setVariant] = useState(emptyVariant);

  // ===============================
  // Images
  // ===============================

  const addImages = (files) => {
    const fileList = Array.from(files);

    const remaining =
      MAX_VARIANT_IMAGES - variant.images.length;

    const selected = fileList.slice(0, remaining);

    setVariant((prev) => ({
      ...prev,

      images: [...prev.images, ...selected],

      previews: [
        ...prev.previews,
        ...selected.map((file) =>
          URL.createObjectURL(file)
        ),
      ],
    }));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(variant.previews[index]);

    setVariant((prev) => ({
      ...prev,

      images: prev.images.filter(
        (_, i) => i !== index
      ),

      previews: prev.previews.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ===============================
  // Attributes
  // ===============================

  const updateAttribute = (
    index,
    field,
    value
  ) => {
    const copy = [...variant.attributes];

    copy[index][field] = value;

    setVariant((prev) => ({
      ...prev,
      attributes: copy,
    }));
  };

  const addAttribute = () => {
    setVariant((prev) => ({
      ...prev,

      attributes: [
        ...prev.attributes,

        {
          key: "",
          value: "",
        },
      ],
    }));
  };

  const removeAttribute = (index) => {
    setVariant((prev) => ({
      ...prev,

      attributes: prev.attributes.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ===============================
  // Save Variant
  // ===============================

  const saveVariant = () => {
    if (!variant.price.amount) return;

    const attrs = {};

    variant.attributes.forEach((attr) => {
      if (
        attr.key.trim() &&
        attr.value.trim()
      ) {
        attrs[attr.key] = attr.value;
      }
    });

    const payload = {
      stock: Number(variant.stock),

      price: {
        amount: Number(
          variant.price.amount
        ),
        currency:
          variant.price.currency,
      },

      attributes: attrs,

      images: variant.images,
    };

    if (editingIndex !== null) {
      const copy = [...variants];

      copy[editingIndex] = payload;

      setVariants(copy);
    } else {
      setVariants([
        ...variants,
        payload,
      ]);
    }

    setEditingIndex(null);

    setVariant(emptyVariant);

    setOpen(false);
  };

  // ===============================
  // Edit
  // ===============================

  const handleEdit = (index) => {
    const item = variants[index];

    setEditingIndex(index);

    setVariant({
      stock: item.stock,

      price: item.price,

      attributes: Object.entries(
        item.attributes
      ).map(([key, value]) => ({
        key,
        value,
      })),

      images: item.images,

      previews: [],
    });

    setOpen(true);
  };

  // ===============================
  // Delete
  // ===============================

  const deleteVariant = (index) => {
    setVariants(
      variants.filter(
        (_, i) => i !== index
      )
    );
  };

  return (
    <>
      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="flex items-center gap-2 text-lg font-bold">

              <Package className="h-5 w-5 text-[#004d30]" />

              Product Variants

            </h2>

            <p className="mt-1 text-sm text-zinc-500">

              Add multiple variants like
              Color, Size, Storage, RAM etc.

            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              setEditingIndex(null);
              setVariant(emptyVariant);
              setOpen(true);
            }}
            className="rounded-xl bg-[#004d30] px-5 py-3 text-sm font-semibold text-white hover:bg-[#003b24]"
          >
            <Plus className="mr-2 inline h-4 w-4" />

            Add Variant
          </button>

        </div>

        {/* Cards will come here in Part 2 */}

      </div>

      {/* Dialog */}

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">

          <DialogHeader>

            <DialogTitle>

              {editingIndex !== null
                ? "Edit Variant"
                : "Create Variant"}

            </DialogTitle>

            <DialogDescription>

              Add stock, pricing,
              attributes and images.

            </DialogDescription>

          </DialogHeader>

          <div className="space-y-6">

            {/* IMAGE UPLOAD */}

            <div>

              <label className="mb-2 block text-sm font-medium">

                Variant Images

              </label>

              <div
                onClick={() =>
                  fileInputRef.current.click()
                }
                className="w-full cursor-pointer rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-10 text-center transition hover:border-[#004d30]"
              >
                <UploadCloud className="mx-auto h-9 w-9 text-[#004d30]" />

                <p className="mt-3 text-sm">

                  Upload Images

                </p>

                <input
                  hidden
                  multiple
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    addImages(e.target.files)
                  }
                />

              </div>

              <div className="mt-4 grid grid-cols-5 gap-3">

                {variant.previews.map(
                  (img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square"
                    >
                      <img
                        src={img}
                        className="h-full w-full rounded-xl object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>
                        {/* STOCK + PRICE */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) =>
                    setVariant((prev) => ({
                      ...prev,
                      stock: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#004d30]"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={variant.price.amount}
                  onChange={(e) =>
                    setVariant((prev) => ({
                      ...prev,

                      price: {
                        ...prev.price,
                        amount: e.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#004d30]"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Currency
                </label>

                <select
                  value={variant.price.currency}
                  onChange={(e) =>
                    setVariant((prev) => ({
                      ...prev,

                      price: {
                        ...prev.price,
                        currency: e.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#004d30]"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>

              </div>

            </div>

            {/* ATTRIBUTES */}

            <div>

              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <h3 className="font-semibold">
                  Variant Attributes
                </h3>

                <button
                type="button"
                onClick={addAttribute}
                className="w-full sm:w-auto rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium hover:bg-zinc-200"
                >
                  <Plus className="mr-1 inline h-4 w-4" />
                  Add Attribute
                </button>

              </div>

              <div className="space-y-3">

                {variant.attributes.map((attr, index) => (

                  <div
                    key={index}
                    className="flex flex-col gap-3 md:flex-row"
                  >

                    <input
                      placeholder="Attribute (Color)"
                      value={attr.key}
                      onChange={(e) =>
                        updateAttribute(
                          index,
                          "key",
                          e.target.value
                        )
                      }
                      className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#004d30]"
                    />

                    <input
                      placeholder="Value (Black)"
                      value={attr.value}
                      onChange={(e) =>
                        updateAttribute(
                          index,
                          "value",
                          e.target.value
                        )
                      }
                      className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#004d30]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeAttribute(index)
                      }
                      className="h-12 w-12 shrink-0 self-end rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                      
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                ))}

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t pt-6">

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border px-5 py-3 font-medium"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveVariant}
                className="rounded-xl bg-[#004d30] px-6 py-3 font-semibold text-white hover:bg-[#00331f]"
              >
                {editingIndex !== null
                  ? "Update Variant"
                  : "Save Variant"}
              </button>

            </div>

          </div>

        </DialogContent>

      </Dialog>

      {/* Variant Cards */}

      <div className="mt-6 space-y-4">

        {variants.length === 0 && (

          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-12 text-center">

            <Package className="mx-auto h-10 w-10 text-zinc-400" />

            <h3 className="mt-4 text-lg font-semibold">
              No Variants Added
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Click "Add Variant" to create your first variant.
            </p>

          </div>

        )}

        {variants.map((item, index) => (

          <div
            key={index}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >

            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-lg font-bold">

                  ₹{item.price.amount}

                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    {item.price.currency}
                  </span>

                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Stock :
                  <span className="ml-2 font-semibold text-zinc-800">
                    {item.stock}
                  </span>
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  {Object.entries(item.attributes).map(
                    ([key, value]) => (

                      <span
                        key={key}
                        className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        {key} : {value}
                      </span>

                    )
                  )}

                </div>

              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="rounded-xl border p-2 hover:bg-zinc-100"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => deleteVariant(index)}
                  className="rounded-xl border border-red-200 p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </>
  );
}