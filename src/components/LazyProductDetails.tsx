"use client";

import dynamic from "next/dynamic";
import { ReviewsSkeleton, TechCopySkeleton } from "@/components/SectionSkeletons";

const ReviewsSection = dynamic(() => import("@/components/ReviewsSection"), {
  ssr: false,
  loading: () => <ReviewsSkeleton />,
});

const TechCopySection = dynamic(() => import("@/components/TechCopySection"), {
  ssr: false,
  loading: () => <TechCopySkeleton />,
});

interface LazyProductDetailsProps {
  styleCode: string;
}

export default function LazyProductDetails({
  styleCode,
}: LazyProductDetailsProps) {
  return (
    <>
      <ReviewsSection />
      <TechCopySection styleCode={styleCode} />
    </>
  );
}
