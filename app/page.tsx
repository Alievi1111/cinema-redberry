import ComingSoon from '@/features/home/components/composites/ComingSoon';
import Hero from '@/features/home/components/composites/Hero';
import NowPlaying from '@/features/home/components/composites/NowPlaying';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <NowPlaying />
      <ComingSoon />
    </main>
  );
}
