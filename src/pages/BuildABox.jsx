import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import MagneticButton from '../components/MagneticButton.jsx'
import { TreatSVG } from '../components/TreatArt.jsx'
import {
  TREAT_TYPES, DIPS, DRIZZLES, TOPPINGS, BOX_SIZES,
  findDip, findDrizzle, findTopping, findTreat,
} from '../data/treats.js'

const CONFETTI_COLORS = ['#FF7BAC', '#A78BFA', '#5CC9A7', '#F5B94C', '#FFD3E3', '#7BD8FF']

const DELIVERY_FEE = 10

// Order capture via Web3Forms (https://web3forms.com) — a static-site-friendly
// form backend. The access key is public/safe to ship in client code; orders are
// emailed to the address that owns the key and stored in the Web3Forms dashboard.
// Create a free key with Summeray's email and paste it below to go live.
// Until a real key is set, the order button falls back to opening an email draft.
const WEB3FORMS_ACCESS_KEY = 'a256eb42-9b2f-42fd-8854-5ad7f385b99c'
const ORDER_EMAIL = 'hello@sweetsbysummeray.com'

const OCCASIONS = [
  'Birthday',
  'Baby Shower',
  'Gender Reveal',
  'Wedding',
  'Anniversary',
  'Graduation',
  "Valentine's Day",
  'Mother’s Day',
  'Thank You',
  'Congratulations',
  'Just Because',
]

let uid = 0
const nextId = () => `treat-${++uid}-${Date.now()}`

/* ----- juice helpers (imperative DOM particles) ----- */

function burstSparkles(x, y) {
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('div')
    s.className = 'bb-spark'
    s.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
    s.style.left = `${x}px`
    s.style.top = `${y}px`
    document.body.appendChild(s)
    const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.5
    const dist = 40 + Math.random() * 50
    gsap.fromTo(
      s,
      { scale: 1, opacity: 1 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        scale: 0,
        opacity: 0,
        duration: 0.6 + Math.random() * 0.3,
        ease: 'power2.out',
        onComplete: () => s.remove(),
      }
    )
  }
}

function rainConfetti() {
  const w = window.innerWidth
  for (let i = 0; i < 90; i++) {
    const c = document.createElement('div')
    c.className = 'confetti-bit'
    const size = 6 + Math.random() * 9
    c.style.width = `${size}px`
    c.style.height = `${size * (Math.random() > 0.5 ? 1 : 0.45)}px`
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px'
    c.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
    c.style.left = `${Math.random() * w}px`
    c.style.top = '-20px'
    document.body.appendChild(c)
    gsap.to(c, {
      y: window.innerHeight + 60,
      x: `+=${(Math.random() - 0.5) * 240}`,
      rotation: Math.random() * 720 - 360,
      duration: 1.6 + Math.random() * 1.6,
      delay: Math.random() * 0.5,
      ease: 'power1.in',
      onComplete: () => c.remove(),
    })
  }
}

/* ----- slot art with pop-in ----- */

function SlotArt({ item }) {
  const ref = useRef(null)
  useEffect(() => {
    const tween = gsap.from(ref.current, {
      scale: 0,
      rotation: -25,
      duration: 0.6,
      ease: 'elastic.out(1.1, 0.5)',
    })
    return () => tween.kill()
  }, [])
  return (
    <div className="slot-art" ref={ref}>
      <TreatSVG type={item.treat} dip={item.dip} drizzle={item.drizzle} topping={item.topping} width="100%" height="100%" />
    </div>
  )
}

/* ----- main page ----- */

export default function BuildABox() {
  const [phase, setPhase] = useState('size') // size | build | wrapped
  const [box, setBox] = useState(null)
  const [items, setItems] = useState([])
  const [treat, setTreat] = useState('strawberry')
  const [dip, setDip] = useState('milk')
  const [customDip, setCustomDip] = useState('')
  const [drizzle, setDrizzle] = useState('none')
  const [customDrizzle, setCustomDrizzle] = useState('')
  const [topping, setTopping] = useState('none')
  const [customTopping, setCustomTopping] = useState('')
  const [flying, setFlying] = useState(null)
  const [surprising, setSurprising] = useState(false)
  const [occasion, setOccasion] = useState('')
  const [messageText, setMessageText] = useState('')
  const [fulfillment, setFulfillment] = useState('pickup')
  const [contact, setContact] = useState({ name: '', email: '', phone: '', date: '', notes: '' })
  const [submitState, setSubmitState] = useState('idle') // idle | sending | sent | error
  const [submitError, setSubmitError] = useState('')

  const phaseRef = useRef(null)
  const previewRef = useRef(null)
  const slotRefs = useRef([])
  const flyRef = useRef(null)

  const full = box && items.length >= box.slots
  const itemsTotal = items.reduce((s, it) => s + it.price, 0)
  const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0
  const total = (box ? box.base : 0) + itemsTotal + deliveryFee

  /* phase entrance animation */
  useEffect(() => {
    if (!phaseRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(phaseRef.current.children, {
        y: 50,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
      })
    }, phaseRef)
    return () => ctx.revert()
  }, [phase])

  const chooseBox = (b) => {
    setBox(b)
    setItems((prev) => prev.slice(0, b.slots))
    setPhase('build')
  }

  const commitItem = useCallback((newItem, slotIndex) => {
    setItems((prev) => {
      if (box && prev.length >= box.slots) return prev
      return [...prev, newItem]
    })
    const slotEl = slotRefs.current[slotIndex]
    if (slotEl) {
      const r = slotEl.getBoundingClientRect()
      burstSparkles(r.left + r.width / 2, r.top + r.height / 2)
      gsap.fromTo(slotEl, { scale: 1.15 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.4)' })
    }
  }, [box])

  /* fly-into-box animation */
  useEffect(() => {
    if (!flying || !flyRef.current) return
    const el = flyRef.current
    const { from, to, item, slotIndex } = flying
    const dx = to.x - from.x
    const dy = to.y - from.y
    const tl = gsap.timeline({
      onComplete: () => {
        commitItem(item, slotIndex)
        setFlying(null)
      },
    })
    gsap.set(el, { x: from.x, y: from.y, scale: 1, rotation: 0, opacity: 1 })
    tl.to(el, { x: from.x + dx, duration: 0.65, ease: 'power1.inOut' }, 0)
      .to(el, { y: from.y - 110, duration: 0.3, ease: 'power2.out' }, 0)
      .to(el, { y: from.y + dy, duration: 0.35, ease: 'power2.in' }, 0.3)
      .to(el, { rotation: 360, scale: 0.55, duration: 0.65, ease: 'power1.inOut' }, 0)
      .to(el, { opacity: 0, duration: 0.08 }, 0.6)
    return () => tl.kill()
  }, [flying, commitItem])

  const addTreat = (custom) => {
    if (!box || full || flying) return
    const t = findTreat(custom?.treat ?? treat)
    const resolvedDip = custom?.dip ?? dip
    const resolvedDrizzle = custom?.drizzle ?? drizzle
    const resolvedTopping = custom?.topping ?? topping
    const item = {
      id: nextId(),
      treat: t.id,
      dip: resolvedDip,
      customDip: resolvedDip === 'custom' ? (customDip.trim() || 'Custom dip') : undefined,
      drizzle: resolvedDrizzle,
      customDrizzle: resolvedDrizzle === 'custom' ? (customDrizzle.trim() || 'Custom drizzle') : undefined,
      topping: resolvedTopping,
      customTopping: resolvedTopping === 'custom' ? (customTopping.trim() || 'Custom topping') : undefined,
      price: t.price,
    }
    const slotIndex = items.length
    const slotEl = slotRefs.current[slotIndex]
    const fromEl = previewRef.current
    if (slotEl && fromEl) {
      const fr = fromEl.getBoundingClientRect()
      const tr = slotEl.getBoundingClientRect()
      setFlying({
        item,
        slotIndex,
        from: { x: fr.left + fr.width / 2 - 45, y: fr.top + fr.height / 2 - 45 },
        to: { x: tr.left + tr.width / 2 - 45, y: tr.top + tr.height / 2 - 45 },
      })
    } else {
      commitItem(item, slotIndex)
    }
  }

  const removeItem = (idx) => {
    const slotEl = slotRefs.current[idx]
    const art = slotEl?.querySelector('.slot-art')
    if (art) {
      gsap.to(art, {
        scale: 0,
        rotation: 30,
        y: 20,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(2)',
        onComplete: () => setItems((prev) => prev.filter((_, i) => i !== idx)),
      })
    } else {
      setItems((prev) => prev.filter((_, i) => i !== idx))
    }
  }

  const surpriseMe = async () => {
    if (!box || full || surprising) return
    setSurprising(true)
    const remaining = box.slots - items.length
    for (let i = 0; i < remaining; i++) {
      const t = TREAT_TYPES[Math.floor(Math.random() * TREAT_TYPES.length)]
      const item = {
        id: nextId(),
        treat: t.id,
        dip: DIPS[Math.floor(Math.random() * DIPS.length)].id,
        drizzle: DRIZZLES[Math.floor(Math.random() * DRIZZLES.length)].id,
        topping: TOPPINGS[Math.floor(Math.random() * TOPPINGS.length)].id,
        price: t.price,
      }
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, 220))
      commitItem(item, items.length + i)
    }
    setSurprising(false)
  }

  const wrapItUp = () => {
    if (!full) return
    rainConfetti()
    setTimeout(() => setPhase('wrapped'), 450)
  }

  const t = findTreat(treat)

  const dipLabelOf = (dipId, customLabel) =>
    dipId === 'custom' ? (customLabel?.trim() || 'Custom dip') : findDip(dipId).label

  const drizzleLabelOf = (drizzleId, customLabel) =>
    drizzleId === 'custom' ? (customLabel?.trim() || 'Custom drizzle') : findDrizzle(drizzleId).label

  const toppingLabelOf = (toppingId, customLabel) =>
    toppingId === 'custom' ? (customLabel?.trim() || 'Custom topping') : findTopping(toppingId).label

  const fulfillmentLabel =
    fulfillment === 'delivery' ? `Delivery (+$${DELIVERY_FEE.toFixed(2)})` : 'Pickup (Free)'

  const orderText = () => {
    const lines = items.map(
      (it, i) =>
        `${i + 1}. ${findTreat(it.treat).name} — ${dipLabelOf(it.dip, it.customDip)}, ${drizzleLabelOf(it.drizzle, it.customDrizzle)}, ${toppingLabelOf(it.topping, it.customTopping)} ($${it.price.toFixed(2)})`
    )
    return (
      `${box ? `"${box.name}"` : 'Box'} — ${items.length} treats\n\n` +
      `${lines.join('\n')}\n\n` +
      `Theme / Occasion: ${occasion || 'Not specified'}\n` +
      `Message / Text: ${messageText || 'None'}\n` +
      `Fulfillment: ${fulfillmentLabel}\n` +
      `Treats & box: $${(box.base + itemsTotal).toFixed(2)}\n` +
      (deliveryFee ? `Delivery fee: $${deliveryFee.toFixed(2)}\n` : '') +
      `Box total: $${total.toFixed(2)}\n\n` +
      `— Customer —\n` +
      `Name: ${contact.name || '(not provided)'}\n` +
      `Email: ${contact.email || '(not provided)'}\n` +
      `Phone: ${contact.phone || '(not provided)'}\n` +
      `Preferred date: ${contact.date || '(not provided)'}\n` +
      `Notes: ${contact.notes || 'None'}\n`
    )
  }

  const mailtoHref = () => {
    const body = encodeURIComponent(`Hi Summeray!\n\nI'd love to order:\n\n${orderText()}`)
    return `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent('Sweet Box Order 🍓')}&body=${body}`
  }

  const hasFormBackend = WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY'

  const submitOrder = async () => {
    if (!contact.name.trim() || !contact.email.trim()) {
      setSubmitState('error')
      setSubmitError('Please add your name and email so Summeray can reach you.')
      return
    }
    // No form backend configured yet — fall back to an email draft.
    if (!hasFormBackend) {
      window.location.href = mailtoHref()
      return
    }
    setSubmitState('sending')
    setSubmitError('')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `🍓 New box order — ${box?.name} (${contact.name || 'no name'})`,
          from_name: contact.name || 'Sweets by Summeray site',
          replyto: contact.email,
          box: box?.name,
          treats: items.length,
          occasion: occasion || 'Not specified',
          message_text: messageText || 'None',
          fulfillment: fulfillmentLabel,
          total: `$${total.toFixed(2)}`,
          customer_name: contact.name,
          customer_email: contact.email,
          customer_phone: contact.phone,
          preferred_date: contact.date,
          notes: contact.notes,
          message: orderText(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitState('sent')
      } else {
        throw new Error(data.message || 'Submission failed')
      }
    } catch (err) {
      setSubmitState('error')
      setSubmitError("Something went wrong sending your order. Please try the email option below.")
    }
  }

  const updateContact = (key) => (e) => setContact((c) => ({ ...c, [key]: e.target.value }))

  return (
    <div className="bb-page">
      <div className="wrap">

        {/* ------- HUD ------- */}
        {phase === 'build' && box && (
          <div className="bb-hud">
            <div className="bb-hud-stat">
              <span className="label">Box</span>
              <span className="value">{box.name}</span>
            </div>
            <div className="bb-progress" role="progressbar" aria-valuenow={items.length} aria-valuemax={box.slots}>
              <div className="bb-progress-fill" style={{ width: `${(items.length / box.slots) * 100}%` }} />
            </div>
            <div className="bb-hud-stat">
              <span className="label">Filled</span>
              <span className="value">{items.length}/{box.slots}</span>
            </div>
            <div className="bb-hud-stat">
              <span className="label">Total</span>
              <span className="value">${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* ------- PHASE 1 : PICK A BOX ------- */}
        {phase === 'size' && (
          <div ref={phaseRef}>
            <h1 className="bb-title">Choose your <em>canvas.</em></h1>
            <p className="bb-sub">
              Level one: pick a box. Don't stress — you can always go bigger.
              (People usually go bigger.)
            </p>
            <div className="bb-sizes">
              {BOX_SIZES.map((b) => (
                <button key={b.id} className="bb-size-card" onClick={() => chooseBox(b)} data-cursor>
                  <span className="mini-box" style={{ gridTemplateColumns: `repeat(${b.cols}, 1fr)` }}>
                    {Array.from({ length: b.slots }).map((_, i) => (
                      <span className="mini-cell" key={i} />
                    ))}
                  </span>
                  <h3>{b.name}</h3>
                  <div className="slots">{b.slots} treats</div>
                  <p>{b.tagline}</p>
                  <span className="btn btn-primary" style={{ padding: '12px 26px', fontSize: '0.92rem' }}>
                    Pick this box
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ------- PHASE 2 : FILL IT ------- */}
        {phase === 'build' && box && (
          <div ref={phaseRef}>
            <button className="bb-back" onClick={() => setPhase('size')} data-cursor>
              ← change box size
            </button>
            <div className="bb-builder">

              {/* customizer panel */}
              <div className="bb-panel">
                <h2 className="bb-panel-title">Treat workshop 🧁</h2>
                <p className="bb-panel-sub">Design a treat, then send it flying into the box.</p>

                <div className="bb-treat-tabs">
                  {TREAT_TYPES.map((tt) => (
                    <button
                      key={tt.id}
                      className={`bb-treat-tab${treat === tt.id ? ' active' : ''}`}
                      onClick={() => setTreat(tt.id)}
                      data-cursor
                    >
                      <TreatSVG type={tt.id} dip="milk" drizzle="white" width="44" height="44" />
                      {tt.short}
                    </button>
                  ))}
                </div>

                <div className="bb-option-group">
                  <span className="bb-option-label">Chocolate dip</span>
                  <div className="bb-chips">
                    {DIPS.map((d) => (
                      <button
                        key={d.id}
                        className={`bb-chip${dip === d.id ? ' active' : ''}`}
                        onClick={() => setDip(d.id)}
                        data-cursor
                      >
                        <span className="swatch" style={{ background: d.color }} /> {d.label}
                      </button>
                    ))}
                    <button
                      className={`bb-chip${dip === 'custom' ? ' active' : ''}`}
                      onClick={() => setDip('custom')}
                      data-cursor
                    >
                      <span className="swatch multi" /> ✏️ Type your own
                    </button>
                  </div>
                  {dip === 'custom' && (
                    <input
                      className="bb-custom-dip"
                      type="text"
                      maxLength={40}
                      placeholder="Describe your dip — e.g. caramel, mint green, red velvet"
                      value={customDip}
                      onChange={(e) => setCustomDip(e.target.value)}
                      data-cursor
                    />
                  )}
                </div>

                <div className="bb-option-group">
                  <span className="bb-option-label">Drizzle</span>
                  <div className="bb-chips">
                    {DRIZZLES.map((d) => (
                      <button
                        key={d.id}
                        className={`bb-chip${drizzle === d.id ? ' active' : ''}`}
                        onClick={() => setDrizzle(d.id)}
                        data-cursor
                      >
                        <span className="swatch" style={{ background: d.color || 'transparent', borderStyle: d.color ? 'solid' : 'dashed' }} />
                        {d.label}
                      </button>
                    ))}
                    <button
                      className={`bb-chip${drizzle === 'custom' ? ' active' : ''}`}
                      onClick={() => setDrizzle('custom')}
                      data-cursor
                    >
                      <span className="swatch multi" /> ✏️ Type your own
                    </button>
                  </div>
                  {drizzle === 'custom' && (
                    <input
                      className="bb-custom-dip"
                      type="text"
                      maxLength={40}
                      placeholder="Describe your drizzle — e.g. gold, two-tone pink & white"
                      value={customDrizzle}
                      onChange={(e) => setCustomDrizzle(e.target.value)}
                      data-cursor
                    />
                  )}
                </div>

                <div className="bb-option-group">
                  <span className="bb-option-label">Topping</span>
                  <div className="bb-chips">
                    {TOPPINGS.map((tp) => (
                      <button
                        key={tp.id}
                        className={`bb-chip${topping === tp.id ? ' active' : ''}`}
                        onClick={() => setTopping(tp.id)}
                        data-cursor
                      >
                        <span
                          className="swatch"
                          style={{ background: tp.colors[0] || 'transparent', borderStyle: tp.colors.length ? 'solid' : 'dashed' }}
                        />
                        {tp.label}
                      </button>
                    ))}
                    <button
                      className={`bb-chip${topping === 'custom' ? ' active' : ''}`}
                      onClick={() => setTopping('custom')}
                      data-cursor
                    >
                      <span className="swatch multi" /> ✏️ Type your own
                    </button>
                  </div>
                  {topping === 'custom' && (
                    <input
                      className="bb-custom-dip"
                      type="text"
                      maxLength={40}
                      placeholder="Describe your topping — e.g. crushed pretzel, edible glitter"
                      value={customTopping}
                      onChange={(e) => setCustomTopping(e.target.value)}
                      data-cursor
                    />
                  )}
                </div>

                <div className="bb-preview-row">
                  <div className="bb-preview-art" ref={previewRef}>
                    <TreatSVG type={treat} dip={dip} drizzle={drizzle} topping={topping} width="100%" height="100%" />
                  </div>
                  <div className="bb-preview-meta">
                    <div className="name">{t.name}</div>
                    <div className="desc">
                      {dipLabelOf(dip, customDip)} · {drizzleLabelOf(drizzle, customDrizzle)} · {toppingLabelOf(topping, customTopping)}
                    </div>
                    <div className="price">${t.price.toFixed(2)}</div>
                  </div>
                </div>

                <div className="bb-add-row">
                  <button
                    className="btn btn-primary"
                    onClick={() => addTreat()}
                    disabled={full || !!flying}
                    data-cursor
                  >
                    {full ? 'Box is full! 🎉' : 'Add to box ➜'}
                  </button>
                  <button className="btn btn-ghost" onClick={surpriseMe} disabled={full || surprising} data-cursor>
                    {surprising ? 'Sprinkling magic…' : '🎲 Surprise me'}
                  </button>
                </div>
              </div>

              {/* the box */}
              <div className="bb-box-outer">
                <div className="bb-box">
                  <div className="bb-box-label">{box.name} — {box.tagline}</div>
                  <div className="bb-slots" style={{ gridTemplateColumns: `repeat(${box.cols}, 1fr)` }}>
                    {Array.from({ length: box.slots }).map((_, i) => {
                      const item = items[i]
                      const isNext = i === items.length && !full
                      return (
                        <div
                          key={i}
                          ref={(el) => (slotRefs.current[i] = el)}
                          className={`bb-slot${item ? ' filled' : ''}${isNext ? ' next' : ''}`}
                          onClick={() => item && removeItem(i)}
                          role={item ? 'button' : undefined}
                          aria-label={item ? `Remove ${findTreat(item.treat).name} from slot ${i + 1}` : `Empty slot ${i + 1}`}
                          data-cursor={item ? true : undefined}
                        >
                          {item ? (
                            <>
                              <SlotArt item={item} />
                              <span className="slot-x" aria-hidden="true">✕</span>
                            </>
                          ) : (
                            <span className="slot-num">{i + 1}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="bb-box-actions">
                    <MagneticButton strength={0.2}>
                      <button
                        className={`btn btn-choc bb-wrap-btn${full ? ' ready' : ''}`}
                        onClick={wrapItUp}
                        disabled={!full}
                        data-cursor
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        {full ? '🎀 Wrap it up!' : `Fill ${box.slots - items.length} more to wrap`}
                      </button>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>

            {/* finishing touches: theme, message, fulfillment */}
            <div className="bb-panel bb-finishing">
              <h2 className="bb-panel-title">Finishing touches 🎀</h2>
              <p className="bb-panel-sub">
                Set the vibe, add your message, and choose how you'd like to get your box.
              </p>
              <div className="bb-finishing-grid">
                <div className="bb-field">
                  <label htmlFor="bb-occasion">Theme / Occasion</label>
                  <select
                    id="bb-occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    data-cursor
                  >
                    <option value="">Choose an occasion…</option>
                    {OCCASIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="bb-field">
                  <label htmlFor="bb-message">Message / Text</label>
                  <input
                    id="bb-message"
                    type="text"
                    maxLength={60}
                    placeholder="e.g. Happy Birthday Mia!"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    data-cursor
                  />
                </div>
                <div className="bb-field">
                  <label htmlFor="bb-fulfillment">Pickup or Delivery</label>
                  <select
                    id="bb-fulfillment"
                    value={fulfillment}
                    onChange={(e) => setFulfillment(e.target.value)}
                    data-cursor
                  >
                    <option value="pickup">Pickup — Free</option>
                    <option value="delivery">Delivery — +${DELIVERY_FEE.toFixed(2)}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------- PHASE 3 : WRAPPED ------- */}
        {phase === 'wrapped' && box && (
          <div ref={phaseRef}>
            <div className="bb-summary">
              <svg className="ribbon" viewBox="0 0 64 40" aria-hidden="true">
                <path d="M32 22 L8 4 C2 0 0 8 4 12 L26 26 Z" fill="#FF7BAC" />
                <path d="M32 22 L56 4 C62 0 64 8 60 12 L38 26 Z" fill="#FF7BAC" />
                <path d="M32 22 L14 38 C10 42 18 44 22 40 L34 28 Z" fill="#E85D92" />
                <path d="M32 22 L50 38 C54 42 46 44 42 40 L30 28 Z" fill="#E85D92" />
                <circle cx="32" cy="24" r="6" fill="#FFD3E3" stroke="#E85D92" strokeWidth="2" />
              </svg>
              <h2>Your box is wrapped! 🎉</h2>
              <p className="sub">
                Here's everything inside <b>{box.name}</b>. Send it over and
                Summeray will confirm your order personally.
              </p>
              <ul className="bb-summary-list">
                {items.map((it, i) => (
                  <li className="bb-summary-item" key={it.id}>
                    <TreatSVG type={it.treat} dip={it.dip} drizzle={it.drizzle} topping={it.topping} width="44" height="44" />
                    <div className="meta">
                      <b>{findTreat(it.treat).name}</b>
                      <span>
                        {dipLabelOf(it.dip, it.customDip)} · {drizzleLabelOf(it.drizzle, it.customDrizzle)} · {toppingLabelOf(it.topping, it.customTopping)}
                      </span>
                    </div>
                    <span className="p">${it.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <ul className="bb-detail-list">
                <li><span>Theme / Occasion</span><b>{occasion || 'Not specified'}</b></li>
                <li><span>Message / Text</span><b>{messageText || '—'}</b></li>
                <li><span>Fulfillment</span><b>{fulfillmentLabel}</b></li>
              </ul>
              <div className="bb-cost-lines">
                <div className="bb-cost-line">
                  <span>Treats &amp; box</span>
                  <span>${(box.base + itemsTotal).toFixed(2)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="bb-cost-line">
                    <span>Delivery fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="bb-total-row">
                <span>Box total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {submitState === 'sent' ? (
                <div className="bb-sent">
                  <div className="bb-sent-emoji" aria-hidden="true">🎉</div>
                  <h3>Order sent!</h3>
                  <p>
                    Thank you, {contact.name.split(' ')[0] || 'friend'}! Summeray has
                    your order and will reach out to <b>{contact.email}</b> to confirm
                    the details.
                  </p>
                  <div className="bb-pay-note">
                    <span className="bb-pay-emoji" aria-hidden="true">💛</span>
                    <p>
                      <b>One last sweet step:</b> your spot is reserved, and your order
                      is officially confirmed the moment your Venmo payment of{' '}
                      <b>${total.toFixed(2)}</b> comes through. Summeray will share her
                      Venmo when she reaches out — send it over and your treats are locked in!
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setItems([]); setBox(null); setOccasion(''); setMessageText('')
                      setFulfillment('pickup'); setContact({ name: '', email: '', phone: '', date: '', notes: '' })
                      setSubmitState('idle'); setPhase('size')
                    }}
                    data-cursor
                  >
                    Build another box 🍓
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="bb-form-heading">Where should we send your confirmation?</h3>
                  <div className="bb-form">
                    <div className="bb-field">
                      <label htmlFor="c-name">Your name *</label>
                      <input id="c-name" type="text" placeholder="Jane Doe" value={contact.name} onChange={updateContact('name')} data-cursor />
                    </div>
                    <div className="bb-field">
                      <label htmlFor="c-email">Email *</label>
                      <input id="c-email" type="email" placeholder="you@email.com" value={contact.email} onChange={updateContact('email')} data-cursor />
                    </div>
                    <div className="bb-field">
                      <label htmlFor="c-phone">Phone (optional)</label>
                      <input id="c-phone" type="tel" placeholder="(555) 123-4567" value={contact.phone} onChange={updateContact('phone')} data-cursor />
                    </div>
                    <div className="bb-field">
                      <label htmlFor="c-date">📅 Date needed by</label>
                      <input id="c-date" type="date" value={contact.date} onChange={updateContact('date')} data-cursor />
                    </div>
                    <div className="bb-field bb-field-full">
                      <label htmlFor="c-notes">{fulfillment === 'delivery' ? 'Delivery address & notes' : 'Notes (optional)'}</label>
                      <textarea id="c-notes" rows={2} placeholder={fulfillment === 'delivery' ? 'Street, city, ZIP — plus anything else we should know' : 'Anything else we should know?'} value={contact.notes} onChange={updateContact('notes')} data-cursor />
                    </div>
                  </div>
                  {submitState === 'error' && <p className="bb-form-error">{submitError}</p>}
                  <div className="bb-summary-actions">
                    <MagneticButton>
                      <button
                        className="btn btn-primary"
                        onClick={submitOrder}
                        disabled={submitState === 'sending'}
                        data-cursor
                      >
                        {submitState === 'sending' ? 'Sending…' : 'Send my order 💌'}
                      </button>
                    </MagneticButton>
                    <button className="btn btn-ghost" onClick={() => setPhase('build')} data-cursor>
                      ← Keep editing
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => { setItems([]); setBox(null); setPhase('size') }}
                      data-cursor
                    >
                      Start over
                    </button>
                  </div>
                  <p className="bb-form-fallback">
                    Prefer email? <a href={mailtoHref()} data-cursor>Open an order draft instead →</a>
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* flying treat overlay */}
      {flying && (
        <div className="bb-fly" ref={flyRef}>
          <TreatSVG
            type={flying.item.treat}
            dip={flying.item.dip}
            drizzle={flying.item.drizzle}
            topping={flying.item.topping}
            width="90"
            height="90"
          />
        </div>
      )}
    </div>
  )
}
