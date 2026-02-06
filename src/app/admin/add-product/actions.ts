'use server';

import { db } from '@/db';
import { products, productVariants } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function addProductWithVariants(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const basePrice = Math.round(Number(formData.get('basePrice')) * 100);
  const category = formData.get('category') as string;

  const [newProduct] = await db.insert(products).values({
    name,
    description,
    basePrice,
    category,
  }).returning({ id: products.id });

  const variants = JSON.parse(formData.get('variants') as string);

  for (const v of variants) {
    await db.insert(productVariants).values({
      productId: newProduct.id,
      size: v.size,
      stock: Number(v.stock),
    });
  }

  revalidatePath('/admin');
  redirect('/admin');
}