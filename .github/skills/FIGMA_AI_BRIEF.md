# Figma AI Design Brief for TTT Client

## 0. How to use this document

Paste this brief into Figma AI and ask it to generate:

- Design system foundations (color, typography, spacing, effects)
- Core screens (Login, Lobby, Ready, Game, Modal)
- Shared UI component specs for a Headless UI architecture

Project: Web Tic-Tac-Toe client with Single and Multiplayer modes.
Tech context: React 19, TypeScript, Tailwind CSS 4, Zustand, socket.io-client.

## 1. Product concept

Create a playful, energetic, retro-arcade Tic-Tac-Toe experience with a neo-brutalist visual language.

Mood keywords:

- Retro arcade
- Neo-brutalism
- Handcrafted and bold
- Friendly competition
- Fast feedback

Do NOT produce generic SaaS visuals.
Do NOT use minimal gray corporate styling.

## 2. Visual direction

### Style DNA

- Thick black borders
- Hard drop shadows (offset, no blur by default)
- Saturated warm background with pattern
- Big rounded corners
- Loud, high-contrast CTA states
- Cartoon-like stickers, badges, playful icons

### Tone

- High energy, game-like, slightly chaotic but readable
- Casual and fun, not serious esports

### Layout feel

- Center-focused composition
- Decorative side objects (left/right accents) for desktop
- Keep mobile layouts clean and stacked

## 3. Design tokens (initial proposal)

### Color tokens

- color.dark.1: #383624
- color.dark.2: #282617
- color.primary: #3F3B00
- color.accent: #F8C031
- color.accent.2: #FCD256
- color.panel: #E1DEC7
- color.bubble.other: #ACA788
- color.danger: #FF0000
- color.white: #FFFFFF
- color.black: #000000

Background concept:

- Radial warm gradient (yellow/orange)
- Small repeating playful pattern texture

### Typography

Primary: Lexend Mega
Secondary/display: Black Han Sans

Text usage:

- H1/H2: bold, condensed feel, high contrast
- Body: readable, medium weight
- UI labels: compact, clear, high legibility

### Radius, border, shadow

- Border: 4px solid black
- Radius lg: 16px
- Radius md: 11px
- Radius sm: 8px
- Brutal shadow: 5px 5px 0 #000

### Motion

- Hover: move by 4-5px and remove shadow
- Press: slight scale down + same directional shift
- Countdown/urgent: color shift to danger red
- Keep motion snappy (150-220ms)

## 4. Accessibility constraints

- Preserve color contrast for all text and controls
- Provide clear focus ring styles for keyboard users
- Avoid color-only status signaling; pair color with icon/text
- Touch targets at least 44x44 on mobile
- Respect reduced motion preference (offer reduced animation variant)

## 5. Information architecture and key screens

### Screen A: Login / Character Selection

Goal:

- Select avatar quickly
- Input nickname
- Enter game world

Core UI:

- Main character card (brutal panel)
- Left/right avatar navigation buttons
- Random avatar interaction state
- Nickname input
- Primary CTA: enter

States:

- Default
- Hover avatar
- Invalid nickname (shake/error)
- Loading bridge/transition

### Screen B: Lobby

Goal:

- Choose game mode quickly
- Access settings and logout

Core UI:

- Mode cards (Single, Multi, Local)
- Header marquee with nickname
- Decorative side visuals
- Settings and logout actions

States:

- Card hover with stripe animation
- Disabled/coming soon state (if needed)

### Screen C: Ready Room

Goal:

- Show versus composition and ready status
- Show timeout progression

Core UI:

- Versus banner (2 players)
- Ready/cancel button
- Exit button
- Top timeout progress bar

States:

- Ready ON/OFF
- Waiting for opponent
- Timeout warning

### Screen D: In-Game Board

Goal:

- Fast turn recognition
- Error-free move input

Core UI:

- 3x3 board buttons
- Player roster and turn emphasis
- Circular countdown timer
- Exit and game-over modals

States:

- Active turn
- Disabled board cell
- Waiting for server response
- Win/lose/draw modal

### Screen E: Global Modals

- Exit modal
- Settings modal (BGM/SFX, mute, sliders)
- Game over modal (result + actions)

## 6. Shared UI architecture targets (important)

Design must support 3 layers:

1. Headless UI layer (Shared UI foundation)

- Pure structure, semantics, accessibility, interaction contracts
- No app-specific color assumptions
- API-first component contract (value, onChange, isOpen, onOpenChange, disabled)

2. Presentational layer

- Applies this project's visual skin (neo-brutal retro arcade)
- Can wrap headless primitives
- No global business state coupling

3. Container/Page layer

- Zustand/socket/business logic integration
- Passes data and handlers via props to presentational/headless components

## 7. Component inventory for Figma AI output

Create variants and specs for:

- Button (primary, secondary, danger, icon-only, disabled, loading)
- Card (mode card, panel card)
- Input (default, error, disabled)
- Avatar (small, large, randomizing)
- Badge/Tag
- Progress bar (timeout)
- Countdown badge (normal, warning)
- Modal shell (header/content/footer)
- Toast style
- Board cell (idle, hover, selected X/O, disabled)
- Player chip (active/inactive)

For each component, provide:

- Visual variants
- Interaction states
- Accessibility notes
- Recommended spacing and min size

## 8. Grid and responsive rules

Breakpoints:

- Mobile: 360-767
- Tablet: 768-1023
- Desktop: 1024+

Rules:

- Mobile: stack mode cards vertically
- Desktop: use side decorative zones + centered main action area
- Keep game board square and centered across breakpoints

## 9. Content voice and microcopy style

Language: Korean-first UI copy
Style:

- Short, playful, direct
- Avoid long explanatory text
- Action labels should be verb-first and clear

Examples:

- 준비 / 취소 / 나가기 / 다시하기 / 설정 / 입장

## 10. Output checklist for Figma AI

Please output all of the following:

- A mini design system page (tokens, typography, effects)
- 5 key screens with mobile and desktop variants
- Component set with interaction variants
- Simple user flow map (Login -> Lobby -> Ready -> Game -> Result)
- Notes describing how each component maps to Headless/Presentational layers

## 11. Prompt block (copy and run)

Design a web Tic-Tac-Toe interface with a neo-brutalist retro arcade style.
Use thick black borders, hard offset shadows, saturated warm colors, playful decorative motifs, and high-contrast action buttons.
Build a coherent design system and generate responsive screens for Login/Character Select, Lobby, Ready Room, In-Game Board, and Modals.
The output must support a Headless UI architecture:

- headless primitives with accessibility-first interaction contracts,
- presentational wrappers with project-specific skin,
- container/page-level state handled outside components.
  Produce component variants, interaction states, accessibility notes, and a concise mapping from each component to these three layers.
