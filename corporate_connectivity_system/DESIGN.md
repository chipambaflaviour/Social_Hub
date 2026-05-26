---
name: Corporate Connectivity System
colors:
  surface: '#fff8f7'
  surface-dim: '#e9d6d4'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ef'
  surface-container: '#fde9e8'
  surface-container-high: '#f8e4e2'
  surface-container-highest: '#f2dedd'
  on-surface: '#231919'
  on-surface-variant: '#564241'
  inverse-surface: '#392e2d'
  inverse-on-surface: '#ffedeb'
  outline: '#897170'
  outline-variant: '#dcc0bf'
  surface-tint: '#a13c3f'
  primary: '#410007'
  on-primary: '#ffffff'
  primary-container: '#630d16'
  on-primary-container: '#eb7475'
  inverse-primary: '#ffb3b1'
  secondary: '#465f88'
  on-secondary: '#ffffff'
  secondary-container: '#b6d0ff'
  on-secondary-container: '#3f5881'
  tertiary: '#001e2f'
  on-tertiary: '#ffffff'
  tertiary-container: '#00344d'
  on-tertiary-container: '#759dba'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b1'
  on-primary-fixed: '#410007'
  on-primary-fixed-variant: '#82252a'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#aec7f7'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#2e476f'
  tertiary-fixed: '#c8e6ff'
  tertiary-fixed-dim: '#a3cbea'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#204b65'
  background: '#fff8f7'
  on-background: '#231919'
  surface-variant: '#f2dedd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  gutter: 16px
---

## Brand & Style

The brand personality of this design system is authoritative yet accessible, designed to foster professional networking within a structured corporate environment. It evokes feelings of reliability, ambition, and community. 

The visual style is **Corporate / Modern**, prioritizing clarity and information density without overwhelming the user. It utilizes a clean, card-based architecture to organize complex social feeds, profiles, and data visualizations. By balancing traditional executive colors with a contemporary mobile-first layout, the system bridges the gap between institutional stability and modern digital engagement.

## Colors

The palette is anchored by **Deep Maroon**, used strategically for primary actions and brand presence to convey leadership. **Company Blue** serves as the structural anchor, used for navigation and secondary interactive elements to instill trust.

The background environment is primarily **White**, creating a clean "canvas" for information. **Light Grey** is used for background sections and borders to provide subtle grouping, while **Soft Blue** acts as a gentle highlight for selected states or background accents in components like notification badges or active tabs. 

Maintain a high contrast ratio for all text elements against background colors to ensure professional accessibility standards are met.

## Typography

This design system utilizes **Inter** for its neutral, systematic, and highly legible qualities across all device sizes. The typographic hierarchy is strictly defined to help users scan through large amounts of social and professional data.

Headlines should use heavier weights (600-700) to create clear section breaks, while body text remains at weight 400 for maximum readability in long-form posts or articles. Labels and metadata should use the smaller, medium-weight tokens to distinguish supplementary information from primary content.

## Layout & Spacing

The layout follows an **8px grid system** to maintain mathematical harmony across all components. For mobile devices, a 4-column fluid grid is employed with 16px side margins. On larger screens, the content transitions to a 12-column fixed-width container (max-width 1200px) to prevent line lengths from becoming unreadable.

Spacing should be used to group related content. For instance, elements within a post card use `sm` or `md` spacing, while the gap between separate cards in a feed uses `lg` spacing to provide clear visual separation.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layering**. Surfaces are categorized into three levels:

1.  **Level 0 (Floor):** The main background, using Light Grey.
2.  **Level 1 (Cards):** White surfaces with a very soft, diffused shadow (Blur: 12px, Y: 4px, Opacity: 4% Black) to indicate interactivity.
3.  **Level 2 (Overlays):** Modals or dropdowns with a more pronounced shadow (Blur: 24px, Y: 8px, Opacity: 8% Black) to sit clearly above the primary UI.

Avoid heavy black shadows; instead, use a slight blue tint in the shadow color (derived from Company Blue) to keep the depth feeling natural and integrated with the corporate palette.

## Shapes

The shape language uses a **Rounded** approach to soften the corporate aesthetic and make the platform feel more engaging. Standard components like buttons and cards feature an 8px (0.5rem) corner radius. 

Larger containers or prominent "call-to-action" sections may use a 16px (1rem) radius to stand out. Avatars must always be circular to provide a friendly, human element within the structured grid. Borders, when used, should be 1px wide and colored with the Light Grey or Soft Blue tokens to remain unobtrusive.

## Components

### Buttons
- **Primary:** Deep Maroon background with White text. Bold and authoritative.
- **Secondary:** Company Blue outline with Company Blue text. 
- **Ghost:** No background, Company Blue or Grey text, used for low-priority actions like "Cancel."

### Cards
Cards are the primary container for all feed items. They feature a White background, Level 1 shadow, and 8px-12px rounded corners. Content inside cards should be padded with 16px (`md`) spacing.

### Input Fields
Inputs use a Light Grey background with a subtle 1px border. On focus, the border transitions to Company Blue. Labels are placed above the field using the `label-md` typography token.

### Chips & Tags
Used for skills, interests, or categories. These utilize the Soft Blue accent background with Company Blue text, featuring a fully pill-shaped radius.

### Lists
Lists in profiles or settings should use 16px vertical padding and subtle 1px dividers. Icons within lists should be monochrome Company Blue to maintain a professional tone.

### Avatars
Always circular. On mobile, the standard size is 40px; on desktop profiles, it scales to 80px or 120px. Use a 2px White border when overlapping avatars (e.g., "Mutual Connections").