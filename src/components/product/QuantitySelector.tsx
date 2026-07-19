"use client";

interface Props {
  quantity: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
}: Props) {
  const decrement = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const increment = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= min && val <= max) {
      onChange(val);
    }
  };

  return (
    <div>
      <label className="text-sm text-neutral-400 font-medium mb-2 block">
        Quantity
      </label>
      <div className="flex items-center gap-0">
        <button
          onClick={decrement}
          disabled={quantity <= min}
          className="w-10 h-10 flex items-center justify-center rounded-l-lg border border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInput}
          min={min}
          max={max}
          className="w-16 h-10 text-center border-y border-neutral-700 bg-neutral-800/50 text-white text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={increment}
          disabled={quantity >= max}
          className="w-10 h-10 flex items-center justify-center rounded-r-lg border border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}
