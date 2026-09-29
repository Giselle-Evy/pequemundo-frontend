import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import ChildTopBar from '../../components/layout/ChildTopBar';
import ExerciseCard from '../../components/ui/ExerciseCard';
import type { ExerciseStatus } from '../../components/ui/ExerciseCard';import ProgressBar from '../../components/ui/ProgressBar';
import { useChild } from '../../contexts/ChildContext';
import { getExercisesBySubject } from '../../services/subjects';
import { getChildProgress } from '../../services/progress';
import type { Subject, Exercise, SubjectProgress } from '../../types';

type FilterType = 'all' | 'completed' | 'pending';

export default function SubjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const subjectId = Number(id);
  const { child } = useChild();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (!child || !subjectId) return;

    async function load() {
      try {
        const [exercisesData, progressData] = await Promise.all([
          getExercisesBySubject(subjectId),
          getChildProgress(child!.id),
        ]);
        setSubject(exercisesData.subject);
        setExercises(exercisesData.exercises);
        const sp = progressData.subjects.find((s) => s.subject_id === subjectId);
        setSubjectProgress(sp || null);
      } catch (err) {
        console.error('Error cargando materia:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [child, subjectId]);

  // Calcular estado de cada ejercicio
  const exerciseStatuses = useMemo<ExerciseStatus[]>(() => {
    if (exercises.length === 0) return [];

    // Índice del primer ejercicio NO completado
    const firstPendingIndex = exercises.findIndex((_, idx) => {
      const exercise = exercises[idx];
      return !isCompleted(exercise.id);
    });

    // Si todos están completados, devolvemos todo como completed
    // Si no, el firstPendingIndex es el "current"
    return exercises.map((_, idx) => {
      if (isCompleted(exercises[idx].id)) return 'completed';
      if (idx === firstPendingIndex) return 'current';
      return 'locked';
    });

    function isCompleted(exerciseId: number): boolean {
  return subjectProgress?.completed_exercise_ids?.includes(exerciseId) ?? false;
}
    
   
  }, [exercises, subjectProgress]);

  const completedCount = subjectProgress?.completed || 0;
  const totalCount = subjectProgress?.total || exercises.length;
  const percentage = subjectProgress?.percentage || 0;
  const visual = {
  color: subject?.color || '#AC3509',
  bgLight: `${subject?.color || '#AC3509'}33`,
};

  // Filtrar ejercicios según el filtro
  const filteredExercises = exercises.filter((_, idx) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return exerciseStatuses[idx] === 'completed';
    return exerciseStatuses[idx] !== 'completed';
  });

  function handlePlay(exerciseId: number) {
    navigate(`/subjects/${subjectId}/exercises/${exerciseId}`);
  }

  return (
    <div
      className="min-h-screen font-nunito flex flex-col relative overflow-x-hidden"
      style={{
        background:
          'linear-gradient(180deg, #70D6FF 0%, #BBE7FE 40%, #FFF3C4 85%, #FEF9E7 100%)',
      }}
    >
      <AnimatedBackground />

      <ChildTopBar backTo="/dashboard" backLabel="Volver al Dashboard" />

      <main className="flex-1 w-full relative z-10 pt-4 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Hero de la materia */}
          {loading && (
            <div className="clay-card p-8 text-center">
              <p className="font-bold text-[#59413A]">Cargando materia...</p>
            </div>
          )}

          {!loading && subject && (
            <section className="clay-card p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                {/* Info */}
                <div className="lg:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shrink-0"
                    style={{
                      backgroundColor: visual.bgLight,
                      boxShadow: `0 12px 0 ${visual.color}44, inset 0 6px 10px rgba(255,255,255,0.9)`,
                    }}
                  >
                    <span className="select-none">{subject.icon}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      <span
                        className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{ backgroundColor: visual.bgLight, color: visual.color }}
                      >
                        {subject.description ? 'Materia' : 'Aprende jugando'}
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black font-baloo text-[#2C160E]">
                      {subject.name}
                    </h1>
                    <p className="text-sm font-bold text-[#59413A] max-w-lg">
                      {subject.description}
                    </p>
                  </div>
                </div>

                {/* Progreso */}
                <div className="bg-white/70 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#2C160E]">Tu progreso</span>
                    <span
                      className="text-lg font-black"
                      style={{ color: visual.color }}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <ProgressBar percentage={percentage} color={visual.color} height={22} />
                  <div className="flex justify-between text-xs font-bold text-[#59413A] px-1">
                    <span>{completedCount} retos listos</span>
                    <span>{totalCount} retos en total</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Filtros */}
          {!loading && exercises.length > 0 && (
            <section className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-black font-baloo text-[#2C160E]">
                Misiones disponibles
              </h2>
              <div className="inline-flex p-1 bg-white/80 rounded-full gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filter === 'all'
                      ? 'text-white'
                      : 'text-[#59413A] hover:bg-[#FFE2DA]'
                  }`}
                  style={
                    filter === 'all'
                      ? { backgroundColor: visual.color, boxShadow: `0 3px 0 ${visual.color}88` }
                      : {}
                  }
                >
                  Todos ({totalCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filter === 'completed'
                      ? 'text-white'
                      : 'text-[#59413A] hover:bg-[#FFE2DA]'
                  }`}
                  style={
                    filter === 'completed'
                      ? { backgroundColor: visual.color, boxShadow: `0 3px 0 ${visual.color}88` }
                      : {}
                  }
                >
                  Completados ({completedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filter === 'pending'
                      ? 'text-white'
                      : 'text-[#59413A] hover:bg-[#FFE2DA]'
                  }`}
                  style={
                    filter === 'pending'
                      ? { backgroundColor: visual.color, boxShadow: `0 3px 0 ${visual.color}88` }
                      : {}
                  }
                >
                  Por jugar ({totalCount - completedCount})
                </button>
              </div>
            </section>
          )}

          {/* Grid de ejercicios */}
          {!loading && filteredExercises.length > 0 && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredExercises.map((exercise) => {
                const originalIndex = exercises.findIndex((e) => e.id === exercise.id);
                const status = exerciseStatuses[originalIndex];
                return (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    number={originalIndex + 1}
                    status={status}
                    onPlay={() => handlePlay(exercise.id)}
                    color={visual.color}
                    bgLight={visual.bgLight}
                  />
                );
              })}
            </section>
          )}

          {!loading && filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg font-bold text-[#59413A]">
                No hay ejercicios en este filtro.
              </p>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}