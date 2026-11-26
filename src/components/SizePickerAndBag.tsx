"use client";

import { useEffect, useRef, useState } from "react";
import type { ShoeSizeEntry } from "@/types/shoe";

interface SizePickerAndBagProps {
  sizes: ShoeSizeEntry[];
}

const STOCK_LABEL_MAP: Record<ShoeSizeEntry["stock_status"], string> = {
  in_stock: "in stock",
  low_stock: "low stock",
  sold_out: "sold out",
};

export default function SizePickerAndBag({ sizes }: SizePickerAndBagProps) {
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const selectedSize = sizes.find((item) => item.sku === selectedSku) ?? null;

  const handleSelectSize = (item: ShoeSizeEntry) => {
    if (item.stock_status === "sold_out") return;
    setSelectedSku(item.sku);
    setJustAdded(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleAddToBag = () => {
    if (!selectedSize) return;
    setJustAdded(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setJustAdded(false);
      timerRef.current = null;
    }, 1500);
  };

  return (
    <>
      <section aria-label="Shoe sizes" className="h-[496px]">
        <div
          role="radiogroup"
          aria-label="Select shoe size"
          className="grid grid-cols-3 grid-rows-9 gap-2 h-[496px]"
        >
          {sizes.map((item) => {
            const isSoldOut = item.stock_status === "sold_out";
            const isLowStock = item.stock_status === "low_stock";
            const isSelected = selectedSku === item.sku;
            const ariaLabel = `${item.size_label}, ${STOCK_LABEL_MAP[item.stock_status]}`;

            return (
              <button
                key={item.sku}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-disabled={isSoldOut ? "true" : undefined}
                aria-label={ariaLabel}
                tabIndex={isSoldOut ? -1 : 0}
                onClick={isSoldOut ? undefined : () => handleSelectSize(item)}
                className={[
                  "relative h-[48px] w-full rounded-xl border px-1 text-[11px] leading-none tracking-[-0.01em] flex items-center justify-center select-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1",
                  isSoldOut
                    ? "bg-[#F5F5F5] text-[#A1A1AA] border-[#EBEBEB] opacity-65 cursor-not-allowed"
                    : isSelected
                      ? "bg-[#111111] text-white border-[#111111] font-semibold shadow-sm active:scale-[0.97] cursor-pointer"
                      : "bg-white text-[#111111] border-[#E5E5E5] font-medium hover:border-[#111111] hover:bg-[#FAFAFA] active:scale-[0.97] cursor-pointer",
                ].join(" ")}
              >
                <span className={isSoldOut ? "line-through decoration-[#A1A1AA]" : undefined}>
                  {item.size_label}
                </span>
                {isLowStock && (
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute top-1 right-1 rounded px-1 py-[1px] text-[8px] font-bold uppercase leading-none tracking-wider",
                      isSelected
                        ? "bg-[#CEFF00] text-[#111111]"
                        : "bg-[#CEFF00]/75 text-[#111111]",
                    ].join(" ")}
                  >
                    low
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-4 h-[56px]">
        <button
          type="button"
          disabled={!selectedSize}
          onClick={handleAddToBag}
          aria-live="polite"
          className={[
            "h-[56px] w-full rounded-full text-[15px] font-semibold tracking-[-0.01em] flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2",
            !selectedSize
              ? "bg-[#F5F5F5] text-[#A1A1AA] border border-[#E5E5E5] cursor-not-allowed"
              : justAdded
                ? "bg-[#CEFF00] text-[#111111] border border-[#B8E600] shadow-sm cursor-pointer"
                : "bg-[#111111] text-white hover:bg-[#27272A] active:scale-[0.99] shadow-sm cursor-pointer",
          ].join(" ")}
        >
          {!selectedSize ? (
            "Add to bag"
          ) : justAdded ? (
            <>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                className="w-4 h-4 shrink-0"
              >
                <path
                  d="M3.5 8.5L6.5 11.5L12.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Added</span>
            </>
          ) : (
            `Add size ${selectedSize.size_label} to bag`
          )}
        </button>
      </div>
    </>
  );
}
