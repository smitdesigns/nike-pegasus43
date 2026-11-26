import rawSizes from "@data/pegasus-sizes.json";
import LazyProductDetails from "@/components/LazyProductDetails";
import SizePickerAndBag from "@/components/SizePickerAndBag";
import type { ShoeSizeEntry } from "@/types/shoe";

export default function Pegasus43Page() {
  const sizes = [...(rawSizes as ShoeSizeEntry[])].sort(
    (a, b) => a.display_order - b.display_order,
  );

  const first = sizes[0];
  const productName = first.product_name;
  const colorway = first.colorway;
  const styleCode = first.style_code;
  const formattedPrice = Number.isInteger(first.price)
    ? `$${first.price}`
    : `$${first.price.toFixed(2)}`;

  return (
    <main className="max-w-[375px] mx-auto px-4 pb-8 bg-white">
      {/* 1. Photo: 4:3 box, 375 x 281 px */}
      <div className="-mx-4 w-[calc(100%+2rem)] h-[281px] bg-[#E5E5E5] overflow-hidden">
        <img
          data-testid="main-photo"
          src="/pegasus-43.svg"
          alt={`${productName} in ${colorway}`}
          width={375}
          height={281}
          decoding="async"
          fetchPriority="high"
          className="block w-full h-full object-cover"
        />
      </div>

      {/* 2. Name, colorway and price: 88 px tall */}
      <header className="h-[88px] flex flex-col justify-center overflow-hidden">
        <h1 className="text-[22px] leading-[26px] font-bold tracking-[-0.02em] text-[#111111] truncate">
          {productName}
        </h1>
        <p className="text-[14px] leading-[20px] font-normal text-[#707072] truncate mt-0.5">
          {colorway}
        </p>
        <p
          data-testid="price"
          className="text-[16px] leading-[22px] font-semibold text-[#111111] tabular-nums mt-0.5"
        >
          {formattedPrice}
        </p>
      </header>

      {/* 3. Size buttons (496 px) + 4. Add to bag (56 px) */}
      <SizePickerAndBag sizes={sizes} />

      {/* 5. Reviews + 6. Tech copy (lazy-loaded with fixed-height skeletons) */}
      <LazyProductDetails styleCode={styleCode} />
    </main>
  );
}
