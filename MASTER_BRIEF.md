# MASTER_BRIEF — Watch360 Social Dashboard Series

## 0. Vibe

> Market Intelligence meets Executive Design.
> Apple × McKinsey aesthetic — structured, calm, authoritative.
> No startup flash. No neon. No gradients.

**Mood:** Premium analytics. Dark minimalism. Data with breath.

---

## 1. Design System

### Colors
| Token | Value | Usage |
|---|---|---|
| `--color-gold` | `#A98155` | Brand accent, headlines, active states |
| `--color-charcoal` | `#3A3935` | Primary text, dark elements |
| `--color-sand` | `#F0EFEE` | Slide background |
| `--color-muted` | `#9A9793` | Secondary text, labels |
| `--color-line` | `rgba(58,57,53,0.12)` | Dividers |

### Typography
- **Font:** Lato (from Figma spec — non-negotiable)
- **Weights:** 300 (Light) / 400 (Regular) / 700 (Bold) / 900 (Black)
- **Hero headline:** 88px / weight 400 / uppercase / leading 1.05
- **Stat numbers:** 122px / weight 400 / uppercase / leading 1.05
- **Date:** 32px / weight 700 / uppercase / leading 1.3

### Layout
- **Slide format:** 1080 × 1350px (4:5 — Instagram/LinkedIn)
- **Horizontal margins:** 100px both sides
- **Logo position:** top 105px / left 100px
- **Progressive disclosure:** top → headline → stats → insights → footer

### Motion (Phase 2)
- Calm, precise, executive
- Spring physics: `stiffness: 100, damping: 20`
- Stagger: 80ms between children
- Duration: 450ms base ease

---

## 2. Component Registry

| Component | Status | Node ID |
|---|---|---|
| `HeroSlide` | DRAFT | 14421:61188 |
| `BrandActivitySlide` | PLANNED | — |
| `PriceSegmentationSlide` | PLANNED | — |
| `MovementTrendsSlide` | PLANNED | — |

---

## 3. Tech Stack

- Vite 6 + React 19 + TypeScript
- Framer Motion (installed, Phase 2 active)
- CSS Modules (no Tailwind — fixed-size slides)
- Data: JSON → typed props → component

---

## 4. Asset Locations

```
public/
  assets/
    logos/
      watch360-symbol.svg   ✅ Downloaded
      watch360-wordmark.svg ✅ Downloaded
    icons/                  (reserved)
src/
  data/
    hero-slide.json         ✅ Created
```
