// src/app/cart/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9e4bc] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#5a7993] mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-[#5a7993]">Loading your cart...</h2>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9e4bc] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#5a7993] mb-6">
            Your Cart is Empty
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Looks like you haven't added anything yet.
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#5a7993] text-white font-bold py-4 px-8 rounded-2xl text-xl hover:bg-[#3a5568] transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9e4bc] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#5a7993] text-center mb-10">
          Your Cart
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-10 border-4 border-[#5a7993]">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.size || 'no-size'}-${item.color || 'no-color'}`}
              className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-8 border-b border-gray-300 last:border-b-0"
            >
              <div className="flex items-center gap-6 w-full sm:w-auto">
                {item.image && (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden border-2 border-[#5a7993]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  <p className="text-lg text-gray-700 mt-1">
                    ${(item.price / 100).toFixed(2)}
                  </p>
                  {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                  {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 sm:mt-0">
                <div className="flex items-center gap-2">
                  <label className="text-lg font-medium text-gray-700">Qty:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, Number(e.target.value), item.size, item.color)}
                    min="1"
                    className="w-16 text-center border-2 border-[#5a7993] rounded-lg p-1 text-lg focus:outline-none focus:ring-2 focus:ring-[#5a7993]"
                  />
                </div>

                <button
                  onClick={() => removeFromCart(item.productId, item.size, item.color)}
                  className="text-red-600 hover:text-red-800 font-medium transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-10 text-right">
            <p className="text-2xl font-bold text-gray-900">
              Total: ${(totalPrice / 100).toFixed(2)}
            </p>
            <button className="mt-6 bg-[#5a7993] hover:bg-[#3a5568] text-white font-black py-5 px-10 rounded-2xl text-2xl transition transform hover:scale-105">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}