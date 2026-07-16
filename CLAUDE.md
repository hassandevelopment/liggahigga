# The RULEBOOK - Interactive Book Website

## What This Is
A gift website styled as an interactive book called "The RULEBOOK." It is a joke rulebook about relationship dos and don'ts, with one serious romantic poem on the first page. Mobile-first, works on phones and laptops.

## Book Structure
1. **Front cover** - Title: "The RULEBOOK" styled bold and official-looking, like a legal document or constitution
2. **Page 1 - The Poem** - The serious/romantic page. Arabic poem text (large, RTL), English translation below (smaller, LTR), a play/pause button for a voice recording (audio/poem-1.mp3 or poem-1.m4a), and space for a photo (images/photo-1.jpg, show a placeholder if missing)
3. **Pages 2-10ish - The Rules** - Sarcastic joke rules loaded from rules.md. Distribute them across pages so each page has a comfortable amount of text (roughly 8-10 rules per page, adjust for readability). Each page should show a section title if one exists. Rules are numbered continuously.
4. **Final page** - Rule #82 "Lina must marry Hassan" displayed alone, centered, larger font, with a subtle heart animation or special styling to make it stand out as the punchline.
5. **Back cover** - Simple, maybe a small heart or closing design

## Critical Rules
- The poem page uses RTL for Arabic text, LTR for the English translation
- The rules pages are in English, so LTR for those
- lang attribute should be set appropriately per section
- Google Font: Amiri for the Arabic poem, a clean serif or sans-serif for the English rules (try Playfair Display for headings, Inter or system font for rule text)
- No frameworks. No npm. No build tools. Plain HTML + CSS + JS only.
- Mobile-first responsive. Must work on 375px phones and up to 1440px laptops.

## File Layout
```
index.html
styles.css
script.js
audio/
  poem-1.mp3 (or .m4a)
images/
  photo-1.jpg (optional, added later)
poems.md (source text, not served)
rules.md (source text, not served)
```

## Audio (Poem Page Only)
- Play/pause button on the poem page
- Plays audio/poem-1.mp3 (fall back to .m4a)
- iOS requires user interaction before audio plays. The play button handles this.
- Show a thin progress indicator while audio plays
- Style the play button to feel integrated, not like a generic media player

## Page Flip Animation
- CSS 3D transforms with perspective
- Swipe on mobile (touch events, 50px minimum threshold)
- Click left/right halves of book on desktop
- Arrow keys on desktop
- Pages should have subtle shadow/depth during flip
- 60fps. Only animate transform and opacity.
- The book opens from the right (like a real book)

## Visual Style
- The vibe is "official document meets joke." Think fake-legal, fake-serious design with a warm twist.
- Book centered on page with a dark or muted background
- Paper-like page feel (subtle off-white, maybe a faint texture via CSS)
- Cover should look like a leather-bound official book. Dark cover, gold or cream text.
- Rules pages: clean, readable, numbered list. Section headers in a slightly different style.
- The final rule page should feel like a plot twist. Different styling from the rest.
- Subtle open animation on first load

## Viewport & Sizing
- Book: 85vw on mobile, max 600px on desktop
- Arabic poem text: 22px+
- English translation: 16px, lighter color
- Rule text: 15-16px, comfortable line height (1.6+)
- Section headers: 18-20px, bolder
- Touch targets: minimum 44x44px
- Meta viewport tag required
