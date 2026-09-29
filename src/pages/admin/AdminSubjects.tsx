import { useEffect, useState } from 'react';
import Modal from '../../components/admin/Modal';
import {
  adminGetSubjects,
  adminCreateSubject,
  adminUpdateSubject,
  adminDeleteSubject,
} from '../../services/admin';
import type { Subject } from '../../types';
import type { SubjectPayload } from '../../services/admin';

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#FF7043');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    setLoading(true);
    try {
      const data = await adminGetSubjects();
      setSubjects(data);
    } catch {
      setError('No pudimos cargar las materias.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setName('');
    setIcon('');
    setColor('#FF7043');
    setDescription('');
    setOrder(subjects.length + 1);
    setModalOpen(true);
  }

  function openEdit(subject: Subject) {
    setEditing(subject);
    setName(subject.name);
    setIcon(subject.icon);
    setColor(subject.color);
    setDescription(subject.description || '');
    setOrder(subject.order);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const payload: SubjectPayload = {
        name: name.trim(),
        icon: icon.trim(),
        color: color,
        description: description.trim(),
        order,
        };

      if (editing) {
        const updated = await adminUpdateSubject(editing.id, payload);
        setSubjects((prev) =>
          prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
        );
      } else {
        const created = await adminCreateSubject(payload);
        setSubjects((prev) => [...prev, { ...created, exercises_count: 0 }]);
      }
      setModalOpen(false);
    } catch {
      alert('Error al guardar la materia.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(subject: Subject) {
    if (!confirm(`¿Eliminar "${subject.name}"? Se eliminarán todos sus ejercicios.`)) return;
    try {
      await adminDeleteSubject(subject.id);
      setSubjects((prev) => prev.filter((s) => s.id !== subject.id));
    } catch {
      alert('Error al eliminar la materia.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-[#2C160E]">Materias</h1>
          <p className="text-lg font-bold text-slate-600 mt-1">
            {subjects.length} materias en total
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-6 py-3 rounded-2xl bg-[#FF7043] text-white font-black shadow-lg hover:brightness-110 transition flex items-center gap-2"
        >
          <span>➕</span>
          <span>Nueva Materia</span>
        </button>
      </div>

      {loading && <p className="text-lg font-bold text-slate-500">Cargando...</p>}
      {error && <p className="text-lg font-bold text-rose-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-black text-slate-600 uppercase">
                  Icono
                </th>
                <th className="text-left px-6 py-4 text-sm font-black text-slate-600 uppercase">
                  Nombre
                </th>
                <th className="text-left px-6 py-4 text-sm font-black text-slate-600 uppercase">
                  Descripción
                </th>
                <th className="text-left px-6 py-4 text-sm font-black text-slate-600 uppercase">
                  Ejercicios
                </th>
                <th className="text-right px-6 py-4 text-sm font-black text-slate-600 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-3xl">{subject.icon}</td>
                  <td className="px-6 py-4 font-black text-[#2C160E]">{subject.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                    {subject.description}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {subject.exercises_count}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => openEdit(subject)}
                      className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm hover:bg-blue-200 transition"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(subject)}
                      className="px-4 py-2 rounded-xl bg-rose-100 text-rose-700 font-bold text-sm hover:bg-rose-200 transition"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Materia' : 'Nueva Materia'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-black text-slate-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF7043] outline-none font-bold"
              placeholder="Ej. Matemáticas"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-1">Emoji</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF7043] outline-none font-bold text-2xl text-center"
                placeholder="🔢"
                maxLength={4}
              />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-1">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-[50px] rounded-xl border-2 border-slate-200 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-black text-slate-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF7043] outline-none font-bold"
              rows={3}
              placeholder="Describe brevemente la materia..."
            />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-700 mb-1">Orden</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF7043] outline-none font-bold"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 font-black hover:bg-slate-200 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 rounded-2xl bg-[#FF7043] text-white font-black shadow-lg hover:brightness-110 transition disabled:opacity-50"
            >
              {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear materia'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}