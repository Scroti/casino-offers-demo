import CasinoReviewPage from "@/components/casino-review-page";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CasinoReviewPage casinoId={id} />;
}


