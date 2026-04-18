'use client'

import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'

// TODO: Replace with your real Formspree form ID
const FORMSPREE_URL = 'https://formspree.io/f/REPLACE_THIS'
// TODO: Replace with real WhatsApp number
const WHATSAPP_URL = 'https://wa.me/48XXXXXXXXXX'

/**
 * ContactForm — polished, warm. Rounded inputs, sans labels, no
 * terminal header or request numbers.
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
        alert('Coś poszło nie tak. Spróbuj ponownie lub napisz na hello@recovo.com')
      }
    } catch {
      alert('Błąd sieci. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full bg-carbon-soft/40 border border-carbon-line text-carbon-ink placeholder:text-carbon-ink/40 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-accent focus:bg-carbon-soft/60 transition-colors duration-micro ease-emil'

  return (
    <section id="contact" className="relative py-3xl bg-carbon text-carbon-ink">
      <div className="max-w-content mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-xl">
          {/* LEFT */}
          <div className="md:col-span-5">
            <p className="eyebrow mb-3">{c.eyebrow}</p>
            <h2 className="text-display-sm md:text-display font-bold text-carbon-ink tracking-[-0.025em] mb-lg">
              {c.title}
            </h2>
            <p className="text-base text-carbon-ink/70 mb-xl leading-[1.6] max-w-sm">
              {c.sub}
            </p>

            <div className="space-y-md">
              <ContactItem
                label={c.email}
                value={
                  <a
                    href="mailto:hello@recovo.com"
                    className="text-accent hover:text-carbon-ink transition-colors duration-micro ease-emil font-medium"
                  >
                    hello@recovo.com
                  </a>
                }
              />
              <ContactItem
                label={c.address}
                value={
                  <span className="text-sm text-carbon-ink/80 leading-[1.5]">
                    Laurowa 19b, Wysogotowo
                    <br />
                    62-081 Przeźmierowo
                  </span>
                }
              />
              <ContactItem
                label="Odpowiadamy"
                value={
                  <span className="text-sm text-carbon-ink/80">
                    W ciągu 4h w dni robocze
                  </span>
                }
              />
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 mt-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 py-3 rounded-md text-sm font-semibold transition-colors duration-micro ease-emil"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              {c.whatsapp}
            </a>
          </div>

          {/* RIGHT — form */}
          <div className="md:col-span-7">
            <div className="rounded-xl bg-carbon-soft/30 border border-carbon-line p-xl">
              {submitted ? (
                <div className="flex flex-col items-start py-lg">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-carbon-ink mb-lg text-xl">
                    ✓
                  </span>
                  <h3 className="text-2xl font-bold text-carbon-ink mb-2">
                    {c.successTitle}
                  </h3>
                  <p className="text-sm text-carbon-ink/70">{c.successSub}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-md">
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
                      <option value="" disabled>—</option>
                      {c.clientTypes.map((ct) => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-md">
                    <Field label={f.country} required>
                      <select
                        name="country"
                        required
                        defaultValue=""
                        className={inputCls}
                      >
                        <option value="" disabled>{f.countryPh}</option>
                        {c.countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
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
                        <option value="" disabled>{f.volumePh}</option>
                        {c.volumes.map((v) => (
                          <option key={v} value={v}>{v}</option>
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
                    className="group inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-deep text-carbon-ink font-semibold py-3.5 px-5 rounded-md transition-colors duration-micro ease-emil disabled:opacity-60 text-sm mt-sm"
                  >
                    <span>{loading ? f.sending : f.submit}</span>
                    <span className="transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
                      →
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactItem({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-carbon-ink/50">{label}</span>
      <div>{value}</div>
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
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-carbon-ink/80">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </span>
      {children}
    </label>
  )
}
