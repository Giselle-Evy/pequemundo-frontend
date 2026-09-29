import { useEffect, useState } from 'react';
import Modal from '../../components/admin/Modal';
import {
  adminGetSubjects,
  adminGetExercises,
  adminCreateExercise,
  adminUpdateExercise,
  adminDeleteExercise,
} from '../../services/admin';
import type { Subject, Exercise } from '../../types';
import type { ExercisePayload } from '../../services/admin';

interface OptionForm {
  option_text: string;
  is_correct: boolean;
}

export default function AdminExercises() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [saving, setSaving] = useState(false);

  const [subjectId, setSubjectId] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [instructions, setInstructions] = useState('');
  const [pointsReward, setPointsReward] = useState(10);
  const [options, setOptions] = useState<OptionForm[]>([
    { option_text: '', is_correct: true },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetSubjects();
        setSubjects(data);
        if (data.length > 0) setSelectedSubjectId(data[0].id);
      } catch {
        console.error('Error cargando materias');
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (selectedSubjectId) loadExercises(selectedSubjectId);
  }, [selectedSubjectId]);

  async function loadExercises(sid: number) {
    setLoading(true);
    try {
      const data = await adminGetExercises(sid);
      setExercises(data);
    } catch {
      console.error('Error cargando ejercicios');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    if (!selectedSubjectId) return;
    setEditing(null);
    setSubjectId(selectedSubjectId);
    setTitle('');
    setQuestion('');
    setInstructions('');
    setPointsReward(10);
    setOptions([
      { option_text: '', is_correct: true },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ]);
    setModalOpen(true);
  }

  function openEdit(exercise: Exercise) {
    setEditing(exercise);
    setSubjectId(exercise.subject_id);
    setTitle(exercise.title);
    setQuestion(exercise.question);
    setInstructions(exercise.instructions || '');
    setPointsReward(exercise.points_reward);
    setOptions(
      exercise.options.map((o) => ({
        option_text: o.option_text,
        is_correct: o.is_correct,
      }))
    );
    setModalOpen(true);
  }

  function updateOption(index: number, field: keyof OptionForm, value: string | boolean) {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt))
    );
  }

  function markCorrect(index: number) {
    setOptions((prev) =>
      prev.map((opt, i) => ({ ...opt, is_correct: i === index }))
    );
  }

  async function handleSave() {
    if (!title.trim() || !question.trim() || !subjectId) return;
    if (options.some((o) => !o.option_text.trim())) {
      alert('Todas las opciones deben tener texto.');
      return;
    }
    if (!options.some((o) => o.is_correct)) {
      alert('Debes marcar una opción como correcta.');
      return;
    }

    setSaving(true);
    try {
      const payload: ExercisePayload = {
        subject_id: subjectId,
        title: title.trim(),
        question: question.trim(),
        instructions: instructions.trim() || undefined,
        points_reward: pointsReward,
        options,
      };

      if (editing) {
        await adminUpdateExercise(editing.id, payload);
      } else {
        await adminCreateExercise(payload);
      }

      if (selectedSubjectId) await loadExercises(selectedSubjectId);
      setModalOpen(false);
    } catch {
      alert('Error al guardar el ejercicio.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(exercise: Exercise) {
    if (!confirm(`¿Eliminar "${exercise.title}"?`)) return;
    try {
      await adminDeleteExercise(exercise.id);
      setExercises((prev) => prev.filter((e) => e.id !== exercise.id));
    } catch {
      alert('Error al eliminar el ejercicio.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#2C160E]">Ejercicios</h1>
          <p className="text-lg font-bold text-slate-600 mt-1">
            {exercises.length} ejercicios en esta materia
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedSubjectId || ''}
            onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
            className="px-4 py-3 rounded-2xl border-2 border-slate-200 font-bold outline-none focus:border-[#FF7043]"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={openCreate}
            className="px-6 py-3 rounded-2xl bg-[#FF7043] text-white font-black shadow-lg hover:brightness-110 transition flex items-center gap-2"
          >
            <span>➕</span>
            <span>Nuevo Ejercicio</span>
          </button>
        </div>
      </div>

      {loading && <p className="text-lg font-bold text-slate-500">Cargando...</p>}

      {!loading && (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-black text-slate-600 uppercase">#</th>
                <th className="text-left px-6 py-4 text-sm font-black text-slate-600 uppercase">Título</th>
                <th className="text-left px-6 py-4 text-sm font-black text-slate-600 uppercase">Pregunta</th>
                <th className="text-left px-6 py-4 text-sm font-black text-slate-600 uppercase">Puntos</th>
                <th className="text-right px-6 py-4 text-sm font-black text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((ex) => (
                <tr key={ex.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-black text-slate-500">{ex.order}</td>
                  <td className="px-6 py-4 font-black text-[#2C160E]">{ex.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">{ex.question}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">+{ex.points_reward}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => openEdit(ex)}
                      className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm hover:bg-blue-200 transition"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ex)}
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
        title={editing ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-black text-slate-700 mb-1">Materia</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF7043] outline-none font-bold"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-1">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF7043] outline-none font-bold"
              placeholder="Ej. Los mamíferos"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-1">Pregunta *</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF7043] outline-none font-bold"
              rows={2}
              placeholder="¿Cuál de estos animales es un mamífero?"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-1">Instrucciones</label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF7043] outline-none font-bold"
              placeholder="Elige la respuesta correcta."
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-1">Puntos</label>
            <input
              type="number"
              value={pointsReward}
              onChange={(e) => setPointsReward(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF7043] outline-none font-bold"
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">
              Opciones (marca la correcta) *
            </label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => markCorrect(i)}
                    className={`w-10 h-10 rounded-xl font-black transition ${
                      opt.is_correct
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                    }`}
                  >
                    {opt.is_correct ? '✓' : String.fromCharCode(65 + i)}
                  </button>
                  <input
                    type="text"
                    value={opt.option_text}
                    onChange={(e) => updateOption(i, 'option_text', e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF7043] outline-none font-bold"
                    placeholder={`Opción ${String.fromCharCode(65 + i)}`}
                  />
                </div>
              ))}
            </div>
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
              {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear ejercicio'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}