# AI Design Guide: Tic-Tac-Toe (Ttt) Project

This document provides a comprehensive design framework for AI-driven UI/UX development. It outlines the visual identity, technical constraints, and interaction patterns of the "Ttt" platform.

## 1. Project Vision
*   **Name**: Ttt (Tic-Tac-Toe)
*   **Concept**: A high-energy, modern re-imagining of the classic Tic-Tac-Toe game.
*   **Target**: Players looking for quick, visually stimulating, and "juicy" arcade-style gaming experiences.
*   **Core Values**: Playful, High-Energy, Responsive, and Bold.

## 2. Visual Identity: Neo-Brutalism & Retro Arcade
The project follows a **Neo-Brutalist** design language combined with **Retro Arcade** aesthetics.

### Key Visual Rules:
*   **Heavy Strokes**: All UI containers, cards, and text headings must have a solid black border (minimum `2px`).
*   **Sharp Shadows**: Use hard, non-blurry shadows (e.g., `6px 6px 0px #000000`).
*   **Color Palette (OKLCH)**:
    *   **Primary**: Vibrant Yellow/Orange (`oklch(87.769% 0.16641 95.738)`)
    *   **Accent**: Deep Purple/Blue (`oklch(48.8% 0.243 264.376)`)
    *   **Background**: Soft Beige/Off-white (`oklch(96.425% 0.01597 357.64)`)
*   **Typography**:
    *   **Headings**: "Luckiest Guy" (Comic-style, bold, rounded)
    *   **Body**: "CookieRun" or high-legibility sans-serif fonts.

## 3. UI Component Specifications
*   **Brutal Buttons/Cards**: Must include a "Press" interaction. On hover/active, the shadow disappears, and the element translates (e.g., `translate(5px, 5px)`).
*   **Game Grid**: A 3x3 layout where each cell is an individual "Brutal Box". Use popping animations when a mark (X or O) is placed.
*   **Avatars**: Utilize animated emoji characters (WebM format) to express player emotions and game states.

## 4. Technical Stack
*   **Framework**: React (TypeScript), Vite
*   **Styling**: **Tailwind CSS v4** (Utility-first, using modern `@theme` variables)
*   **Animation**: **Framer Motion** & **GSAP** (Focus on "juicy" and elastic transitions)
*   **Icons**: Lucide-React
*   **UI Library**: Custom components based on Radix UI / Shadcn UI with Neo-Brutalist styling.

## 5. AI Prompt Templates

### For UI/UX Generation (e.g., v0.dev, Claude Artifacts)
> "Create a [Component Name] for a Neo-Brutalist Tic-Tac-Toe game. Use Tailwind CSS v4. The design must feature:
> 1. Heavy 2px black borders on all interactive elements.
> 2. Hard 5px black drop shadows with zero blur.
> 3. A high-contrast color scheme using vibrant yellow (#f1d246) and deep purple.
> 4. Playful typography using 'Luckiest Guy' font.
> 5. A 'push' effect on hover where the element moves into its shadow.
> The vibe should be 'Juicy'—highly responsive with elastic animations."

### For Visual Assets (e.g., Midjourney, DALL-E)
> "Neo-Brutalism graphic design for a Tic-Tac-Toe game, vibrant yellow and purple palette, thick black outlines, flat design, comic book style, high energy, arcade aesthetic, 2D vector art, clean lines, white background."

---
*Created for Gemini CLI AI Design Integration*
