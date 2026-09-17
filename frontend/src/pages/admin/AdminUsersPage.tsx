import { useEffect, useState } from 'react';
import { usersService } from '../../services/users.service';
import { useAuth } from '../../contexts/AuthContext';
import { Badge, PageLoader, Select } from '../../components/ui';
import type { Role, User } from '../../types';

const ROLES: Role[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PREPARATEUR', 'LIVREUR', 'CUSTOMER', 'RESTAURANT_OWNER'];

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[] | null>(null);

  function load() {
    usersService.findAll().then(setUsers);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRoleChange(id: string, role: Role) {
    await usersService.updateRole(id, role);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await usersService.remove(id);
    load();
  }

  if (!users) {
    return <PageLoader />;
  }

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Utilisateurs</h1>
      <p className="mt-1 text-sm text-muted">{users.length} compte(s).</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-text">
                  {u.firstName} {u.lastName}
                </td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  {isSuperAdmin ? (
                    <Select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value as Role)} className="w-44">
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Badge className="bg-primary-soft text-primary-dark">{u.role}</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {isSuperAdmin && u.id !== currentUser?.id && (
                    <button onClick={() => handleDelete(u.id)} className="text-sm font-medium text-danger">
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
