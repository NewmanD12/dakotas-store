// src/components/AddProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "../../utils/uploadthing";
import { addProduct } from "./actions";

export default function AddProductForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState(""); // text field
  const [category, setCategory] = useState("t-shirts");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [stockBySize, setStockBySize] = useState<Record<string, number | undefined>>({});
  const [priceBySize, setPriceBySize] = useState<Record<string, string>>({}); // per-size upcharge/override
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [onSale, setOnSale] = useState(false);
  const [saleType, setSaleType] = useState<"percentage" | "flat">("percentage");
  const [saleValue, setSaleValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !basePrice || images.length === 0) {
      alert("Name, base price, and at least one image required");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("basePrice", basePrice);
    formData.append("category", category);
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("colors", JSON.stringify(colors));
    formData.append("images", JSON.stringify(images));
    formData.append("stockBySize", JSON.stringify(stockBySize));
    formData.append("priceBySize", JSON.stringify(priceBySize));
    formData.append("onSale", onSale.toString());
    if (onSale) {
      formData.append("saleType", saleType);
      formData.append("saleValue", saleValue);
    }

    try {
      await addProduct(formData);
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      alert("Failed to add product");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-lg">
      {/* Name */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-4 px-6"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-4 px-6"
        />
      </div>

      {/* Base Price - text field */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Base Price</label>
        <input
          type="text"
          placeholder="e.g. $29.99, Market Price, or Contact for Pricing"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          required
          className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-4 px-6"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-4 px-6"
        >
          <option value="t-shirts">T-Shirts</option>
          <option value="hoodies">Hoodies</option>
          <option value="hats">Hats</option>
        </select>
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Sizes</label>
        <div className="mt-2 flex flex-wrap gap-4">
          {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
            <label key={size} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sizes.includes(size)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSizes([...sizes, size]);
                  } else {
                    setSizes(sizes.filter((s) => s !== size));
                  }
                }}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Stock by Size */}
      {sizes.length > 0 && (
        <div className="mt-6">
          <label className="block text-lg font-medium text-gray-700 mb-3">Stock Levels by Size</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sizes.map((size) => (
              <div key={size} className="flex items-center gap-3">
                <span className="w-12 font-medium text-gray-800">{size}:</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Stock (0 = out of stock)"
                  value={stockBySize[size] ?? ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? undefined : Number(e.target.value);
                    setStockBySize((prev) => ({
                      ...prev,
                      [size]: val,
                    }));
                  }}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3 px-4"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price by Size (upcharges/overrides) */}
      {sizes.length > 0 && (
        <div className="mt-6">
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Price by Size (optional - overrides base price)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sizes.map((size) => (
              <div key={size} className="flex items-center gap-3">
                <span className="w-12 font-medium text-gray-800">{size}:</span>
                <input
                  type="text"
                  placeholder="Same as base"
                  value={priceBySize[size] || ""}
                  onChange={(e) => {
                    setPriceBySize((prev) => ({
                      ...prev,
                      [size]: e.target.value,
                    }));
                  }}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3 px-4"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Colors (comma separated)</label>
        <input
          type="text"
          placeholder="Black, White, Red"
          onChange={(e) => setColors(e.target.value.split(",").map((c) => c.trim()))}
          className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-4 px-6"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Images</label>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]?.url) {
              setImages([...images, res[0].url]);
            }
          }}
          onUploadError={(error) => alert(`Upload failed: ${error.message}`)}
          onUploadProgress={(progress) => setUploadProgress(progress)}
          className="mt-2 w-full"
        />
        {uploadProgress !== null && <p className="mt-2 text-indigo-600">Uploading: {uploadProgress}%</p>}

        <div className="mt-4 grid grid-cols-3 gap-4">
          {images.map((url, i) => (
            <img key={i} src={url} alt="upload" className="w-full h-32 object-cover rounded-lg shadow" />
          ))}
        </div>
      </div>

      {/* Sale Section */}
      <div className="mt-6">
        <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => setOnSale(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded"
          />
          Put this product on sale?
        </label>

        {onSale && (
          <div className="mt-4 space-y-4 pl-7">
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Type</label>
              <select
                value={saleType}
                onChange={(e) => setSaleType(e.target.value as "percentage" | "flat")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-2"
              >
                <option value="percentage">% Off</option>
                <option value="flat">Flat $ Off</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount Amount
              </label>
              <input
                type="text"
                value={saleValue}
                onChange={(e) => setSaleValue(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-2"
                placeholder={saleType === "percentage" ? "e.g. 20 for 20% off" : "e.g. 5 for $5 off"}
                required={onSale}
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-xl text-xl disabled:opacity-50 transition"
      >
        {isSubmitting ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}