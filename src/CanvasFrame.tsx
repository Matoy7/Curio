import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/**
 * The Figma artboard is 1442px wide. The generated design code uses fixed
 * pixel sizes and absolute positions that only line up at that exact width.
 *
 * This wrapper renders the design at its native 1442px and, when the viewport
 * is narrower, scales the whole canvas down uniformly with a CSS transform.
 * Because the scale is uniform, every proportion, position and dimension stays
 * exactly as designed - nothing is reflowed, re-wrapped or re-laid-out.
 *
 * The canvas is never scaled ABOVE 1, so on any display 1442px or wider the
 * page renders at a true 1:1 pixel ratio with the Figma file.
 *
 * Nothing inside src/imports/ is touched by this component.
 */

const DESIGN_WIDTH = 1442

export default function CanvasFrame({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [contentHeight, setContentHeight] = useState(0)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const measure = () => {
      // clientWidth excludes the vertical scrollbar, so the canvas never
      // triggers a horizontal scrollbar of its own.
      const viewportWidth = document.documentElement.clientWidth
      setScale(Math.min(1, viewportWidth / DESIGN_WIDTH))
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
