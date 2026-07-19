"use client";

import { CartProvider } from "@/context/CartContext";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 px-4 py-8 md:px-8 lg:px-16">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
