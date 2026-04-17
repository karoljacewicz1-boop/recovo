'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'

// ── Types ──────────────────────────────────────────────────────────────
type Worker = {
  id: string
  name: string
  role: string
  created_at: string
}

type DashboardRole = 'owner' | 'admin' | 'manager'

type Member = {
  id: string
  userId: string
  email: string
  role: DashboardRole
  createdAt: string
  isYou: boolean
}

type Invitation = {
  id: string
  email: string
  role: 'admin' | 'manager'
  expires_at: string
  created_at: string
}

const ROLE_LABEL: Record<DashboardRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  manager: 'Manager',
}

// Roles this viewer can invite
function invitable(viewerRole: DashboardRole | null): Array<'admin' | 'manager'> {
  if (!viewerRole) return []
  if (viewerRole === 'owner' || viewerRole === 'admin') return ['admin', 'manager']
  return ['manager']
}

// Roles this viewer can assign to a given member (excluding 'owner' — that's a
// separate transfer-of-ownership flow). We always include the current role so
// the <select> can show it.
function assignableRoles(viewerRole: DashboardRole | null, targetRole: DashboardRole): DashboardRole[] {
  if (!viewerRole) return [targetRole]
  if (viewerRole === 'owner') return ['owner', 'admin', 'manager']
  if (viewerRole === 'admin') return ['admin', 'manager']
  return [targetRole]
}

export default function TeamPage() {
  const params = useParams()
  const slug = params.slug as string

  // ── Dashboard members state ──────────────────────────────────────────
  const [viewerRole, setViewerRole] = useState<DashboardRole | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [membersLoading, setMembersLoading] = useState(true)
  const [inviteForm, setInviteForm] = useState<{
    email: string
    role: 'admin' | 'manager'
  }>({ email: '', role: 'manager' })
  const [inviteBusy, setInviteBusy] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [justInvitedLink, setJustInvitedLink] = useState<string | null>(null)
  const [copiedInvite, setCopiedInvite] = useState(false)

  // ── Workers (PIN) state ──────────────────────────────────────────────
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', pin: '', role: 'worker' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editPin, setEditPin] = useState('')
  const [copied, setCopied] = useState(false)

  const inspectUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/inspect?c=${slug}`
      : `/inspect?c=${slug}`

  // ── Data loaders ─────────────────────────────────────────────────────
  const loadMembers = useCallback(async () => {
    setMembersLoading(true)
    const res = await fetch(`/api/team/members?slug=${slug}`)
    if (res.ok) {
      const data = await res.json()
      setViewerRole(data.role ?? null)
      setMembers(data.members ?? [])
      setInvitations(data.invitations ?? [])
    }
    setMembersLoading(false)
  }, [slug])

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/workers?slug=${slug}`)
    const data = await res.json()
    setWorkers(data.workers ?? [])
    setLoading(false)
  }, [slug])

  useEffect(() => {
    load()
    loadMembers()
  }, [load, loadMembers])

  // ── Invite actions ───────────────────────────────────────────────────
  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteBusy(true)
    setInviteError('')
    setJustInvitedLink(null)
    const res = await fetch('/api/team/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, email: inviteForm.email.trim(), role: inviteForm.role }),
    })
    const data = await res.json()
    setInviteBusy(false)
    if (!res.ok) {
      setInviteError(data.error ?? 'Nie udało się utworzyć zaproszenia.')
      return
    }
    setJustInvitedLink(data.link ?? null)
    setInviteForm({ email: '', role: inviteForm.role })
    loadMembers()
  }

  async function revokeInvite(id: string) {
    if (!confirm('Cofnąć to zaproszenie? Link przestanie działać.')) return
    const res = await fetch(
      `/api/team/invite?id=${id}&slug=${slug}`,
      { method: 'DELETE' },
    )
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error ?? 'Nie udało się cofnąć zaproszenia.')
      return
    }
    loadMembers()
  }

  async function changeMemberRole(m: Member, newRole: DashboardRole) {
    if (newRole === m.role) return
    const needsConfirm = newRole === 'owner'
    if (
      needsConfirm &&
      !confirm(
        'Przekazujesz rolę właściciela. Twoja rola zostanie obniżona do admin. Kontynuować?',
      )
    )
      return
    const res = await fetch('/api/team/members', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, membershipId: m.id, newRole }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error ?? 'Nie udało się zmienić roli.')
      return
    }
    loadMembers()
  }

  async function removeMember(m: Member) {
    const message = m.isYou
      ? 'Opuścić ten tenant? Stracisz do niego dostęp.'
      : `Usunąć ${m.email} z zespołu?`
    if (!confirm(message)) return
    const res = await fetch(
      `/api/team/members?id=${m.id}&slug=${slug}`,
      { method: 'DELETE' },
    )
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error ?? 'Nie udało się usunąć członka zespołu.')
      return
    }
    if (m.isYou) {
      window.location.href = '/login'
      return
    }
    loadMembers()
  }

  async function copyInviteLink(link: string) {
    await navigator.clipboard.writeText(link)
    setCopiedInvite(true)
    setTimeout(() => setCopiedInvite(false), 2000)
  }

  // ── Workers (PIN) actions ────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/workers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, ...form }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      setSaving(false)
      return
    }
    setForm({ name: '', pin: '', role: 'worker' })
    setShowAdd(false)
    setSaving(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Usunąć tego pracownika?')) return
    const res = await fetch(`/api/workers?id=${id}&slug=${slug}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error ?? 'Nie udało się usunąć pracownika.')
      return
    }
    load()
  }

  async function handleUpdatePin(id: string) {
    if (!editPin || editPin.length < 4) {
      setError('PIN musi mieć min. 4 cyfry')
      return
    }
    setSaving(true)
    const res = await fetch('/api/workers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, slug, pin: editPin }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Nie udało się zmienić PIN-u.')
    }
    setEditId(null)
    setEditPin('')
    setSaving(false)
    load()
  }

  function copyUrl() {
    navigator.clipboard.writeText(inspectUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── UI ───────────────────────────────────────────────────────────────
  const canInvite = !!viewerRole // owner/admin/manager — all can invite (matrix enforced server-side)
  const availableInviteRoles = invitable(viewerRole)

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Zespół</p>
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Zarządzanie zespołem</h1>
        <p className="text-gray-400 text-sm mt-1">
          Członkowie panelu (dashboard) i pracownicy magazynu (Inspect PIN).
        </p>
      </div>

      {/* ── DASHBOARD MEMBERS ────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-widest">
            Członkowie panelu
          </h2>
          {viewerRole && (
            <span className="text-xs text-gray-400">
              Twoja rola: <span className="font-semibold text-[#1A1A1A]">{ROLE_LABEL[viewerRole]}</span>
            </span>
          )}
        </div>

        {/* Invite form */}
        {canInvite && availableInviteRoles.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Zaproś nowego członka
            </p>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="email@firma.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E8512A]"
              />
              <select
                value={inviteForm.role}
                onChange={(e) =>
                  setInviteForm((f) => ({ ...f, role: e.target.value as 'admin' | 'manager' }))
                }
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E8512A]"
              >
                {availableInviteRoles.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={inviteBusy}
                className="bg-[#E8512A] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#D4431F] transition disabled:opacity-60"
              >
                {inviteBusy ? 'Wysyłanie…' : 'Wyślij zaproszenie'}
              </button>
            </form>
            {inviteError && <p className="text-red-500 text-xs mt-2">{inviteError}</p>}

            {justInvitedLink && (
              <div className="mt-4 bg-[#FFF3EF] border border-[#E8512A]/30 rounded-lg p-3">
                <p className="text-xs font-semibold text-[#E8512A] uppercase tracking-wide mb-1.5">
                  Link zaproszenia (skopiuj i wyślij)
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white border border-[#E8512A]/20 rounded px-2 py-1.5 text-xs font-mono text-[#1A1A1A] truncate">
                    {justInvitedLink}
                  </code>
                  <button
                    onClick={() => copyInviteLink(justInvitedLink)}
                    className="flex-shrink-0 bg-[#E8512A] text-white text-xs font-semibold px-2.5 py-1.5 rounded hover:bg-[#D4431F] transition"
                  >
                    {copiedInvite ? '✓ OK' : 'Kopiuj'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Link działa 14 dni. Zaproszony musi zalogować się adresem, na który dostał zaproszenie.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pending invitations */}
        {invitations.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 mb-4">
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Oczekujące zaproszenia ({invitations.length})
              </p>
            </div>
            <ul className="divide-y divide-gray-50">
              {invitations.map((inv) => {
                const expired = new Date(inv.expires_at).getTime() < Date.now()
                return (
                  <li key={inv.id} className="px-5 py-3 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1A1A1A] truncate">{inv.email}</p>
                      <p className="text-xs text-gray-400">
                        {ROLE_LABEL[inv.role]} ·{' '}
                        {expired ? (
                          <span className="text-red-500 font-semibold">Wygasło</span>
                        ) : (
                          <>Wygasa {new Date(inv.expires_at).toLocaleDateString('pl-PL')}</>
                        )}
                      </p>
                    </div>
                    {canInvite && (
                      <button
                        onClick={() => revokeInvite(inv.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        Cofnij
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Active members */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Aktywni członkowie ({members.length})
            </p>
          </div>
          {membersLoading ? (
            <div className="px-5 py-8 text-center">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-[#E8512A] rounded-full animate-spin mx-auto" />
            </div>
          ) : members.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              Brak członków.
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {members.map((m) => {
                const canChangeRole =
                  viewerRole && viewerRole !== 'manager' && !(m.role === 'owner' && viewerRole === 'admin')
                const canRemove =
                  viewerRole === 'owner' ||
                  (viewerRole === 'admin' && m.role !== 'owner') ||
                  m.isYou
                const options = assignableRoles(viewerRole, m.role)
                return (
                  <li key={m.id} className="px-5 py-3 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FFF3EF] flex items-center justify-center text-[#E8512A] font-bold text-sm flex-shrink-0">
                      {m.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                        {m.email}
                        {m.isYou && (
                          <span className="ml-2 text-xs text-gray-400 font-normal">(Ty)</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">
                        Dołączył: {new Date(m.createdAt).toLocaleDateString('pl-PL')}
                      </p>
                    </div>

                    {canChangeRole ? (
                      <select
                        value={m.role}
                        onChange={(e) => changeMemberRole(m, e.target.value as DashboardRole)}
                        disabled={m.isYou && m.role === 'owner'}
                        className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8512A] bg-white"
                      >
                        {options.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs font-semibold text-[#1A1A1A] bg-gray-50 px-2.5 py-1 rounded-lg">
                        {ROLE_LABEL[m.role]}
                      </span>
                    )}

                    {canRemove && (
                      <button
                        onClick={() => removeMember(m)}
                        className="text-xs text-red-400 hover:text-red-600 transition px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        {m.isYou ? 'Opuść' : 'Usuń'}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ── WAREHOUSE WORKERS (PIN) ──────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-widest mb-3">
          Pracownicy magazynu (Inspect)
        </h2>

        {/* Inspect URL box */}
        <div className="bg-[#FFF3EF] border border-[#E8512A]/30 rounded-xl p-5 mb-4">
          <p className="text-xs font-semibold text-[#E8512A] uppercase tracking-wide mb-1">
            Link do Inspect dla pracowników
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Wyślij ten link lub wydrukuj jako QR code — pracownicy logują się PIN-em.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white border border-[#E8512A]/20 rounded-lg px-3 py-2 text-xs font-mono text-[#1A1A1A] truncate">
              {inspectUrl}
            </code>
            <button
              onClick={copyUrl}
              className="flex-shrink-0 bg-[#E8512A] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#D4431F] transition"
            >
              {copied ? '✓ Skopiowano' : 'Kopiuj'}
            </button>
            <a
              href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inspectUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              QR
            </a>
          </div>
        </div>

        {/* Workers list */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-bold text-[#1A1A1A]">
              Pracownicy{' '}
              {workers.length > 0 && (
                <span className="text-gray-400 font-normal">({workers.length})</span>
              )}
            </p>
            <button
              onClick={() => {
                setShowAdd(true)
                setError('')
              }}
              className="bg-[#E8512A] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#D4431F] transition"
            >
              + Dodaj
            </button>
          </div>

          {/* Add form */}
          {showAdd && (
            <form onSubmit={handleAdd} className="px-5 py-4 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Nowy pracownik
              </p>
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  required
                  placeholder="Imię i nazwisko"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="flex-1 min-w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E8512A]"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  minLength={4}
                  maxLength={6}
                  placeholder="PIN (4–6 cyfr)"
                  value={form.pin}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pin: e.target.value.replace(/\D/g, '') }))
                  }
                  className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E8512A]"
                />
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E8512A]"
                >
                  <option value="worker">Pracownik</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#E8512A] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#D4431F] transition disabled:opacity-60"
                >
                  {saving ? 'Zapisywanie…' : 'Zapisz'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="text-gray-500 text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Anuluj
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="px-5 py-8 text-center">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-[#E8512A] rounded-full animate-spin mx-auto" />
            </div>
          ) : workers.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              Brak pracowników — dodaj pierwszego powyżej.
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {workers.map((w) => (
                <li key={w.id} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#FFF3EF] flex items-center justify-center text-[#E8512A] font-bold text-sm flex-shrink-0">
                    {w.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">{w.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{w.role}</p>
                  </div>

                  {editId === w.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        minLength={4}
                        maxLength={6}
                        placeholder="Nowy PIN"
                        value={editPin}
                        onChange={(e) => setEditPin(e.target.value.replace(/\D/g, ''))}
                        className="w-28 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E8512A]"
                      />
                      <button
                        onClick={() => handleUpdatePin(w.id)}
                        disabled={saving}
                        className="text-xs bg-[#E8512A] text-white px-2.5 py-1.5 rounded-lg hover:bg-[#D4431F] transition"
                      >
                        Zapisz
                      </button>
                      <button
                        onClick={() => {
                          setEditId(null)
                          setEditPin('')
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditId(w.id)
                          setEditPin('')
                        }}
                        className="text-xs text-gray-400 hover:text-[#E8512A] transition px-2 py-1 rounded-lg hover:bg-gray-50"
                      >
                        Zmień PIN
                      </button>
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        Usuń
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
