import { useId } from 'react'
import { findDip, findDrizzle, findTopping } from '../data/treats.js'

const OUTLINE = 'rgba(74, 44, 42, 0.16)'

function ToppingDots({ topping, spots }) {
  const t = findTopping(topping)
  if (!t.colors.length) return null
  return (
    <g>
      {spots.map(([x, y, r, rot], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={r}
          ry={r * 0.55}
          fill={t.colors[i % t.colors.length]}
          transform={`rotate(${rot} ${x} ${y})`}
        />
      ))}
    </g>
  )
}

export function StrawberrySVG({ dip = 'milk', drizzle = 'none', topping = 'none', ...props }) {
  const id = useId()
  const d = findDip(dip)
  const dz = findDrizzle(drizzle)
  const berry =
    'M60 22 C82 22 96 40 95 60 C94 84 78 104 60 112 C42 104 26 84 25 60 C24 40 38 22 60 22 Z'
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" {...props}>
      <defs>
        <clipPath id={`${id}-berry`}>
          <path d={berry} />
        </clipPath>
      </defs>
      {/* berry body */}
      <path d={berry} fill="#FF5E7E" stroke={OUTLINE} strokeWidth="2" />
      <g clipPath={`url(#${id}-berry)`}>
        {/* seeds on exposed berry */}
        {[[48, 32], [62, 28], [74, 34], [56, 40], [68, 42], [44, 42]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="1.6" ry="2.4" fill="#FFC9D6" />
        ))}
        {/* chocolate dip with wavy edge */}
        <path
          d="M18 52 C30 44 36 56 48 49 C60 42 66 56 78 49 C90 42 96 54 104 48 L104 120 L18 120 Z"
          fill={d.color}
        />
        <path d="M30 62 C36 58 40 66 46 62" stroke={d.shine} strokeWidth="3" fill="none" strokeLinecap="round" />
        {dz.color && (
          <g stroke={dz.color} strokeWidth="3.4" fill="none" strokeLinecap="round">
            <path d="M28 64 L46 76 L34 84 L52 96" />
            <path d="M58 58 L76 70 L62 80 L78 92" />
            <path d="M84 56 L96 66 L86 76" />
          </g>
        )}
        <ToppingDots
          topping={topping}
          spots={[[38, 70, 3, 20], [55, 64, 3, -30], [70, 78, 3, 60], [48, 88, 3, 10], [82, 66, 3, -50], [64, 98, 3, 40], [36, 96, 2.6, -15], [88, 84, 2.6, 75]]}
        />
      </g>
      {/* leafy cap */}
      <g fill="#5CC9A7">
        <path d="M60 10 C63 16 63 20 60 26 C57 20 57 16 60 10 Z" />
        <path d="M42 16 C50 18 55 22 58 28 C50 28 44 24 42 16 Z" />
        <path d="M78 16 C70 18 65 22 62 28 C70 28 76 24 78 16 Z" />
        <path d="M34 28 C42 26 50 28 56 32 C48 36 38 34 34 28 Z" />
        <path d="M86 28 C78 26 70 28 64 32 C72 36 82 34 86 28 Z" />
      </g>
      <circle cx="60" cy="14" r="3" fill="#4BA98C" />
    </svg>
  )
}

export function CakePopSVG({ dip = 'ruby', drizzle = 'none', topping = 'none', ...props }) {
  const id = useId()
  const d = findDip(dip)
  const dz = findDrizzle(drizzle)
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" {...props}>
      <defs>
        <clipPath id={`${id}-ball`}>
          <circle cx="60" cy="46" r="34" />
        </clipPath>
      </defs>
      {/* stick */}
      <rect x="56.5" y="74" width="7" height="40" rx="3.5" fill="#FFF4E3" stroke={OUTLINE} strokeWidth="1.5" />
      {/* ball */}
      <circle cx="60" cy="46" r="34" fill={d.color} stroke={OUTLINE} strokeWidth="2" />
      <g clipPath={`url(#${id}-ball)`}>
        <ellipse cx="47" cy="32" rx="12" ry="7" fill={d.shine} opacity="0.7" transform="rotate(-24 47 32)" />
        {dz.color && (
          <g stroke={dz.color} strokeWidth="3.4" fill="none" strokeLinecap="round">
            <path d="M30 40 Q44 50 36 58 Q30 64 42 70" />
            <path d="M56 26 Q68 36 60 44 Q54 52 66 60" />
            <path d="M80 36 Q90 46 82 54" />
          </g>
        )}
        <ToppingDots
          topping={topping}
          spots={[[42, 50, 3, 30], [60, 60, 3, -20], [76, 48, 3, 70], [52, 68, 3, -60], [70, 30, 3, 15], [34, 60, 2.6, 50], [84, 60, 2.6, -35], [58, 38, 2.6, 80]]}
        />
      </g>
      {/* little bow on the stick */}
      <g fill="#FF9EC0">
        <path d="M60 84 L51 79 L51 89 Z" />
        <path d="M60 84 L69 79 L69 89 Z" />
        <circle cx="60" cy="84" r="2.6" fill="#FF7BAC" />
      </g>
    </svg>
  )
}

export function CrispySVG({ dip = 'dark', drizzle = 'white', topping = 'none', ...props }) {
  const id = useId()
  const d = findDip(dip)
  const dz = findDrizzle(drizzle)
  const slab = 'M24 26 Q22 22 28 21 L92 18 Q98 18 98 24 L96 94 Q96 100 90 100 L30 102 Q24 102 24 96 Z'
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" {...props}>
      <defs>
        <clipPath id={`${id}-slab`}>
          <path d={slab} />
        </clipPath>
      </defs>
      {/* crispy base */}
      <path d={slab} fill="#F3DDB7" stroke={OUTLINE} strokeWidth="2" />
      <g clipPath={`url(#${id}-slab)`}>
        {/* crispy texture */}
        {[[34, 86], [48, 93], [64, 87], [80, 93], [40, 77], [72, 77], [56, 82], [88, 82], [30, 94]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="4.2" ry="2.8" fill="#E2C290" transform={`rotate(${(i * 37) % 80 - 40} ${x} ${y})`} />
        ))}
        {/* chocolate top with wavy melt edge */}
        <path
          d="M18 64 C28 56 34 68 44 61 C54 54 60 68 72 61 C84 54 92 66 104 58 L104 10 L18 10 Z"
          fill={d.color}
        />
        <path d="M34 34 Q44 30 52 34" stroke={d.shine} strokeWidth="3" fill="none" strokeLinecap="round" />
        {dz.color && (
          <g stroke={dz.color} strokeWidth="3.2" fill="none" strokeLinecap="round">
            <path d="M30 24 L44 36 L32 44 L48 56" />
            <path d="M60 22 L74 34 L62 42 L76 54" />
            <path d="M86 26 L94 36" />
          </g>
        )}
        <ToppingDots
          topping={topping}
          spots={[[36, 30, 3, 25], [54, 26, 3, -40], [72, 32, 3, 65], [88, 28, 3, -10], [44, 46, 3, 45], [64, 50, 3, -70], [82, 44, 2.6, 30], [30, 50, 2.6, -25]]}
        />
      </g>
    </svg>
  )
}

export function PretzelSVG({ dip = 'milk', drizzle = 'white', topping = 'none', ...props }) {
  const d = findDip(dip)
  const dz = findDrizzle(drizzle)
  const rope = (
    <>
      <path d="M26 84 A 38 36 0 1 1 94 84" />
      <path d="M30 88 C 44 56 58 54 86 86" />
      <path d="M90 88 C 76 56 62 54 34 86" />
    </>
  )
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" {...props}>
      {/* outline pass */}
      <g stroke={OUTLINE} strokeWidth="17" fill="none" strokeLinecap="round">{rope}</g>
      {/* dip pass */}
      <g stroke={d.color} strokeWidth="14" fill="none" strokeLinecap="round">{rope}</g>
      {/* shine */}
      <g stroke={d.shine} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.8">
        <path d="M34 38 Q46 26 62 26" />
      </g>
      {dz.color && (
        <g stroke={dz.color} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M28 50 L44 58 M40 34 L56 44 M62 28 L74 40 M82 40 L92 52 M44 70 L58 78 M66 72 L80 80" />
        </g>
      )}
      <ToppingDots
        topping={topping}
        spots={[[36, 44, 2.8, 20], [54, 32, 2.8, -35], [76, 38, 2.8, 60], [90, 58, 2.8, -15], [30, 64, 2.8, 45], [58, 72, 2.8, -55], [80, 72, 2.6, 30], [62, 52, 2.6, 70]]}
      />
    </svg>
  )
}

export function OreoSVG({ dip = 'milk', drizzle = 'white', topping = 'none', ...props }) {
  const id = useId()
  const d = findDip(dip)
  const dz = findDrizzle(drizzle)
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" {...props}>
      <defs>
        <clipPath id={`${id}-disc`}>
          <circle cx="60" cy="60" r="44" />
        </clipPath>
      </defs>
      {/* chocolate-coated cookie disc */}
      <circle cx="60" cy="60" r="44" fill={d.color} stroke={OUTLINE} strokeWidth="2" />
      <g clipPath={`url(#${id}-disc)`}>
        {/* subtle inner edge to read as a cookie */}
        <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
        {/* glossy highlight */}
        <ellipse cx="46" cy="44" rx="16" ry="9" fill={d.shine} opacity="0.6" transform="rotate(-24 46 44)" />
        {dz.color && (
          <g stroke={dz.color} strokeWidth="3.4" fill="none" strokeLinecap="round">
            <path d="M22 50 L40 60 L26 68 L44 78" />
            <path d="M50 42 L68 52 L54 62 L72 72" />
            <path d="M78 50 L92 60 L82 70" />
          </g>
        )}
        <ToppingDots
          topping={topping}
          spots={[[44, 48, 3, 20], [60, 42, 3, -30], [76, 50, 3, 60], [50, 62, 3, 10], [68, 64, 3, -50], [60, 78, 3, 40], [38, 66, 2.6, -15], [84, 68, 2.6, 75]]}
        />
      </g>
    </svg>
  )
}

export function CupcakeSVG({ dip = 'ruby', drizzle = 'none', topping = 'none', ...props }) {
  const id = useId()
  const d = findDip(dip)
  const dz = findDrizzle(drizzle)
  const frostCircles = (
    <>
      <ellipse cx="60" cy="68" rx="32" ry="15" />
      <circle cx="44" cy="58" r="14" />
      <circle cx="76" cy="58" r="14" />
      <circle cx="60" cy="54" r="17" />
      <circle cx="51" cy="45" r="12" />
      <circle cx="69" cy="45" r="12" />
      <circle cx="60" cy="37" r="12" />
      <circle cx="60" cy="29" r="9" />
    </>
  )
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" {...props}>
      <defs>
        <clipPath id={`${id}-frost`}>{frostCircles}</clipPath>
      </defs>
      {/* wrapper / liner */}
      <path d="M34 70 L86 70 L80 110 Q80 112 78 112 L42 112 Q40 112 40 110 Z" fill="#FFB3CB" stroke={OUTLINE} strokeWidth="2" />
      <g stroke="#F48FB1" strokeWidth="2.4" strokeLinecap="round">
        <path d="M48 74 L46 110" />
        <path d="M60 74 L60 110" />
        <path d="M72 74 L74 110" />
        <path d="M41 74 L39.5 108" />
        <path d="M79 74 L80.5 108" />
      </g>
      {/* soft shadow under the frosting blob */}
      <g fill={OUTLINE} transform="translate(0 2.5)">{frostCircles}</g>
      {/* frosting swirl */}
      <g fill={d.color}>{frostCircles}</g>
      <g clipPath={`url(#${id}-frost)`}>
        <ellipse cx="50" cy="42" rx="11" ry="6" fill={d.shine} opacity="0.65" transform="rotate(-22 50 42)" />
        {dz.color && (
          <g stroke={dz.color} strokeWidth="3.2" fill="none" strokeLinecap="round">
            <path d="M40 50 L52 58 L42 66" />
            <path d="M60 44 L72 52 L62 62" />
            <path d="M74 56 L84 62" />
          </g>
        )}
        <ToppingDots
          topping={topping}
          spots={[[46, 52, 3, 20], [60, 46, 3, -30], [74, 54, 3, 60], [52, 62, 3, 10], [68, 62, 3, -50], [60, 34, 3, 40], [40, 60, 2.6, -15], [80, 62, 2.6, 75]]}
        />
      </g>
      {/* cherry on top */}
      <path d="M60 26 Q63 18 69 16" stroke="#5CC9A7" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="24" r="6" fill="#FF5E7E" stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="58" cy="22" r="1.8" fill="#FFC9D6" />
    </svg>
  )
}

export function TreatSVG({ type = 'strawberry', ...props }) {
  switch (type) {
    case 'cakepop':
      return <CakePopSVG {...props} />
    case 'crispy':
      return <CrispySVG {...props} />
    case 'pretzel':
      return <PretzelSVG {...props} />
    case 'oreo':
      return <OreoSVG {...props} />
    case 'cupcake':
      return <CupcakeSVG {...props} />
    default:
      return <StrawberrySVG {...props} />
  }
}
