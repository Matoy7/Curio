# Homepage — Figma design, production build

A production-ready React + Vite build of the Figma "Homepage" design.

The design canvas is **1442px wide**. Every file under `src/imports/` is
byte-for-byte identical to the original Figma export — the design was not
edited, reinterpreted or re-laid-out.

---

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

Other commands:

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # TypeScript check, no emit
```

---

## Project structure

```
index.html                  document shell + page metadata
vite.config.ts              build config (relative base, React, Tailwind 4)
public/
  favicon.svg
  .nojekyll                 stops GitHub Pages from processing the output
src/
  main.tsx                  React entry point
  App.tsx                   mounts the design inside the canvas frame
  CanvasFrame.tsx           scale-to-fit wrapper (see below)
  index.css                 Quicksand font mapping + base layer
  imports/Homepage/         THE DESIGN — do not edit
    index.tsx               generated Figma component
    svg-ketq5jy3rm.ts       generated SVG path data
    *.png                   25 design assets
```

### CanvasFrame

The generated design uses fixed pixel sizes and absolute positions that only
line up at exactly 1442px. `CanvasFrame` renders the design at its native
1442px and, on narrower viewports, scales the whole canvas down with a single
uniform CSS transform.

Because the scale is uniform, nothing reflows or re-wraps — every proportion
and position stays exactly as designed. The canvas is never scaled above 1, so
on any display 1442px or wider the page renders at a true 1:1 pixel ratio with
the Figma file.

To render at a hard 1442px with horizontal scrolling instead, edit
`src/App.tsx` and return `<Homepage />` without the wrapper.

---

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` builds and deploys automatically on every push
to `main`. See the setup steps in the section below.

`vite.config.ts` uses `base: './'`, so the build works unchanged on a project
site (`user.github.io/repo/`), a user site, a custom domain, Netlify or Vercel.
No path configuration is needed.

---

## Note on page weight

The 25 design PNGs total about 25 MB. They are AI-generated photographs saved
as PNG, which is why they are so large — several are around 2 MB each.

They were deliberately left untouched to guarantee pixel-perfect fidelity.
Converting them to WebP at high quality would cut the total to roughly 1.7 MB
(93% smaller) with an average per-pixel difference of about 0.4% — visually
indistinguishable, but technically lossy. Worth doing if load time matters more
than byte-exact images.
