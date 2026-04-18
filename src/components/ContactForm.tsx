'use client'

import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'

// TODO: Replace REPLACE_THIS with your actual Formspree form ID
const FORMSPREE_URL = 'https://formspree.io/f/REPLACE_THIS'
// TODO: Replace with real WhatsApp number
const WHATSAPP_URL = 'https://wa.me/48XXXXXXXXXX'

/**
 * ContactForm — reads like a work-order form, not a "leave us a message"
 * card. Carbon background, sharp borders, mono labels, no glass.
 */
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useLang()
  const c = t.contact
  const f = c.fields

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setSubmitted(true)
        form.reset()
      } else {
        alert('Something went wrong. Please try again or email us at hello@recovo.com')
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full bg-transparent border border-carbon-line text-carbon-ink placeholder:text-carbon-ink/40 px-3 py-3 text-sm focus:outline-none focus:border-accent transition-colors duration-micro ease-emil mono'

  return (
    <section
      id="contact"
      className="relative py-3xl bg-carbon text-carbon-ink"
    >
      <div className="max-w-content mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-xl">
          {/* LEFT */}
          <div className="md:col-span-5">
            <p className="label !text-accent mb-4">§.06 · {c.eyebrow}</p>
            <h2 className="text-display-sm md:text-display font-bold text-carbon-ink tracking-[-0.025em] mb-lg">
              {c.title}
            </h2>
            <p className="text-base text-carbon-ink/70 mb-xl leading-[1.6] max-w-sm">
              {c.sub}
            </p>

            <dl className="border-t border-carbon-line">
              <Row k={c.email}>
                <a
                  href="mailto:hello@recovo.com"
                  className="mono text-sm text-accent hover:text-carbon-ink transition-colors duration-micro ease-emil"
                >
                  hello@recovo.com
                </a>
              </Row>
              <Row k={c.address}>
                <span className="text-sm text-carbon-ink/80 leading-[1.5]">
                  Laurowa 19b, Wysogotowo
                  <br />
                  62-081 Przeźmierowo, PL
                </span>
              </Row>
              <Row k="Response SLA">
                <span className="mono text-sm tabular-nums text-carbon-ink">
                  &lt; 4h · business
                </span>
              </Row>
            </dl>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 mt-xl border border-carbon-line hover:border-accent text-carbon-ink px-4 py-3 text-sm font-medium transition-colors duration-micro ease-emil"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              {c.whatsapp}
              <span className="mono ml-auto transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>

          {/* RIGHT — form terminal */}
          <div className="md:col-span-7">
            <div className="border border-carbon-line">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-carbon-line bg-carbon-soft/40">
                <span className="mono text-[10px] uppercase tracking-[0.14em] text-carbon-ink/60">
                  recovo · new / inquiry
                </span>
                <span className="mono text-[10px] tabular-nums text-accent">
                  req#{Math.floor(Math.random() * 8999 + 1000)}
                </span>
              </div>

              <div className="p-xl">
                {submitted ? (
                  <div className="flex flex-col items-start py-lg">
                    <span className="mono text-accent text-sm mb-3">
                      [✓] transmitted
                    </span>
                    <h3 className="text-xl font-bold text-carbon-ink mb-2">
                      {c.successTitle}
                    </h3>
                    <p className="text-sm text-carbon-ink/70">{c.successSub}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
                    <Field label={f.company} required>
                      <input
                        type="text"
                        name="company"
                        required
                        placeholder={f.companyPh}
                        className={inputCls}
                      />
                    </Field>
                    <Field label={f.email} required>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder={f.emailPh}
                        className={inputCls}
                      />
                    </Field>
                    <Field label={f.clientType} required>
                      <select
                        name="clientType"
                        required
                        defaultValue=""
                        className={inputCls}
                      >
                        <option value="" disabled>
                          —
                        </option>
                        {c.clientTypes.map((ct) => (
                          <option key={ct} value={ct}>
                            {ct}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <div className="grid sm:grid-cols-2 gap-lg">
                      <Field label={f.country} required>
                        <select
                          name="country"
                          required
                          defaultValue=""
                          className={inputCls}
                        >
                          <option value="" disabled>
                            {f.countryPh}
                          </option>
                          {c.countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label={f.volume} required>
                        <select
                          name="volume"
                          required
                          defaultValue=""
                          className={inputCls}
                        >
                          <option value="" disabled>
                            {f.volumePh}
                          </option>
                          {c.volumes.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field label={f.message}>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder={f.messagePh}
                        className={`${inputCls} resize-none`}
                      />
                    </Field>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex items-center justify-between gap-2 bg-accent text-carbon-ink font-medium py-3 px-4 hover:bg-accent-deep transition-colors duration-micro ease-emil disabled:opacity-60 text-sm mt-sm"
                    >
                      <span>{loading ? f.sending : f.submit}</span>
                      <span className="mono transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
                        {loading ? '...' : '→'}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-carbon-line gap-6">
      <dt className="mono text-[10px] uppercase tracking-[0.14em] text-carbon-ink/50 pt-1 shrink-0">
        {k}
      </dt>
      <dd className="text-right">{children}</dd>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="mono text-[10px] uppercase tracking-[0.14em] text-carbon-ink/50 flex items-center gap-1.5">
        {label}
        {required && <span className="text-accent">*</span>}
      </span>
      {children}
    </label>
  )
}
