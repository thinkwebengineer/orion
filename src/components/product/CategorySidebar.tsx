"use client";

export interface SidebarSubcategory {
  label: string;
  value: string | null; // null = "All"
}

export interface WhyChooseItem {
  icon: string;
  title: string;
  description: string;
}

interface CategorySidebarProps {
  categoryName: string;
  subcategories: SidebarSubcategory[];
  activeSubcategory: string | null;
  onSubcategoryChange: (value: string | null) => void;
  whyChooseItems: WhyChooseItem[];
}

export default function CategorySidebar({
  categoryName,
  subcategories,
  activeSubcategory,
  onSubcategoryChange,
  whyChooseItems,
}: CategorySidebarProps) {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      {/* Shop [Category] */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 mb-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#FFD700] mb-4">
          Shop {categoryName}
        </h3>
        <nav className="flex flex-col gap-1.5">
          {subcategories.map((sub) => {
            const isActive = activeSubcategory === sub.value;
            return (
              <button
                key={sub.value ?? "__all__"}
                onClick={() => onSubcategoryChange(sub.value)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 shadow-[inset_0_1px_0_0_rgba(255,215,0,0.1)]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent"
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Why Choose Our [Category] */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#FFD700] mb-5">
          Why Choose Our {categoryName}?
        </h3>
        <div className="flex flex-col gap-4">
          {whyChooseItems.map((item, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#FFD700]/10 text-[#FFD700] text-sm">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-200">{item.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
