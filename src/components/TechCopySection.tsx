const TECH_SPECS = [
  {
    label: "Cushioning",
    detail: "Dual Air Zoom units + ReactX foam midsole",
    iconPath: "M3 9.5C5.5 7 10.5 7 13 9.5M4.5 12H11.5",
  },
  {
    label: "Upper",
    detail: "Engineered mesh with midfoot containment",
    iconPath: "M3.5 5.5L8 3.5L12.5 5.5V10.5L8 12.5L3.5 10.5V5.5Z",
  },
  {
    label: "Traction",
    detail: "High-abrasion Waffle rubber road grip",
    iconPath: "M3.5 5.5H12.5M3.5 8.5H12.5M3.5 11.5H12.5M6.5 4V12.5M9.5 4V12.5",
  },
  {
    label: "Profile",
    detail: "10 mm drop · Neutral daily road trainer",
    iconPath: "M3 11.5L13 5.5M13 5.5V11.5H3",
  },
];

interface TechCopySectionProps {
  styleCode: string;
}

export default function TechCopySection({ styleCode }: TechCopySectionProps) {
  return (
    <section
      aria-label="Product specifications"
      className="mt-6 pt-6 border-t border-[#E5E5EA] h-[280px] overflow-hidden"
    >
      <div className="flex items-center justify-between h-[24px]">
        <h2 className="text-[16px] leading-[24px] font-bold tracking-[-0.015em] text-[#111111]">
          Tech &amp; Specs
        </h2>
        <span className="rounded-full bg-[#F5F5F7] border border-[#EBEBEF] px-2.5 py-0.5 text-[11px] font-medium text-[#6E6E73]">
          {styleCode}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 grid-rows-2 gap-2.5 h-[196px]">
        {TECH_SPECS.map((spec) => (
          <div
            key={spec.label}
            className="rounded-[18px] bg-[#F5F5F7] border border-[#EBEBEF] p-3 flex flex-col justify-between overflow-hidden"
          >
            <dt className="flex items-center gap-1.5 text-[10.5px] leading-[14px] font-bold uppercase tracking-[0.06em] text-[#6E6E73]">
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                className="w-3.5 h-3.5 text-[#111111] shrink-0"
              >
                <path
                  d={spec.iconPath}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{spec.label}</span>
            </dt>
            <dd className="text-[12.5px] leading-[17px] font-medium text-[#111111] line-clamp-3">
              {spec.detail}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
