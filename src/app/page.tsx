import { HeroSection } from '@/components/home/HeroSection';
import { ConceptSection } from '@/components/home/ConceptSection';
import { OakMissionSection } from '@/components/home/OakMissionSection';
import { IronAnvilSection } from '@/components/home/IronAnvilSection';
import { FeaturedSeries } from '@/components/home/FeaturedSeries';
import { HostsSection } from '@/components/home/HostsSection';
import { SponsorsSection } from '@/components/home/SponsorsSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ConceptSection />
      <OakMissionSection />
      <IronAnvilSection />
      <FeaturedSeries />
      <HostsSection />
      <SponsorsSection />
    </>
  );
}
