'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addProductWithVariants } from './actions';

type VariantInput = {
  size: string;
  stock: string;
  priceOverride?: string;
};

export default function AddProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [category, setCategory] = useState('');

  const [variants, setVariants] = useState<VariantInput[]>([
    { size: '', stock: '' },
  ]);

  const addVariant = () => {
    setVariants([...variants, { size: '', stock: '' }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantInput, value: string) => {
    setVariants(prev => {
      const newVariants = [...prev];
      newVariants[index] = {
        ...newVariants[index],
        [field]: value,
      };
      return newVariants;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('basePrice', basePrice);
    formData.append('category', category);
    formData.append('variants', JSON.stringify(variants));

    await addProductWithVariants(formData);
    window.location.href = '/admin';
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div>
          <Label>Base Price</Label>
          <Input type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
        </div>

        <div>
          <Label>Category</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Sizes</h2>
            <Button type="button" onClick={addVariant}>+ Size</Button>
          </div>

          {variants.map((v, i) => (
            <div key={i} className="border p-4 rounded grid grid-cols-3 gap-4">
              <Input value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} placeholder="Size" required />
              <Input type="number" min="0" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} placeholder="Stock" required />
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/admin">Cancel</Link>
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}