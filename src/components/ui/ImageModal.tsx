// src/components/ImageModal.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
};

export default function ImageModal({ isOpen, onClose, images, initialIndex }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (!isOpen) return null;

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-[95vw] max-h-[95vh] w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-4 text-white hover:text-gray-300 text-5xl z-10"
        >
          <X size={48} />
        </button>

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
            src={images[currentIndex]}
            alt="Enlarged product image"
            fill
            className="object-contain p-4 sm:p-8 lg:p-12"
          />
        </div>
      </div>
    </div>
  );
}