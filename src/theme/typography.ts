/**
 * Lingua Design System - Typography Tokens
 * Source: 01-design-system.png
 */

export const fontFamilies = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const typeScale = {
  h1: {
    name: "H1",
    usage: "Page / Screen Title",
    fontSize: 32,
    lineHeight: 38.4,
    fontWeight: "700" as const,
    fontFamily: fontFamilies.bold,
  },
  h2: {
    name: "H2",
    usage: "Section Title",
    fontSize: 24,
    lineHeight: 31.2,
    fontWeight: "600" as const,
    fontFamily: fontFamilies.semiBold,
  },
  h3: {
    name: "H3",
    usage: "Card / Module Title",
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600" as const,
    fontFamily: fontFamilies.semiBold,
  },
  h4: {
    name: "H4",
    usage: "Subheading",
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: "500" as const,
    fontFamily: fontFamilies.medium,
  },
  bodyLarge: {
    name: "Body Large",
    usage: "Important content",
    fontSize: 16,
    lineHeight: 25.6,
    fontWeight: "400" as const,
    fontFamily: fontFamilies.regular,
  },
  bodyMedium: {
    name: "Body Medium",
    usage: "Body text",
    fontSize: 14,
    lineHeight: 22.4,
    fontWeight: "400" as const,
    fontFamily: fontFamilies.regular,
  },
  bodySmall: {
    name: "Body Small",
    usage: "Supporting text",
    fontSize: 13,
    lineHeight: 20.8,
    fontWeight: "400" as const,
    fontFamily: fontFamilies.regular,
  },
  caption: {
    name: "Caption",
    usage: "Labels, meta text",
    fontSize: 11,
    lineHeight: 15.4,
    fontWeight: "400" as const,
    fontFamily: fontFamilies.regular,
  },
} as const;

export type TypeScale = typeof typeScale;
export type TypographyVariant = keyof typeof typeScale;
