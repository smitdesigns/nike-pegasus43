const TECH_SPECS = [
  {
    label: "Cushioning",
    detail: "Dual Air Zoom units + ReactX foam midsole",
  },
  {
    label: "Upper",
    detail: "Engineered mesh with midfoot containment",
  },
  {
    label: "Traction",
    detail: "High-abrasion Waffle rubber road grip",
  },
  {
    label: "Profile",
    detail: "10 mm drop · Neutral daily road trainer",
  },
];

interface TechCopySectionProps {
  styleCode: string;
}

export default function TechCopySection({ styleCode }: TechCopySectionProps) {
  return (
    <section
      aria-label="Product specifications"
      className="mt-6 pt-6 border-t border-[#E5E5E5] h-[280px] overflow-hidden"
    >
      <div className="flex items-center justify-between h-[24px]">
        <h2 className="text-[16px] leading-[24px] font-bold tracking-[-0.01em] text-[#111111]">
          Tech &amp; Specs
        </h2>
        <span className="rounded-full bg-[#F5F5F5] px-2.5 py-0.5 text-[11px] font-medium text-[#707072]">
          {styleCode}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 grid-rows-2 gap-2.5 h-[196px]">
        {TECH_SPECS.map((spec) => (
          <div
            key={spec.label}
            className="rounded-2xl bg-[#F5F5F5] p-3 flex flex-col justify-between overflow-hidden"
          >
            <dt className="text-[11px] leading-[14px] font-bold uppercase tracking-wider text-[#707072]">
              {spec.label}
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
