import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const ITEMS = [
  'Chocolate Covered Strawberries',
  'Cake Pops',
  'Crispy Treats',
  'Chocolate Pretzels',
  'Custom Boxes',
  'Made to Order',
]

export default function Marquee({ alt = false, reverse = false }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    const tween = gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration: 28, ease: 'none', repeat: -1 }
    )
    return () => tween.kill()
  }, [reverse])

  return (
    <div className={`marquee${alt ? ' alt' : ''}`} aria-hidden="true">
      <div className="marquee-track" ref={trackRef}>
        {[0, 1].map((half) => (
          <div key={half} style={{ display: 'flex' }}>
            {ITEMS.map((item, i) => (
              <span className="marquee-item" key={i}>
                {item} <span className="star">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
