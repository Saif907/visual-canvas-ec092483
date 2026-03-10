

## UI Design Skins for TradePulse

The goal is to create 3 completely distinct UI "skins" (design systems) that users can switch between from the Theme Settings panel. Each skin transforms the entire look: sidebar shape, header style, card design, background textures, border treatments, shadows, spacing, and color palette — not just a color swap.

### The 3 New Skins

**1. "Midnight Glass" — Ultra-dark glassmorphism with neon accents**
- Background: near-black (#0A0A0F) with subtle blue-purple gradient noise
- Cards: frosted glass with `backdrop-blur`, semi-transparent backgrounds, soft glowing borders
- Sidebar: transparent glass panel with a subtle vertical gradient, no hard border — uses a soft glow edge
- Header: floating pill-shaped bar with glass effect, detached from edges with margin
- Border radius: 20px (pill-like), very rounded
- Active nav items: neon glow underline instead of background highlight
- Accent colors: electric violet + mint green
- Shadows: colored glow shadows (purple/blue tint)
- Cards get a subtle 1px gradient border (transparent -> accent)

**2. "Carbon Terminal" — Hacker/terminal aesthetic, sharp and minimal**
- Background: pure black (#000000) with subtle dot-grid pattern
- Cards: sharp corners (4px radius), thin 1px borders, no shadows — flat and utilitarian
- Sidebar: full-height with a bright accent left-edge stripe (2px), monospace-feeling labels
- Header: minimal top bar with bottom accent line, no background — just a thin separator
- Border radius: 4px (sharp, technical)
- Active nav items: left-edge accent bar + subtle text highlight
- Accent colors: matrix green (#00FF88) + warm amber for warnings
- Typography feel: tighter letter-spacing, uppercase section labels
- Cards use a subtle scanline/noise texture overlay

**3. "Soft Depth" — Premium soft UI with layered depth**
- Background: dark charcoal (#141418) with warm undertones
- Cards: elevated with multi-layer shadows (3 shadow levels), slightly raised feel
- Sidebar: wider padding, rounded nav items with soft inset shadows when active
- Header: solid background matching sidebar, thick bottom shadow for depth separation
- Border radius: 12px, softer than current but not pill-shaped
- Active nav items: filled rounded pill with soft shadow
- Accent colors: gold/amber (#F5A623) + soft cream highlights
- Shadows: warm-tinted layered shadows (not blue-cool)
- Borders: very subtle, almost invisible — depth comes from shadows not lines

### Architecture

**How it works technically:**

1. **Extend ThemeContext** — Add a new `skin` state (`"default" | "midnight-glass" | "carbon-terminal" | "soft-depth"`) persisted to localStorage.

2. **CSS approach** — Each skin gets a CSS class applied to `<html>` (e.g., `.skin-midnight-glass`). This class overrides:
   - All CSS custom properties (colors, radius, borders)
   - Sidebar/card/header boundary classes
   - Scrollbar styles
   - Background patterns via pseudo-elements

3. **Component-level skin awareness** — For structural differences (sidebar glow vs stripe, header floating vs attached), components read the `skin` value from context and conditionally apply different class sets. This keeps the JSX structure the same but swaps the visual treatment.

4. **ThemeSettings panel** — Add a new "UI Design" section above Presets showing 3 skin preview cards (small visual thumbnails). Selecting one applies the skin class + overrides. The current design stays as "Classic" (default).

### Files to Create/Modify

- **`src/index.css`** — Add `.skin-midnight-glass`, `.skin-carbon-terminal`, `.skin-soft-depth` blocks with full variable overrides + utility classes for each skin's unique effects (glass borders, dot-grid bg, layered shadows)
- **`src/contexts/ThemeContext.tsx`** — Add `skin` state, `setSkin`, apply skin class to root, persist to localStorage
- **`src/components/ThemeSettings.tsx`** — Add "UI Design" skin selector section with visual preview cards
- **`src/components/DashboardSidebar.tsx`** — Conditionally apply skin-specific classes (glass panel, accent stripe, soft-depth padding)
- **`src/components/DashboardHeader.tsx`** — Conditionally apply floating/minimal/depth header styles per skin
- **`src/components/MetricCard.tsx`** — Apply skin-aware card boundary classes

Each skin redefines every CSS variable so all existing components automatically inherit the new palette. Structural tweaks in sidebar/header/cards use the skin context value for conditional classNames.

