import mascot from "@/assets/images/mascot.png";
import mascotLogo from "@/assets/images/mascot-logo.png";
import mascotPeeking from "@/assets/images/mascot-peeking.png";
import onboardingIllustration from "@/assets/images/onboarding-illustration.png";
import googleIcon from "@/assets/images/google-icon.png";
import facebookIcon from "@/assets/images/facebook-icon.png";
import appleIcon from "@/assets/images/apple-icon.png";
import earth from "@/assets/images/earth.png";
import treasure from "@/assets/images/treasure.png";
import palace from "@/assets/images/palace.png";
import streakFire from "@/assets/images/streak-fire.png";

export const images = {
  mascot,
  mascotLogo,
  mascotPeeking,
  onboardingIllustration,
  googleIcon,
  facebookIcon,
  appleIcon,
  earth,
  treasure,
  palace,
  streakFire,
} as const;

export type ImageKey = keyof typeof images;
