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
          data-testid="size-grid"
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
                data-testid={isSoldOut ? "size-button-sold-out" : "size-button"}
                role="radio"
                aria-checked={isSelected}
                aria-disabled={isSoldOut ? "true" : undefined}
                aria-label={ariaLabel}
                tabIndex={isSoldOut ? -1 : 0}
                onClick={isSoldOut ? undefined : () => handleSelectSize(item)}
                className={[
                  "relative h-[48px] w-full rounded-[14px] border px-1 text-[11px] leading-none tracking-[-0.01em] flex items-center justify-center select-none touch-manipulation transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1",
                  isSoldOut
                    ? "bg-[#F5F5F7] text-[#52525B] border-dashed border-[#D1D1D6] cursor-not-allowed"
                    : isSelected
                      ? "bg-[#111111] text-white border-[#111111] font-semibold shadow-[0_4px_12px_rgba(17,17,17,0.18)] active:scale-[0.96] cursor-pointer"
                      : "bg-white text-[#111111] border-[#E2E2E6] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#111111] hover:shadow-[0_2px_6px_rgba(0,0,0,0.06)] active:scale-[0.96] cursor-pointer",
                ].join(" ")}
              >
                <span className={isSoldOut ? "line-through decoration-[#52525B]/85 decoration-[1.5px]" : undefined}>
                  {item.size_label}
                </span>
                {isSoldOut && <span className="sr-only">, sold out</span>}
                {isLowStock && (
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute top-[4px] right-[5px] rounded-full px-1.5 py-[1.5px] text-[7.5px] font-bold uppercase leading-none tracking-[0.06em]",
                      isSelected
                        ? "bg-[#CEFF00] text-[#111111]"
                        : "bg-[#CEFF00]/85 text-[#111111] ring-1 ring-[#B8E600]/60",
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
            "h-[56px] w-full rounded-full text-[15px] font-semibold tracking-[-0.01em] flex items-center justify-center gap-2 touch-manipulation transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2",
            !selectedSize
              ? "bg-[#F5F5F7] text-[#6E6E73] border border-[#E5E5EA] cursor-not-allowed"
              : justAdded
                ? "bg-[#CEFF00] text-[#111111] border border-[#B8E600] shadow-[0_6px_16px_rgba(206,255,0,0.3)] cursor-pointer"
                : "bg-[#111111] text-white hover:bg-[#1D1D1F] active:scale-[0.98] shadow-[0_6px_16px_rgba(17,17,17,0.16)] cursor-pointer",
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
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Added</span>
            </>
          ) : (
            <>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                className="w-4 h-4 shrink-0 opacity-90"
              >
                <path
                  d="M4 5.5H12L12.75 13H3.25L4 5.5Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 5.5V4.5C6 3.39543 6.89543 2.5 8 2.5C9.10457 2.5 10 3.39543 10 4.5V5.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <span>{`Add size ${selectedSize.size_label} to bag`}</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
