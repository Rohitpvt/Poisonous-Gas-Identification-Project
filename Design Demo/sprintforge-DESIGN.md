---
version: 1.0.0
name: SprintForge System
description: A precision-oriented visual framework for AI product development studios using high-contrast surfaces and tactile depth.

colors:
  background: "#ECEDEE"
  surface-light: "#F4F5F5"
  surface-dark: "#171719"
  surface-card: "#FFFFFF"
  brand-primary: "#E34A32"
  brand-accent: "#F05A3C"
  text-primary: "#232427"
  text-secondary: "#55575c"
  text-muted: "#8a8c91"
  border-light: "rgba(0,0,0,0.05)"
  border-white: "rgba(255,255,255,0.7)"

typography:
  display-xl:
    fontFamily: "Inter"
    fontSize: "96px"
    fontWeight: 600
    lineHeight: "1.02"
  display-lg:
    fontFamily: "Inter"
    fontSize: "72px"
    fontWeight: 600
    lineHeight: "1.02"
  heading-accent:
    fontFamily: "Instrument Serif"
    fontSize: "105%"
    fontWeight: 400
    fontStyle: "italic"
  body-lg:
    fontFamily: "Inter"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "1.6"
  body-sm:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "1.4"

spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "40px"
  container-pt: "16px"

rounded:
  sm: "12px"
  md: "16px"
  lg: "28px"
  xl: "40px"
  full: "999px"

components:
  floating-nav:
    background: "rgba(255,255,255,0.75)"
    blur: "20px"
    rounded: "999px"
    border: "1px solid rgba(255,255,255,0.7)"
  card-elevated:
    background: "#FFFFFF"
    rounded: "28px"
    shadow: "0 14px 30px -18px rgba(35,36,39,0.25)"
  button-primary:
    background: "#171719"
    text: "#FFFFFF"
    rounded: "999px"
    shadow: "inset 0 1px 0 rgba(255,255,255,0.25)"
  stat-pill:
    background: "#FFFFFF"
    rounded: "999px"
    padding: "28px 32px"

motion:
  rise-reveal:
    transform: "translateY(16px)"
    opacity: 0
    duration: "700ms"
    easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  drift-parallax:
    duration: "infinite"
    amplitude: "6px"
---

## Overview
SprintForge is a high-performance visual system designed for AI agencies. It emphasizes speed through "sprint" metaphors, using heavy shadows, glassmorphism, and high-energy orange accents to suggest momentum and technical reliability.

## Colors
The palette relies on an off-white background (#ECEDEE) to make pure white cards and dark charcoal surfaces (#171719) pop. The brand red (#E34A32) is used sparingly for action items, status indicators, and critical visual hooks.

## Typography
Features a dual-font strategy: Inter for all technical and body information, and Instrument Serif for organic, human-centric emphasis within headlines. Letter-spacing on headings should be tightened (-0.035em).

## Spacing
Follows an adaptive scale with large outer padding for page shells (16px on mobile/desktop) and generous internal section gaps (96px to 128px) to maintain a premium, airy feel.

## Layout
Layouts are container-based with a maximum width of 1440px. Components should use flex and grid systems that stack early for mobile devices, prioritizing vertical rhythm.

## Elevation & Depth
Depth is achieved through multiple layers: 3D background meshes, blurred bloom overlays, and multi-layered box shadows that include white inner highlights to simulate beveled edges.

## Shapes
Outer containers use extreme corner rounding (28px to 40px), while internal elements like buttons and chips utilize full pill-rounding (999px). Cards and secondary elements use a medium radius (16px to 24px).

## Components
- **Navigation:** Centered floating pills with high transparency and backdrop filters.
- **Hero Section:** Full-bleed background containers with 3D canvas elements and organic bloom effects.
- **Service Cards:** White-on-white layered effects with high-contrast icon containers.
- **Pricing Blocks:** Three-column grid with a highlighted center item using inverted colors (Dark Surface).

## Motion
Elements enter the viewport with a synchronized "Rise" effect (upward translation + opacity). Floating items like icons should have a continuous, slow-speed vertical drift to simulate an "AI life" atmosphere.

## Do's and Don'ts
- **Do:** Use white inner shadows on dark components to create a premium "hardware" look.
- **Do:** Mix serif italics into sans-serif headlines for high-impact brand statements.
- **Don't:** Use sharp 90-degree corners or thin borders; keep shapes soft and tactile.
- **Don't:** Use pure blacks; stick to the specified charcoal (#171719).

## Accessibility
Ensure the brand red (#E34A32) is only used for text when the font size is large enough to meet contrast ratios against light backgrounds. Use backdrop-blur carefully to ensure text over imagery remains legible.