import { HeroSection } from '@/components/home/HeroSection';
import { OakMissionSection } from '@/components/home/OakMissionSection';
import { IronAnvilSection } from '@/components/home/IronAnvilSection';
import { FeaturedSeries } from '@/components/home/FeaturedSeries';
import { HostsSection } from '@/components/home/HostsSection';
import { SponsorsSection } from '@/components/home/SponsorsSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <OakMissionSection />
      <IronAnvilSection />
      <FeaturedSeries />
      <HostsSection />
      <SponsorsSection />
    </>
  );
}
