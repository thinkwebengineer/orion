"use client";
import {
  SiDiscord,
  SiInstagram,
  SiTiktok,
  SiYoutube,
} from "react-icons/si";
import { HiOutlineEnvelope, HiOutlineMapPin, HiOutlineClock } from "react-icons/hi2";

const socialLinks = [
  { href: "https://tiktok.com/@goldenmycology", icon: SiTiktok, label: "TikTok" },
  { href: "https://instagram.com/goldenmycology", icon: SiInstagram, label: "Instagram" },
  { href: "https://youtube.com/@goldenmycology", icon: SiYoutube, label: "YouTube" },
  { href: "https://discord.gg/goldenmycology", icon: SiDiscord, label: "Discord" },
];

const info = [
  {
    icon: HiOutlineEnvelope,
    label: "Email",
    value: "info@goldenmycology.com",
  },
  {
    icon: HiOutlineMapPin,
    label: "Location",
    value: "Pacific Northwest, USA",
  },
  {
    icon: HiOutlineClock,
    label: "Support Hours",
    value: "7 days a week — Instagram DM preferred",
  },
];

export default function ContactPage() {
  return (
    <main className="flex-1 font-sans">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
        {/* Page header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Get In Touch
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Contact
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
            Questions about a culture, need a bulk quote, or just want to say hey?
            We&apos;re here 7 days a week.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-5">
          {/* Form — visual only (no handler) */}
          <div className="md:col-span-3">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-6"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-amber-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  defaultValue=""
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-amber-400"
                >
                  <option value="" disabled>
                    Select a topic…
                  </option>
                  <option value="order">Order Inquiry</option>
                  <option value="cultures">Culture / Genetics Question</option>
                  <option value="supplies">Supplies &amp; Gear</option>
                  <option value="wholesale">Wholesale / Bulk</option>
                  <option value="other">Something Else</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us what's on your mind…"
                  className="w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/30 dark:bg-amber-500 dark:text-zinc-900 dark:hover:bg-amber-400 dark:focus:ring-amber-500/30 sm:w-auto"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Sidebar — info + social */}
          <div className="md:col-span-2 md:pl-4">
            {/* Contact info cards */}
            <div className="space-y-4">
              {info.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {item.label}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social links */}
            <div className="mt-8">
              <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Follow Us
              </h2>
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                Cultivation talk, drops, and community.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
