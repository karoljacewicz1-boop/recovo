'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Client = {
  id: string
  name: string
  email: string | null
  slug: string
  created_at: string
  inspection_count?: number
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function AdminPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)

    const { data: clientList } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (!clientList) { setLoading(false); return }

    // Get inspection counts per client
    const withCounts = await Promise.all(
      clientList.map(async (c) => {
        const { count } = await supabase
          .from('inspections')
          .select('id', { count: 'exact', head: true })
          .eq('client_id', c.id)
        return { ...c, inspection_count: count ?? 0 }
      })
    )

    setClients(withCounts)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManual) setSlug(slugify(name))
  }, [name, slugManual])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    if (!name.trim()) { setFormError('Name is required'); return }
    if (!slug.trim()) { setFormError('Slug is required'); return }

    setSaving(true)
    const { error } = await supabase.from('clients').insert([{
      name: name.trim(),
      email: email.trim() || null,
      slug: slug.trim(),
    }])

    if (error) {
      setFormError(error.message.includes('unique') ? 'That slug is already taken.' : error.message)
    } else {
      setFormSuccess(`Client "${name}" added! Dashboard: /dashboard/${slug}`)
      setName('')
      setEmail('')
      setSlug('')
      setSlugManual(false)
      await load()
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    setDeleting(true)
    // Delete inspections first (FK constraint)
    await supabase.from('inspections').delete().eq('client_id', id)
    await supabase.from('clients').delete().eq('id', id)
    setDeleteId(null)
    setDeleting(false)
    await load()
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">
            Recovo
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-semibold text-gray-500">Admin Panel</span>
        </div>
        <Link
          href="/demo"
          className="text-xs text-gray-400 hover:text-[#E8512A] transition-colors"
        >
          View demo →
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Add new client */}
        <div className="bg-white rounded-2xl border border-gray-100 p-7 mb-10">
          <h2 className="text-lg font-extrabold text-[#1A1A1A] mb-1">Add new client</h2>
          <p className="text-sm text-gray-400 mb-6">
            Each client gets their own dashboard at <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/dashboard/[slug]</code>
          </p>

          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Company name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nordic Style GmbH"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8512A] transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Contact email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="returns@client.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8512A] transition-colors"
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Dashboard slug *
                <span className="ml-2 font-normal text-gray-400 normal-case">
                  → /dashboard/<strong>{slug || 'your-slug'}</strong>
                </span>
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
                  placeholder="nordic-style-gmbh"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E8512A] transition-colors"
                />
                {slugManual && (
                  <button
                    type="button"
                    onClick={() => { setSlugManual(false); setSlug(slugify(name)) }}
                    className="text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap"
                  >
                    ↺ auto
                  </button>
                )}
              </div>
            </div>

            {formError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                {formError}
              </p>
            )}
            {formSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                <p className="text-sm text-green-700 font-medium">{formSuccess}</p>
                <Link
                  href={`/dashboard/${slug.trim() || clients[0]?.slug}`}
                  className="text-xs text-green-600 underline mt-0.5 inline-block hover:text-green-800"
                >
                  Open dashboard →
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="self-start bg-[#E8512A] text-white font-semibold px-7 py-2.5 rounded-xl hover:bg-[#d14420] disabled:opacity-60 transition-colors text-sm flex items-center gap-2"
            >
              {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {saving ? 'Adding...' : '+ Add client'}
            </button>
          </form>
        </div>

        {/* Client list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#1A1A1A]">All clients</h2>
            <span className="text-sm text-gray-400">{clients.length} total</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-[#E8512A] rounded-full animate-spin" />
            </div>
          ) : clients.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
              <p className="text-3xl mb-2">👥</p>
              <p>No clients yet. Add your first one above.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="bg-white rounded-2xl border border-gray-100 px-6 py-4 flex items-center gap-4"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-[#FFF3EF] flex items-center justify-center text-[#E8512A] font-extrabold text-sm flex-shrink-0">
                    {client.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1A1A1A] text-sm">{client.name}</p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <code className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                        /dashboard/{client.slug}
                      </code>
                      {client.email && (
                        <span className="text-xs text-gray-400">{client.email}</span>
                      )}
                      <span className="text-xs text-gray-400">
                        {client.inspection_count} inspection{client.inspection_count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/dashboard/${client.slug}`}
                      className="text-xs font-semibold text-[#E8512A] border border-[#E8512A]/30 px-3 py-1.5 rounded-lg hover:bg-[#FFF3EF] transition-colors"
                    >
                      Dashboard →
                    </Link>
                    {deleteId === client.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400">Sure?</span>
                        <button
                          onClick={() => handleDelete(client.id)}
                          disabled={deleting}
                          className="text-xs text-white bg-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors"
                        >
                          {deleting ? '...' : 'Delete'}
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteId(client.id)}
                        className="text-xs text-gray-300 hover:text-red-400 transition-colors p-1.5"
                        title="Delete client"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete warning modal */}
      {deleteId && !deleting && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-bold text-[#1A1A1A] mb-1">Delete this client?</p>
            <p className="text-sm text-gray-500 mb-5">
              This will also delete all their inspections. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-xl hover:bg-red-600 transition-colors text-sm"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
