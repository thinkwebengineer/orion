interface Props {
  visible: boolean;
}

export default function MicroscopyDisclaimer({ visible }: Props) {
  if (!visible) return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-6">
      <span className="text-amber-400 text-lg leading-none mt-0.5">🔬</span>
      <div>
        <p className="text-amber-300 font-semibold text-sm">
          For Microscopy Use Only
        </p>
        <p className="text-amber-400/70 text-xs mt-1 leading-relaxed">
          These products are sold for microscopy, taxonomy, and preservation
          purposes only. All cultures and spore products are intended for
          laboratory observation and genetic preservation — not for human
          consumption or illegal cultivation.
        </p>
      </div>
    </div>
  );
}
