const REVIEWS = [
  {
    id: "rev-1",
    initial: "M",
    author: "Maya K.",
    date: "2d ago",
    stars: 5,
    rating: "★★★★★",
    body: "Snappy toe-off on tempo miles and plenty of cushion for Sunday long runs. True to size.",
  },
  {
    id: "rev-2",
    initial: "D",
    author: "Devon R.",
    date: "1w ago",
    stars: 5,
    rating: "★★★★★",
    body: "The ReactX midsole feels noticeably livelier than the 41. Great grip on wet pavement.",
  },
  {
    id: "rev-3",
    initial: "E",
    author: "Elena T.",
    date: "2w ago",
    stars: 4,
    rating: "★★★★☆",
    body: "Breathable upper and secure midfoot lockdown right out of the box with zero heel slip.",
  },
];

export default function ReviewsSection() {
  return (
    <section
      aria-label="Customer reviews"
      className="mt-6 pt-6 border-t border-[#E5E5E5] h-[384px] overflow-hidden"
    >
      <div className="flex items-center justify-between h-[28px]">
        <h2 className="text-[16px] font-bold tracking-[-0.01em] text-[#111111]">
          Reviews
        </h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2.5 py-1 text-[12px] font-semibold text-[#111111]">
          <span>★ 4.8</span>
          <span className="text-[#707072] font-normal">(142)</span>
        </span>
      </div>
      <div className="mt-3 space-y-2.5">
        {REVIEWS.map((review) => (
          <article
            key={review.id}
            className="h-[96px] rounded-2xl bg-[#F5F5F5] p-3.5 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  aria-hidden="true"
                  className="w-5 h-5 rounded-full bg-[#111111] text-[#CEFF00] text-[10px] font-bold flex items-center justify-center shrink-0"
                >
                  {review.initial}
                </span>
                <span className="font-semibold text-[#111111] truncate">
                  {review.author}
                </span>
                <span className="text-[#707072]">· {review.date}</span>
              </div>
              <span
                className="font-semibold text-[#111111] tracking-tight shrink-0"
                aria-label={`${review.stars} out of 5 stars`}
              >
                {review.rating}
              </span>
            </div>
            <p className="text-[12.5px] leading-[17px] text-[#3F3F46] line-clamp-2">
              {review.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
