import CasinoReviewPage from "@/components/casino-review-page";

export default function ReviewPage({
  params,
}: {
  params: { id: string };
}) {
  return <CasinoReviewPage casinoId={params.id} />;
}


