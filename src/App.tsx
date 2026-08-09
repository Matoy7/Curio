import { useRef } from 'react'
import Homepage from '@/imports/Homepage/index'
import CanvasFrame from './CanvasFrame'
import { useInteractionLayer } from './interactions/useInteractionLayer'

export default function App() {
  const designRef = useRef<HTMLDivElement>(null)

  // Applies the site-wide interaction system on top of the untouched design.
  useInteractionLayer(designRef)

  return (
    <CanvasFrame>
      <div ref={designRef}>
        <Homepage />
      </div>
    </CanvasFrame>
  )
}
