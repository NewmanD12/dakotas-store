import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignedIn } from "@clerk/nextjs";
import AddProductForm from './add-product/page'; // we'll create this next

export default async function AdminDashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-radial from-white to-[#5a7993] mt-8 py-15 px-6 flex flex-col items-center justify-center">
      <div className="container mx-auto max-w-7xl text-center">

        {/* Buttons in responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <Link href="/admin/add-product">
            <button
              className="bg-[#476EA2] hover:bg-[#3a5a8a] text-white font-bold text-3xl md:text-4xl px-12 py-10 rounded-3xl shadow-2xl transition transform hover:scale-105 active:scale-95 w-full"
            >
              + Add Product
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}