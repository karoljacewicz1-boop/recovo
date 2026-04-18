'use client'

import { useLang } from '@/lib/LanguageContext'

/**
 * Testimonials — rounded cards, friendly avatars, star ratings.
 * Placeholder content is framed as "pilot clients" without the terminal
 * language.
 */
export default function Testimonials() {
  const { t } = useLang()
  const te = t.testimonials

  return (
    <section className="relative py-3xl">
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-2xl">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">{te.eyebrow}</p>
            <h2 className="text-display-sm lg:text-display font-bold text-ink tracking-[-0.025em]">
              {te.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-8">
            <p className="text-sm text-ink-mute">
              Opinie z naszego programu pilotażowego — 2025 Q1.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-lg">
          {te.items.map((item, i) => (
            <figure
              key={i}
              className="p-lg rounded-xl bg-bg border border-border hover:shadow-card transition-shadow duration-base ease-emil flex flex-col"
            >
              <div className="flex gap-0.5 text-accent mb-md">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg
                    key={j}
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-base text-ink leading-[1.6] mb-lg flex-1">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <figcaption className="pt-md border-t border-border flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-accent-tint text-accent flex items-center justify-center font-semibold text-sm">
                  {item.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-ink-mute">{te.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
