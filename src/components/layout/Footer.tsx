"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { FaTiktok, FaInstagram, FaYoutube } from "react-icons/fa";
import {
  FaCcVisa,
  FaApplePay,
  FaGooglePay,
  FaCcMastercard,
  FaCcDiscover,
} from "react-icons/fa";

// ── Data ──────────────────────────────────────────────────────────────────────

const SHOP_LINKS = [
  { label: "Liquid Cultures", href: "/shop?category=liquid-cultures" },
  { label: "Spore Swabs", href: "/shop?category=spore-swabs" },
  { label: "Agar Plates", href: "/shop?category=agar-plates" },
  { label: "Genetics", href: "/genetics" },
] as const;

const INFO_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Shipping & Payments", href: "/shipping" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
] as const;

const ACCOUNT_LINKS = [
  { label: "My Account", href: "/account" },
  { label: "Track Order", href: "/account/orders" },
  { label: "Cart", href: "/cart" },
] as const;

const PAYMENT_ICONS = [
  { icon: FaCcVisa, label: "Visa" },
  { icon: FaApplePay, label: "Apple Pay" },
  { icon: FaGooglePay, label: "Google Pay" },
  { icon: FaCcMastercard, label: "Mastercard" },
  { icon: FaCcDiscover, label: "Discover" },
] as const;

const SOCIAL_LINKS = [
  { label: "TikTok", href: "https://tiktok.com/@GOLDENMYCOLOGY", icon: FaTiktok },
  { label: "Instagram", href: "https://instagram.com/GOLDENMYCOLOGY", icon: FaInstagram },
  { label: "YouTube", href: "https://youtube.com/@GOLDENMYCOLOGY", icon: FaYoutube },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire up actual newsletter API endpoint
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-black">
      {/* ── Quality Banner ── */}
      <div className="border-b border-zinc-800/50 bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center md:px-8 lg:px-16">
          <div className="mx-auto mb-3 flex items-center justify-center gap-2 text-gold">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="16" cy="10" rx="12" ry="8" fill="currentColor" />
              <rect x="13" y="10" width="6" height="12" rx="2" fill="currentColor" />
              <circle cx="11" cy="8" r="1.5" fill="#0a0a0a" opacity="0.5" />
              <circle cx="19" cy="6" r="2" fill="#0a0a0a" opacity="0.5" />
              <circle cx="22" cy="10" r="1" fill="#0a0a0a" opacity="0.5" />
              <circle cx="9" cy="12" r="1.2" fill="#0a0a0a" opacity="0.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Made Fresh to Ensure Quality
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Every product is prepared fresh to order, ensuring peak potency and
            purity. From liquid cultures to agar plates, we handle each batch
            with the precision and care that serious mycologists demand.
          </p>
        </div>
      </div>

      {/* ── Newsletter + Social ── */}
      <div className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:px-16">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Stay in the Loop */}
            <div>
              <h3 className="text-lg font-bold tracking-wide text-white">
                Stay in the Loop
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Get notified about new genetics, limited drops, and exclusive
                offers.
              </p>
              {subscribed ? (
                <p className="mt-4 text-sm font-medium text-gold">
                  You&rsquo;re in! Welcome to the Golden Mycology community.
                </p>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="mt-4 flex max-w-md gap-2"
                >
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900/70 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors duration-200 focus:border-gold focus:ring-1 focus:ring-gold"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Follow Our Journey */}
            <div>
              <h3 className="text-lg font-bold tracking-wide text-white">
                Follow Our Journey
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Join us on social media for cultivation tips, behind-the-scenes
                content, and community highlights.
              </p>
              <div className="mt-4 flex items-center gap-4">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 transition-all duration-200 hover:border-gold hover:text-gold"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                TikTok:{" "}
                <a
                  href="https://tiktok.com/@GOLDENMYCOLOGY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-300 transition-colors hover:text-gold"
                >
                  @GOLDENMYCOLOGY
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Columns ── */}
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Shop */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-gold">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors duration-200 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Info */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-gold">
              Info
            </h3>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors duration-200 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Account */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-gold">
              Account
            </h3>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors duration-200 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Secure Payments */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-gold">
              Secure Payments
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-zinc-400">
              We accept all major credit cards and digital wallets. Your payment
              information is always encrypted and secure.
            </p>
            <div className="flex flex-wrap gap-3">
              {PAYMENT_ICONS.map((p) => {
                const Icon = p.icon;
                return (
                  <span
                    key={p.label}
                    className="flex h-9 w-12 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-gold/50 hover:text-gold"
                    title={p.label}
                  >
                    <Icon className="h-5 w-auto" />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-zinc-800/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-8 lg:px-16">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} Golden Mycology. All Rights
            Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/terms"
              className="text-xs text-zinc-500 transition-colors duration-200 hover:text-gold"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-zinc-500 transition-colors duration-200 hover:text-gold"
            >
              Privacy Policy
            </Link>
            <Link
              href="/refund"
              className="text-xs text-zinc-500 transition-colors duration-200 hover:text-gold"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
