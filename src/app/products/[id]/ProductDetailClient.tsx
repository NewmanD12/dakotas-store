// src/app/products/[id]/ProductDetailClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "../../context/CartContext"

type Product = {
  id: number;
  name: string;
  description: string | null;
  basePrice: string;
  onSale: boolean | null;  // ← add | null here
  saleType: "percentage" | "flat" | null;
  saleValue: string | null;
  sizes: string[];
  colors: string[];
  images: string[];
  stockBySize: Record<string, number> | null;
  isActive: boolean;
  priceBySize: Record<string, string>; // Assuming this is in the type from schema
};

export default function ProductDetailClient({ product }: { product: Product }) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { addToCart } = useCart();

  const hasSale = product.onSale && product.saleType && product.saleValue;

  const baseStr = product.basePrice.replace(/[$,]/g, "").trim();
  const base = isNaN(parseFloat(baseStr)) ? 0 : parseFloat(baseStr) * 100;

  const calculateFinalPrice = () => {
    if (!hasSale || !product.saleValue) return base;
    const saleNum = parseFloat(product.saleValue);
    if (isNaN(saleNum)) return base;
    if (product.saleType === "percentage") {
      return base * (1 - saleNum / 100);
    }
    return base - saleNum * 100;
  };

  const finalPrice = (calculateFinalPrice() / 100).toFixed(2);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    if (!selectedColor) {
      alert("Please select a color");
      return;
    }

    // Calculate price: use size override if exists, else base
    let priceStr = product.priceBySize[selectedSize] || product.basePrice;
    priceStr = priceStr.replace(/[$,]/g, "").trim();
    const priceInCents = isNaN(parseFloat(priceStr)) ? 0 : parseFloat(priceStr) * 100;

    addToCart({
      productId: product.id,
      name: product.name,
      price: priceInCents,
      quantity: 1,
      image: product.images[0] || "",
      size: selectedSize,
      color: selectedColor,
    });

    alert("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-[#f9e4bc] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-8">
            {/* Main Image */}
            {product.images[mainImageIndex] && (
              <div className="bg-white rounded-3xl overflow-hidden border-4 border-[#5a7993] shadow-2xl max-h-[700px] mx-auto">
                <div className="relative w-full h-auto max-h-[700px]">
                  <Image
                    src={product.images[mainImageIndex]}
                    alt={product.name}
                    width={700}
                    height={700}
                    className="object-contain w-full h-auto p-8"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Thumbnails - bigger (200x200) and clickable to swap main image */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                {product.images.map((url, i) => (
                  <div
                    key={i}
                    className={`aspect-square bg-white rounded-2xl overflow-hidden border-4 shadow-lg cursor-pointer flex items-center justify-center transition-all duration-300 ${
                      i === mainImageIndex ? "border-[#5a7993] scale-105" : "border-gray-300 hover:border-[#5a7993] hover:scale-105"
                    }`}
                    onClick={() => setMainImageIndex(i)}
                  >
                    <Image
                      src={url}
                      alt={`${product.name} - ${i + 1}`}
                      width={200}
                      height={200}
                      className="object-contain p-6 max-w-full max-h-full"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col bg-white rounded-3xl p-8 lg:p-10 border-4 border-[#5a7993] shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-black text-[#5a7993] mb-6">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <p className="text-4xl font-bold text-gray-900">
                {product.basePrice.startsWith("$") ? product.basePrice : `$${product.basePrice}`}
              </p>

              {hasSale && (
                <>
                  <p className="text-4xl font-bold text-green-600">
                    ${finalPrice}
                  </p>
                  <p className="text-2xl text-gray-500 line-through">
                    {product.basePrice.startsWith("$") ? product.basePrice : `$${product.basePrice}`}
                  </p>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-xl text-gray-800 leading-relaxed mb-10">
                {product.description}
              </p>
            )}

            {product.sizes.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-[#5a7993] mb-4">Sizes</h3>
                <div className="flex flex-wrap gap-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-8 py-4 border-4 border-[#5a7993] rounded-2xl text-xl font-medium transition transform hover:scale-105 ${
                        selectedSize === size ? "bg-[#5a7993] text-white" : "text-gray-800 hover:bg-[#5a7993] hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-[#5a7993] mb-4">Colors</h3>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-8 py-4 border-4 border-[#5a7993] rounded-2xl text-xl font-medium transition transform hover:scale-105 ${
                        selectedColor === color ? "bg-[#5a7993] text-white" : "text-gray-800 hover:bg-[#5a7993] hover:text-white"
                      }`}
                      style={{ backgroundColor: selectedColor === color ? color.toLowerCase() : "transparent", color: selectedColor === color && color.toLowerCase() === "black" ? "white" : "inherit" }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.stockBySize && Object.keys(product.stockBySize).length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-[#5a7993] mb-4">Stock</h3>
                <p className="text-xl text-gray-800">
                  {Object.entries(product.stockBySize)
                    .map(([size, qty]) => `${size}: ${qty != null ? qty : "Out of Stock"}`)
                    .join(" • ")}
                </p>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="mt-auto w-full bg-[#5a7993] hover:bg-[#3a5568] text-white font-black py-8 rounded-2xl text-4xl transition transform hover:scale-105"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}