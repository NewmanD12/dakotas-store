// src/app/products/[id]/ProductDetailClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
};

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrev = () => {
    setSelectedImageIndex((prev) => {
      if (prev === null) return 0;
      return prev === 0 ? product.images.length - 1 : prev - 1;
    });
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => {
      if (prev === null) return 0;
      return prev === product.images.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <div className="min-h-screen bg-[#f9e4bc] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-8">
            {/* Main Image */}
            {product.images[0] && (
              <div
                className="bg-white rounded-3xl overflow-hidden border-4 border-[#5a7993] shadow-2xl max-h-[600px] mx-auto cursor-pointer"
                onClick={() => openModal(0)}
              >
                <div className="relative w-full h-auto max-h-[600px]">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="object-contain w-full h-auto p-8"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Thumbnails - small, contained */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                {product.images.slice(1).map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-white rounded-2xl overflow-hidden border-4 border-[#5a7993] shadow-lg cursor-pointer flex items-center justify-center"
                    onClick={() => openModal(i + 1)}
                  >
                    <Image
                      src={url}
                      alt={`${product.name} - ${i + 2}`}
                      width={140}
                      height={140}
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
                      className="px-8 py-4 border-4 border-[#5a7993] rounded-2xl text-xl font-medium text-gray-800 hover:bg-[#5a7993] hover:text-white transition transform hover:scale-105"
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
                    <span
                      key={color}
                      className="px-8 py-4 border-4 border-[#5a7993] rounded-2xl text-xl font-medium text-gray-800 hover:bg-[#5a7993] hover:text-white transition transform hover:scale-105"
                      style={{ backgroundColor: color.toLowerCase(), color: color.toLowerCase() === "black" ? "white" : "black" }}
                    >
                      {color}
                    </span>
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

            <button className="mt-auto w-full bg-[#5a7993] hover:bg-[#3a5568] text-white font-black py-8 rounded-2xl text-4xl transition transform hover:scale-105">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Modal - enlarges the clicked image with carousel */}
        {selectedImageIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={closeModal}
          >
            <div className="relative max-w-[95vw] max-h-[95vh] w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={closeModal}
                className="absolute -top-12 right-4 text-white hover:text-gray-300 text-5xl z-10"
              >
                <X size={48} />
              </button>

              {/* Navigation */}
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-5xl z-10"
              >
                <ChevronLeft size={48} />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-5xl z-10"
              >
                <ChevronRight size={48} />
              </button>

              <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden border-4 border-[#5a7993] shadow-2xl">
                <Image
                  src={product.images[selectedImageIndex]}
                  alt="Enlarged product image"
                  fill
                  className="object-contain p-4 sm:p-8 lg:p-12"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}