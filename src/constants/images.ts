import mascot from "@/assets/images/mascot.png";
import mascotLogo from "@/assets/images/mascot-logo.png";
import onboardingIllustration from "@/assets/images/onboarding-illustration.png";

export const images = {
  mascot,
  mascotLogo,
  onboardingIllustration,
} as const;

export type ImageKey = keyof typeof images;
