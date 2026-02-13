// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { cn } from "@/lib/utils";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { CartProvider } from "./context/CartContext";

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dakota's Store",
  description: "Your go-to shop for quality products – fast shipping, secure checkout.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        </head>
        <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
          <CartProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}