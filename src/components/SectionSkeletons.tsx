export function ReviewsSkeleton() {
  return (
    <section
      aria-label="Loading reviews"
      className="mt-6 pt-6 border-t border-[#E5E5EA] h-[384px] overflow-hidden"
    >
      <div className="flex items-center justify-between h-[28px]">
        <div className="h-4 w-20 rounded-full bg-[#EFEFF2]" />
        <div className="h-6 w-24 rounded-full bg-[#EFEFF2]" />
      </div>
      <div className="mt-3 space-y-2.5">
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            className="h-[96px] rounded-[18px] bg-[#F5F5F7] border border-[#EBEBEF] p-3.5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#E5E5EA]" />
                <div className="h-3 w-20 rounded-full bg-[#E5E5EA]" />
              </div>
              <div className="h-3 w-16 rounded-full bg-[#E5E5EA]" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded-full bg-[#E5E5EA]" />
              <div className="h-3 w-4/5 rounded-full bg-[#E5E5EA]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TechCopySkeleton() {
  return (
    <section
      aria-label="Loading product specifications"
      className="mt-6 pt-6 border-t border-[#E5E5EA] h-[280px] overflow-hidden"
    >
      <div className="flex items-center justify-between h-[24px]">
        <div className="h-4 w-28 rounded-full bg-[#EFEFF2]" />
        <div className="h-5 w-20 rounded-full bg-[#EFEFF2]" />
      </div>
      <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-2.5 h-[196px]">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="rounded-[18px] bg-[#F5F5F7] border border-[#EBEBEF] p-3 flex flex-col justify-between"
          >
            <div className="h-3 w-16 rounded-full bg-[#E5E5EA]" />
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded-full bg-[#E5E5EA]" />
              <div className="h-3 w-3/4 rounded-full bg-[#E5E5EA]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
