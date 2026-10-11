import { Suspense } from 'react';

import { AuthGuard } from '@/features/auth/guards/AuthGuard';
import SeatSelection from '@/features/seats/components/SeatSelection';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

const SeatSelectionContent = async ({ params }: PageProps) => {
  const { sessionId } = await params;

  return (
    <AuthGuard>
      <SeatSelection sessionId={sessionId} />
    </AuthGuard>
  );
};

const SeatsPage = ({ params }: PageProps) => (
  <main className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-[120px] sm:px-10">
    <Suspense fallback={<p role="status" className="text-[#A9A9A9]">Loading session…</p>}>
      <SeatSelectionContent params={params} />
    </Suspense>
  </main>
);

export default SeatsPage;
