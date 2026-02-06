import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminDashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-100">
      <Button asChild size="lg" className="text-4xl px-12 py-8 bg-blue-600 hover:bg-blue-700 text-white">
        <Link href="/admin/add-product">Add Product</Link>
      </Button>
    </div>
  );
}