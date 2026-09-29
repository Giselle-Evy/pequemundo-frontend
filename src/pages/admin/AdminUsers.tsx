import { useEffect, useState } from 'react';
import { adminGetUsers } from '../../services/admin';
import type { User } from '../../types';

interface UserWithChildren extends User {
  child_profiles?: Array<{
    id: number;
    name: string;
    age: number;
    avatar: string;
    total_points: number;
  }>;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetUsers();
        setUsers(data as UserWithChildren[]);
      } catch {
        setError('No pudimos cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[#2C160E]">Usuarios</h1>
        <p className="text-lg font-bold text-slate-600 mt-1">
          {users.length} tutores registrados
        </p>
      </div>

      {loading && <p className="text-lg font-bold text-slate-500">Cargando...</p>}
      {error && <p className="text-lg font-bold text-rose-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#FFDBD0] flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#2C160E]">{user.name}</h2>
                  <p className="text-sm font-bold text-slate-500">{user.email}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs font-black text-slate-500 uppercase">
                    Perfiles infantiles
                  </p>
                  <p className="text-2xl font-black text-[#FF7043]">
                    {user.child_profiles?.length || 0}
                  </p>
                </div>
              </div>

              {user.child_profiles && user.child_profiles.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {user.child_profiles.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2"
                    >
                      <span className="text-2xl">{child.avatar}</span>
                      <div>
                        <p className="text-sm font-black text-[#2C160E]">
                          {child.name}
                        </p>
                        <p className="text-xs font-bold text-slate-500">
                          {child.age} años • ⭐ {child.total_points}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-400 italic">
                  Sin perfiles infantiles creados.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}