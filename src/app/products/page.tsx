// src/app/products/page.tsx
import { db } from "../drizzle";
import { products } from "../drizzle/schema";
import { and, desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>; // ← Add Promise type
}) {
  // Await searchParams — required in Next.js for async pages
  const params = await searchParams;

  const category = (params.category || "hoodies").toLowerCase();

  const allProducts = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.category, category),
        eq(products.isActive, true)
      )
    )
    .orderBy(desc(products.createdAt));

  const categories = ["t-shirts", "hoodies", "hats"];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-10">
          Shop Our Gear
        </h1>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat}`}
              className={`px-8 py-4 rounded-full text-lg font-medium transition
                ${category === cat
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-indigo-100"}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        {allProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <p className="text-2xl text-gray-600">No {category} available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-[1.02]"
              >
                <div className="aspect-square bg-gray-200 relative">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-gray-600 mt-1">
                    {product.basePrice.startsWith("$") ? product.basePrice : `$${product.basePrice}`}
                  </p>
                  {product.onSale && (
                    <p className="text-sm text-green-600 mt-1">On sale!</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span key={size} className="px-3 py-1 bg-gray-200 rounded text-sm">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}