import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/**
 * The Figma artboard is 1442px wide. The generated design code uses fixed
 * pixel sizes and absolute positions that only line up at that exact width.
 *
 * This wrapper lays the design out at its native 1442px and then scales the
 * whole canvas with a single uniform CSS transform so it always fills the full
 * viewport width - scaling down on narrower screens and up on wider ones.
 *
 * Because the scale is uniform, every proportion, position and dimension stays
 * exactly as designed - nothing is reflowed, re-wrapped or re-laid-out. The
 * page is edge-to-edge at any window size, with no white side margins.
 *
 * Set MAX_SCALE below to cap how far the design is allowed to grow.
 *
 * Nothing inside src/imports/ is touched by this component.
 */

const DESIGN_WIDTH = 1442

/**
 * Upper limit on how far the canvas may be scaled up.
 * `Infinity` = always fill the full viewport width, edge to edge.
 * Set to e.g. `1.5` to stop growing past 2163px, or `1` to render at a strict
 * 1:1 pixel ratio and centre the canvas on wider screens.
 */
const MAX_SCALE = Infinity

export default function CanvasFrame({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLDivElement>(null)

  // Compute the scale during the FIRST render, not in an effect, so the very
  // first paint is already full-width. Otherwise the canvas would paint once
  // at 1442px (leaving white side margins) before being corrected.
  const [scale, setScale] = useState(() =>
    typeof document === 'undefined'
      ? 1
      : Math.min(MAX_SCALE, document.documentElement.clientWidth / DESIGN_WIDTH),
  )
  const [contentHeight, setContentHeight] = useState(0)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const measure = () => {
      // clientWidth excludes the vertical scrollbar, so the canvas never
      // triggers a horizontal scrollbar of its own.
      const viewportWidth = document.documentElement.clientWidth
      setScale(Math.min(MAX_SCALE, viewportWidth / DESIGN_WIDTH))
      // offsetHeight is unaffected by CSS transforms, so this is the true
      // untransformed layout height of the 1442px canvas.
      setContentHeight(canvas.offsetHeight)
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(canvas)
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [])

  // Webfonts change text metrics, which can change the canvas height.
  // Re-measure once Quicksand has actually loaded.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !document.fonts) return

    let cancelled = false
    document.fonts.ready
      .then(() => {
        if (!cancelled) setContentHeight(canvas.offsetHeight)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div
        style={{
          width: DESIGN_WIDTH * scale,
          height: contentHeight ? contentHeight * scale : undefined,
          overflow: 'hidden',
        }}
      >
        <div
          ref={canvasRef}
          style={{
            width: DESIGN_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
