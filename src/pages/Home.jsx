import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroCanvas from '../components/HeroCanvas.jsx'
import Marquee from '../components/Marquee.jsx'
import MagneticButton from '../components/MagneticButton.jsx'
import { TreatSVG, StrawberrySVG, CakePopSVG, PretzelSVG } from '../components/TreatArt.jsx'
import { TREAT_TYPES, DIPS } from '../data/treats.js'

gsap.registerPlugin(ScrollTrigger)

const HERO_FLOATS = [
  { type: 'strawberry', dip: 'milk', drizzle: 'white', style: { top: '16%', left: '6%', width: 110 }, depth: 26 },
  { type: 'cakepop', dip: 'ruby', drizzle: 'white', topping: 'sprinkles', style: { top: '22%', right: '7%', width: 100 }, depth: -32 },
  { type: 'pretzel', dip: 'dark', drizzle: 'pink', style: { bottom: '20%', left: '10%', width: 95 }, depth: -20 },
  { type: 'strawberry', dip: 'white', drizzle: 'pink', topping: 'gold', style: { bottom: '14%', right: '11%', width: 120 }, depth: 34 },
  { type: 'crispy', dip: 'milk', drizzle: 'white', style: { top: '52%', left: '2%', width: 80 }, depth: 16 },
]

function TestimonialCards() {
  const quotes = [
    {
      q: 'The strawberry box was almost too pretty to eat. Almost. My whole baby shower was talking about it!',
      by: '— Maya R.',
    },
    {
      q: 'Ordered the Deluxe for an anniversary. Every single treat was perfect — the drizzle, the crunch, all of it.',
      by: '— Devon & Alex',
    },
    {
      q: 'The build-a-box made gifting so fun. My mom cried when she opened hers. 10/10 will be back.',
      by: '— Tasha L.',
    },
  ]
  return (
    <div className="testi-row" data-reveal>
      {quotes.map((t, i) => (
        <figure className="testi-card" key={i}>
          <div className="quote-mark" aria-hidden="true">“</div>
          <blockquote>{t.q}</blockquote>
          <cite>{t.by}</cite>
        </figure>
      ))}
    </div>
  )
}

function DipLab() {
  const [dip, setDip] = useState('milk')
  const berryRef = useRef(null)

  const dunk = (next) => {
    setDip(next)
    const el = berryRef.current
    gsap.timeline()
      .to(el, { y: 26, scaleY: 0.82, scaleX: 1.12, duration: 0.18, ease: 'power2.in' })
      .to(el, { y: 0, scaleY: 1, scaleX: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
  }

  const cycle = () => {
    const idx = DIPS.findIndex((d) => d.id === dip)
    dunk(DIPS[(idx + 1) % DIPS.length].id)
  }

  return (
    <section className="section" id="diplab">
      <div className="wrap">
        <div className="dip-lab" data-reveal>
          <div className="dip-lab-grid">
            <div>
              <span className="section-kicker">The Dip Lab</span>
              <h2>Go on, <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--pink-deep)' }}>dunk it.</em></h2>
              <p>
                Every berry gets the royal treatment — hand-dipped in your choice of
                milk, dark, white or pink ruby chocolate. Tap the berry (or pick a
                chocolate) to see it take a dive.
              </p>
              <MagneticButton>
                <Link to="/build-a-box" className="btn btn-choc" data-cursor>
                  Dip one for real 🍫
                </Link>
              </MagneticButton>
            </div>
            <div className="dip-stage">
              <div
                className="dip-berry-wrap"
                ref={berryRef}
                onClick={cycle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && cycle()}
                aria-label="Dunk the strawberry in the next chocolate"
                data-cursor
              >
                <StrawberrySVG dip={dip} drizzle="white" width="100%" height="100%" />
              </div>
              <div className="dip-swatches">
                {DIPS.map((d) => (
                  <button
                    key={d.id}
                    className={`dip-swatch${dip === d.id ? ' active' : ''}`}
                    style={{ background: d.color }}
                    onClick={() => dunk(d.id)}
                    aria-label={d.label}
                    title={d.label}
                  />
                ))}
              </div>
              <span className="dip-hint">tap to dunk</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home({ ready }) {
  const heroRef = useRef(null)
  const pageRef = useRef(null)

  // hero entrance
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from('.hero-eyebrow', { y: 30, opacity: 0, duration: 0.6, ease: 'back.out(2)' })
        .from('.hero-title .word', {
          yPercent: 120,
          rotation: 6,
          stagger: 0.06,
          duration: 0.9,
          ease: 'power4.out',
        }, '-=0.3')
        .from('.hero-sub', { y: 26, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .from('.hero-ctas > *', { y: 26, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(1.8)' }, '-=0.4')
        .from('.hero-float', { scale: 0, rotation: -30, stagger: 0.08, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, '-=0.6')

      // perpetual gentle bobbing for floats
      gsap.utils.toArray('.hero-float').forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? 18 : -18,
          rotation: i % 2 ? 7 : -7,
          duration: 2.6 + i * 0.4,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      })
    }, heroRef)
    return () => ctx.revert()
  }, [ready])

  // mouse parallax on floats
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || window.matchMedia('(hover: none)').matches) return
    const floats = hero.querySelectorAll('.hero-float')
    const move = (e) => {
      const cx = e.clientX / window.innerWidth - 0.5
      const cy = e.clientY / window.innerHeight - 0.5
      floats.forEach((el) => {
        const depth = Number(el.dataset.depth)
        gsap.to(el, { x: cx * depth, duration: 1, ease: 'power3.out', overwrite: 'auto' })
      })
    }
    hero.addEventListener('mousemove', move)
    return () => hero.removeEventListener('mousemove', move)
  }, [])

  // scroll reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
        })
      })
      gsap.utils.toArray('[data-stagger]').forEach((group) => {
        gsap.from(group.children, {
          y: 70,
          opacity: 0,
          rotation: 2,
          stagger: 0.12,
          duration: 0.9,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: group, start: 'top 84%' },
        })
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  // 3D tilt on treat cards
  const tilt = (e) => {
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    gsap.to(card, {
      rotationY: px * 14,
      rotationX: -py * 14,
      transformPerspective: 700,
      duration: 0.4,
      ease: 'power2.out',
    })
  }
  const untilt = (e) => {
    gsap.to(e.currentTarget, { rotationY: 0, rotationX: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
  }

  return (
    <main ref={pageRef}>
      {/* ---------- HERO ---------- */}
      <header className="hero" ref={heroRef}>
        <HeroCanvas />
        {HERO_FLOATS.map((f, i) => (
          <div key={i} className="hero-float" style={f.style} data-depth={f.depth} aria-hidden="true">
            <TreatSVG type={f.type} dip={f.dip} drizzle={f.drizzle} topping={f.topping} width="100%" height="100%" />
          </div>
        ))}
        <div className="hero-inner">
          <span className="hero-eyebrow">🍓 Hand-dipped &amp; made to order</span>
          <h1 className="hero-title" aria-label="Berry sweet moments, dipped in chocolate">
            <span className="line" aria-hidden="true">
              {'Berry sweet '.split(' ').map((w, i) => <span className="word" key={i}>{w} </span>)}
              <span className="word"><em>moments,</em></span>
            </span>
            <span className="line" aria-hidden="true">
              {'dipped in '.split(' ').map((w, i) => <span className="word" key={i}>{w} </span>)}
              <span className="word"><em>chocolate.</em></span>
            </span>
          </h1>
          <p className="hero-sub">
            Sweets by Summeray crafts custom chocolate covered strawberries, cake
            pops, crispy treats and pretzels — dressed up exactly how you dream them.
          </p>
          <div className="hero-ctas">
            <MagneticButton>
              <Link to="/build-a-box" className="btn btn-primary" data-cursor>
                Build your box 🎁
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.25}>
              <a
                href="#treats"
                className="btn btn-ghost"
                data-cursor
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('treats')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Explore the treats ↓
              </a>
            </MagneticButton>
          </div>
        </div>
        <div className="hero-scroll-hint" aria-hidden="true">
          <span>scroll for sweetness</span>
          <span className="dot" />
        </div>
      </header>

      <Marquee />
      <Marquee alt reverse />

      {/* ---------- TREATS ---------- */}
      <section className="section" id="treats">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="section-kicker">The Menu</span>
            <h2 className="section-title">Four treats. <em>Endless combos.</em></h2>
            <p className="section-sub">
              Every piece is dipped, drizzled and decorated by hand. Pick your
              chocolate, your drizzle, your toppings — we make it happen.
            </p>
          </div>
          <div className="treat-grid" data-stagger>
            {TREAT_TYPES.map((t) => (
              <article
                className="treat-card"
                key={t.id}
                onMouseMove={tilt}
                onMouseLeave={untilt}
                data-cursor
              >
                <div className="art">
                  <TreatSVG
                    type={t.id}
                    dip={t.id === 'cakepop' ? 'ruby' : t.id === 'crispy' ? 'dark' : 'milk'}
                    drizzle={t.id === 'strawberry' ? 'white' : t.id === 'pretzel' ? 'pink' : 'white'}
                    topping={t.id === 'cakepop' ? 'sprinkles' : 'none'}
                    width="100%"
                    height="100%"
                  />
                </div>
                <h3>{t.name}</h3>
                <p>{t.blurb}</p>
                <span className="price">from ${t.price.toFixed(2)} each</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DipLab />

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="section-kicker">How it works</span>
            <h2 className="section-title">From craving to <em>doorstep.</em></h2>
          </div>
          <div className="steps" data-stagger>
            <div className="step-card">
              <span className="step-emoji" aria-hidden="true">🎮</span>
              <div className="step-num">01</div>
              <h3>Build your box</h3>
              <p>
                Play sweet architect — pick your box size, then fill every slot
                with treats customized down to the last sprinkle.
              </p>
            </div>
            <div className="step-card">
              <span className="step-emoji" aria-hidden="true">🧤</span>
              <div className="step-num">02</div>
              <h3>We dip &amp; dress</h3>
              <p>
                Summeray hand-dips every piece fresh to order in small batches —
                no shortcuts, no shelf time, just shiny chocolate.
              </p>
            </div>
            <div className="step-card">
              <span className="step-emoji" aria-hidden="true">🎀</span>
              <div className="step-num">03</div>
              <h3>Unbox the joy</h3>
              <p>
                Your box arrives ribbon-wrapped and ready to gift — or ready to
                devour straight from the lid. We don't judge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="section" id="love" style={{ background: 'var(--cream-2)' }}>
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="section-kicker">Sweet words</span>
            <h2 className="section-title">People are <em>melting.</em></h2>
          </div>
          <TestimonialCards />
        </div>
      </section>

      {/* ---------- BIG CTA ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="big-cta" data-reveal>
            <span className="bg-treat" style={{ top: '8%', left: '6%', width: 120 }} aria-hidden="true">
              <StrawberrySVG dip="white" width="120" height="120" />
            </span>
            <span className="bg-treat" style={{ bottom: '10%', right: '6%', width: 130 }} aria-hidden="true">
              <CakePopSVG dip="white" width="130" height="130" />
            </span>
            <span className="bg-treat" style={{ bottom: '14%', left: '14%', width: 100 }} aria-hidden="true">
              <PretzelSVG dip="white" width="100" height="100" />
            </span>
            <h2>Ready to build<br />something delicious?</h2>
            <p>
              Pick a box, fill it with hand-dipped happiness, and make someone's
              whole week. (That someone can absolutely be you.)
            </p>
            <MagneticButton>
              <Link to="/build-a-box" className="btn btn-choc" data-cursor>
                Start building 🍓
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>
    </main>
  )
}
