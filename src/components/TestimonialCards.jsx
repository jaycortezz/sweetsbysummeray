/*
 * ARCHIVED — original testimonials section.
 *
 * The homepage testimonials are temporarily replaced with a "Coming soon"
 * card until real reviews are ready. This file preserves the original
 * component so it can be dropped back in. Nothing imports it right now, so
 * it is tree-shaken out of the production bundle.
 *
 * TO RESTORE:
 *   1. In src/pages/Home.jsx, add the import:
 *        import TestimonialCards from '../components/TestimonialCards.jsx'
 *   2. Replace the "coming soon" block inside <section id="love"> with the
 *      original markup below:
 *
 *      <div className="section-head" data-reveal>
 *        <span className="section-kicker">Sweet words</span>
 *        <h2 className="section-title">People are <em>melting.</em></h2>
 *      </div>
 *      <TestimonialCards />
 *
 *   3. (Optional) Swap the placeholder quotes below for real reviews.
 *
 * The .testi-row / .testi-card styles are still present in global.css.
 */

export default function TestimonialCards() {
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
