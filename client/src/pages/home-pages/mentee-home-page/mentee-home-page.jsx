import { 
  HeroSection, 
  StatsSection, 
  MentorShowcase, 
  MentorshipTimeline, 
  EarlySupporters,
  MentorShowcaseRating
} from '@/components/home-components';

export const MentorHome = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <MentorShowcase />
      <MentorShowcaseRating />
      <MentorshipTimeline />
      <EarlySupporters />
    </>
  );
};
