'use client'

import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'

// TODO: Replace REPLACE_THIS with your actual Formspree form ID
const FORMSPREE_URL = 'https://formspree.io/f/REPLACE_THIS'

// TODO: Replace 48XXXXXXXXXX with your actual WhatsApp number (country code + number)
const WHATSAPP_URL = 'https://wa.me/48XXXXXXXXXX'

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

  return (
    <section id="contact" className="py-24 bg-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left col */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E8512A]">
              {c.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-6">
              {c.title}
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">{c.sub}</p>

            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <p>
                <span className="text-white font-medium">{c.email}:</span>{' '}
                <a href="mailto:hello@recovo.com" className="hover:text-[#E8512A] transition-colors">
                  hello@recovo.com
                </a>
              </p>
              <p>
                <span className="text-white font-medium">{c.address}:</span>{' '}
                Laurowa 19b, Wysogotowo, 62-081 Przeźmierowo, Poland
              </p>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1ebe5d] transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              {c.whatsapp}
            </a>
          </div>

          {/* Right col — form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <span className="text-5xl mb-4">✓</span>
                <h3 className="text-xl font-bold text-white mb-2">{c.successTitle}</h3>
                <p className="text-gray-400">{c.successSub}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                    {f.company} *
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    placeholder={f.companyPh}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#E8512A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                    {f.email} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={f.emailPh}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#E8512A] transition-colors"
                  />
                </div>

                {/* Client type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                    {f.clientType} *
                  </label>
                  <select
                    name="clientType"
                    required
                    defaultValue=""
                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E8512A] transition-colors"
                  >
                    <option value="" disabled>—</option>
                    {c.clientTypes.map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                      {f.country} *
                    </label>
                    <select
                      name="country"
                      required
                      defaultValue=""
                      className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E8512A] transition-colors"
                    >
                      <option value="" disabled>{f.countryPh}</option>
                      {c.countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                      {f.volume} *
                    </label>
                    <select
                      name="volume"
                      required
                      defaultValue=""
                      className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E8512A] transition-colors"
                    >
                      <option value="" disabled>{f.volumePh}</option>
                      {c.volumes.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                    {f.message}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={f.messagePh}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#E8512A] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#E8512A] text-white font-semibold py-3.5 rounded-lg hover:bg-[#d14420] transition-colors disabled:opacity-60 text-sm mt-2"
                >
                  {loading ? f.sending : f.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
