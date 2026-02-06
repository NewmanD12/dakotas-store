'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Store } from 'lucide-react';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Store className="h-6 w-6" />
          Dakota's Store
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary">
            Products
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-primary">
            Categories
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/admin" className="text-sm font-medium hover:text-primary">
              Admin
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}