import ComingSoon from '@/features/home/components/composites/ComingSoon';
import Hero from '@/features/home/components/composites/Hero';
import NowPlaying from '@/features/home/components/composites/NowPlaying';
import RecentlyViewed from '@/features/recently-viewed/components/RecentlyViewed';

export default function HomePage() {
  return (
    <main className="flex flex-col gap-[40px]">
      <div>
        <Hero />
        <RecentlyViewed />
      </div>
      <NowPlaying />
      <div className="bg-[#2A2C3D] w-full h-[1px]" />
      <ComingSoon />
    </main>
  );
}
