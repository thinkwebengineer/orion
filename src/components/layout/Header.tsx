"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineShoppingBag,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineChevronDown,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import {
  FaCcVisa,
  FaApplePay,
  FaGooglePay,
  FaCcMastercard,
  FaCcDiscover,
} from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS: Array<{
  label: string;
  href: string;
  hasDropdown?: boolean;
}> = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", hasDropdown: true },
  { label: "About Us", href: "/about" },
  { label: "Shipping & Payments", href: "/shipping" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const PAYMENT_ICONS = [
  { icon: FaCcVisa, label: "Visa" },
  { icon: FaApplePay, label: "Apple Pay" },
  { icon: FaGooglePay, label: "Google Pay" },
  { icon: FaCcMastercard, label: "Mastercard" },
  { icon: FaCcDiscover, label: "Discover" },
] as const;

function MushroomIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="16" cy="10" rx="12" ry="8" fill="currentColor" />
      <rect x="13" y="10" width="6" height="12" rx="2" fill="currentColor" />
      <circle cx="11" cy="8" r="1.5" fill="#0a0a0a" opacity="0.6" />
      <circle cx="19" cy="6" r="2" fill="#0a0a0a" opacity="0.6" />
      <circle cx="22" cy="10" r="1" fill="#0a0a0a" opacity="0.6" />
      <circle cx="9" cy="12" r="1.2" fill="#0a0a0a" opacity="0.6" />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Banners */}
      <div className="hidden bg-zinc-900 md:block">
        <div className="border-b border-zinc-800/40 px-4 py-1.5 text-center text-[11px] font-medium tracking-[0.15em] text-zinc-400">
          MADE FRESH TO ENSURE QUALITY — $15 MINIMUM SHIPPING • GROUND SHIPPING
          ONLY
        </div>
        <div className="flex items-center justify-center gap-2 px-4 py-1 text-[11px] font-medium tracking-wide text-zinc-500">
          <span className="tracking-[0.12em]">SECURE PAYMENTS</span>
          <span className="flex items-center gap-1.5">
            {PAYMENT_ICONS.map((p) => {
              const Icon = p.icon;
              return (
                <span
                  key={p.label}
                  className="text-zinc-400 transition-colors hover:text-gold"
                  title={p.label}
                >
                  <Icon className="h-3.5 w-auto" />
                </span>
              );
            })}
          </span>
        </div>
      </div>

      <div className="bg-zinc-900 px-4 py-1.5 text-center text-[10px] font-medium tracking-[0.12em] text-zinc-400 md:hidden">
        MADE FRESH • $15 MIN SHIPPING • GROUND ONLY
      </div>

      {/* Main Header Bar */}
      <div className="border-b border-zinc-800/50 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-wider transition-opacity duration-200 hover:opacity-90"
          >
            <MushroomIcon className="h-7 w-7 text-gold" />
            <span className="tracking-[0.08em]">
              <span className="text-gold">GOLDEN</span>
              <span className="text-white"> MYCOLOGY</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-medium tracking-wide transition-all duration-200 ${
                    active
                      ? "text-gold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <HiOutlineChevronDown className="h-3 w-3 opacity-60" />
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Account Profile Dropdown (desktop) */}
            <div className="relative hidden md:block" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center text-zinc-400 transition-colors duration-200 hover:text-gold"
                aria-label="My Account"
              >
                <HiOutlineUser className="h-5 w-5" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-900/95 shadow-2xl backdrop-blur-xl">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    {user ? (
                      <>
                        <p className="text-sm font-medium text-zinc-200 truncate">{user.email}</p>
                        {isAdmin && (
                          <p className="text-xs text-gold mt-0.5">Admin</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-zinc-400">Not signed in</p>
                    )}
                  </div>
                  <div className="p-2">
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-gold transition-colors"
                          >
                            <HiOutlineShieldCheck className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/account"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                          <HiOutlineUser className="h-4 w-4" />
                          My Account
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        >
                          <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative flex items-center transition-all duration-200 ease-in-out hover:text-gold"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <HiOutlineShoppingBag className="h-6 w-6 text-zinc-300 transition-colors duration-200 hover:text-gold" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold leading-none text-black shadow-lg">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex items-center justify-center text-zinc-300 transition-colors duration-200 hover:text-gold md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <HiOutlineXMark className="h-7 w-7" />
              ) : (
                <HiOutlineBars3 className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`overflow-hidden border-b border-zinc-800/50 bg-black/95 backdrop-blur-md transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 pb-6 pt-4">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium tracking-wide transition-all duration-200 ${
                    active
                      ? "bg-zinc-800/60 text-gold"
                      : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <HiOutlineChevronDown className="h-3 w-3 opacity-50" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile: Account section */}
          <div className="mt-4 border-t border-zinc-800/30 pt-4">
            {user ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-sm text-zinc-200 truncate">{user.email}</p>
                  {isAdmin && (
                    <p className="text-xs text-gold mt-0.5">Admin</p>
                  )}
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMobile}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800/40 hover:text-gold transition-colors"
                  >
                    <HiOutlineShieldCheck className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/account"
                  onClick={closeMobile}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800/40 hover:text-white transition-colors"
                >
                  <HiOutlineUser className="h-4 w-4" />
                  My Account
                </Link>
                <button
                  onClick={() => { closeMobile(); signOut(); window.location.href = "/"; }}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-colors"
                >
                  <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMobile}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800/40 hover:text-white transition-colors"
              >
                <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile: Payment icons */}
          <div className="mt-6 flex items-center justify-center gap-3 border-t border-zinc-800/30 pt-4">
            <span className="text-[10px] font-medium tracking-[0.12em] text-zinc-500">
              SECURE PAYMENTS
            </span>
            <span className="flex items-center gap-1.5">
              {PAYMENT_ICONS.map((p) => {
                const Icon = p.icon;
                return (
                  <span key={p.label} className="text-zinc-500" title={p.label}>
                    <Icon className="h-3.5 w-auto" />
                  </span>
                );
              })}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
