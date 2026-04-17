// ─────────────────────────────────────────────────────────────────────
// PERMISSION MATRIX — dashboard roles
// Workers (PIN-only magazynowi) are a separate concept, not in this matrix.
// ─────────────────────────────────────────────────────────────────────

export type Role = 'owner' | 'admin' | 'manager' | 'worker'
export type DashboardRole = Extract<Role, 'owner' | 'admin' | 'manager'>

export const ROLE_LABEL: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Admin',
  manager: 'Manager',
  worker: 'Pracownik magazynu',
}

export const ROLE_DESCRIPTION: Record<Role, string> = {
  owner:
    'Pełny dostęp. Zarządza subskrypcją, fakturami, członkami zespołu. Jedna osoba per konto (właściciel).',
  admin:
    'Ten sam zakres co owner oprócz zmiany właściciela. Może zapraszać adminów i managerów.',
  manager:
    'Widzi dashboard, zarządza pracownikami magazynu (PIN-ami), przegląda inspekcje. Bez dostępu do rozliczeń.',
  worker:
    'Tylko aplikacja Inspect (PIN na telefonie/tablecie). Nie wchodzi do dashboardu.',
}

export type Action =
  | 'dashboard.view'
  | 'billing.view'
  | 'billing.manage'       // change plan, open Stripe portal
  | 'team.invite'          // send invitations
  | 'team.invite.admin'    // invite with role='admin' (owner only)
  | 'team.remove'
  | 'team.changeRole'
  | 'workers.view'
  | 'workers.create'
  | 'workers.update'       // change PIN / name
  | 'workers.delete'
  | 'inspections.viewAll'
  | 'inspections.create'   // done by worker tool, but managers can use inspect too if ever enabled
  | 'inspections.update'   // override grade, correct notes
  | 'inspections.delete'
  | 'settings.general'     // client name, slug (owner only)

const MATRIX: Record<DashboardRole, Action[]> = {
  owner: [
    'dashboard.view',
    'billing.view',
    'billing.manage',
    'team.invite',
    'team.invite.admin',
    'team.remove',
    'team.changeRole',
    'workers.view',
    'workers.create',
    'workers.update',
    'workers.delete',
    'inspections.viewAll',
    'inspections.create',
    'inspections.update',
    'inspections.delete',
    'settings.general',
  ],
  admin: [
    'dashboard.view',
    'billing.view',
    'billing.manage',
    'team.invite',
    'team.invite.admin',
    'team.remove',
    'team.changeRole',
    'workers.view',
    'workers.create',
    'workers.update',
    'workers.delete',
    'inspections.viewAll',
    'inspections.create',
    'inspections.update',
    'inspections.delete',
    'settings.general',
  ],
  manager: [
    'dashboard.view',
    'billing.view',          // read-only
    'team.invite',           // but can only invite 'manager' or 'worker' (workers don't use invites)
    'workers.view',
    'workers.create',
    'workers.update',
    'workers.delete',
    'inspections.viewAll',
    'inspections.update',    // grade override, notes
  ],
}

export function can(role: DashboardRole | null | undefined, action: Action): boolean {
  if (!role) return false
  return MATRIX[role]?.includes(action) ?? false
}

/** Roles a given role is allowed to invite. */
export function invitableRolesFor(role: DashboardRole): DashboardRole[] {
  if (role === 'owner' || role === 'admin') return ['admin', 'manager']
  if (role === 'manager') return ['manager']
  return []
}

/** True if role can act on a target member with targetRole. */
export function canManageMemberRole(actorRole: DashboardRole, targetRole: DashboardRole): boolean {
  if (actorRole === 'owner') return true
  if (actorRole === 'admin') return targetRole !== 'owner'
  return false
}
