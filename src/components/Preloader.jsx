import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { StrawberrySVG } from './TreatArt.jsx'

export default function Preloader({ onDone }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const letters = root.querySelectorAll('.preloader-word span')
    const tl = gsap.timeline({
      onComplete: onDone,
    })

    tl.from(root.querySelector('.preloader-berry'), {
      y: -120,
      rotation: -20,
      duration: 0.7,
      ease: 'bounce.out',
    })
      .from(letters, {
        yPercent: 110,
        stagger: 0.035,
        duration: 0.5,
        ease: 'back.out(2)',
      }, '-=0.3')
      .to(root.querySelector('.preloader-berry'), {
        rotation: 12,
        yoyo: true,
        repeat: 1,
        duration: 0.22,
        ease: 'power1.inOut',
      })
      .to(root, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        delay: 0.25,
      })

    return () => tl.kill()
  }, [onDone])

  const word = 'Sweets by Summeray'

  return (
    <div className="preloader" ref={rootRef}>
      <div className="preloader-inner">
        <div className="preloader-berry">
          <StrawberrySVG dip="milk" drizzle="white" width="92" height="92" />
        </div>
        <div className="preloader-word" aria-label={word}>
          {word.split('').map((ch, i) => (
            <span key={i} aria-hidden="true">{ch}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
