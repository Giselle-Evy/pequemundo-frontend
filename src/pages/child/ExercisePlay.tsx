import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import ChildTopBar from '../../components/layout/ChildTopBar';
import ProgressMeter from '../../components/ui/ProgressMeter';
import ExerciseOption from '../../components/ui/ExerciseOption';
import MatchingExercise from '../../components/ui/MatchingExercise';
import TrueFalseExercise from '../../components/ui/TrueFalseExercise';
import SuccessFeedback from '../../components/ui/SuccessFeedback';
import RetryFeedback from '../../components/ui/RetryFeedback';
import AchievementPopup from '../../components/ui/AchievementPopup';
import FillBlankExercise from '../../components/ui/FillBlankExercise';
import SubscriptionRequiredModal from '../../components/ui/SubscriptionRequiredModal';
import { useChild } from '../../contexts/ChildContext';
import { getExercise, submitAnswer } from '../../services/exercises';
import { getExercisesBySubject } from '../../services/subjects';
import type { Exercise, NewAchievement } from '../../types';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const subjectColors: Record<number, { color: string; bgLight: string; name: string; icon: string }> = {
  1: { color: '#286B33', bgLight: '#ABF4AC', name: 'Biología', icon: '🧬' },
  2: { color: '#AC3509', bgLight: '#FFDBD0', name: 'Español', icon: '📚' },
  3: { color: '#006688', bgLight: '#C2E8FF', name: 'Geografía', icon: '🌎' },
};

const EXPLANATIONS = [
  'Revisa bien las opciones y piensa en cuál tiene las características correctas.',
  '¡Tú puedes! Lee con calma y vuelve a intentarlo.',
  'Piensa en las pistas que aprendiste en clase. ¡Vamos otra vez!',
];

export default function ExercisePlay() {
  const navigate = useNavigate();
  const { id, exerciseId } = useParams<{ id: string; exerciseId: string }>();
  const subjectId = Number(id);
  const exerciseIdNum = Number(exerciseId);
  const { child } = useChild();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [subjectExercises, setSubjectExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [tfAnswer, setTfAnswer] = useState<'true' | 'false' | null>(null);
  const [matchingResult, setMatchingResult] = useState<boolean | null>(null);
  const [result, setResult] = useState<{
    correct: boolean;
    pointsEarned: number;
    correctAnswerText: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newAchievement, setNewAchievement] = useState<NewAchievement | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const subject = subjectColors[subjectId] || subjectColors[1];
  const exerciseType = exercise?.type || 'multiple_choice';
  const isMatching = exerciseType === 'matching';
  const isTrueFalse = exerciseType === 'true_false';
  const isFillBlank = exerciseType === 'fill_blank';

  useEffect(() => {
    if (!child || !exerciseIdNum) return;

    async function load() {
      try {
        const [exerciseData, subjectData] = await Promise.all([
          getExercise(exerciseIdNum),
          getExercisesBySubject(subjectId),
        ]);
        setExercise(exerciseData);
        setSubjectExercises(subjectData.exercises);
      } catch (err) {
        console.error('Error cargando ejercicio:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [child, exerciseIdNum, subjectId]);

  const { currentIndex, totalExercises } = useMemo(() => {
    if (subjectExercises.length === 0 || !exercise) {
      return { currentIndex: 1, totalExercises: 10 };
    }
    const sorted = [...subjectExercises].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((e) => e.id === exercise.id);
    return {
      currentIndex: idx + 1,
      totalExercises: sorted.length,
    };
  }, [subjectExercises, exercise]);

  const isLastExercise = currentIndex === totalExercises;

  function isSubscriptionError(err: unknown): boolean {
    const axiosError = err as { response?: { status?: number } };
    return axiosError.response?.status === 403;
  }

  async function handleSubmit() {
    if (!child || !exercise || !selectedOptionId) return;

    setSubmitting(true);
    try {
      const response = await submitAnswer(exercise.id, {
        child_profile_id: child.id,
        option_id: selectedOptionId,
      });

      const correctOption = exercise.options.find((o) => o.is_correct);

      setResult({
        correct: response.correct,
        pointsEarned: response.points_earned,
        correctAnswerText: correctOption?.option_text || '',
      });

      if (response.new_achievements && response.new_achievements.length > 0) {
        setNewAchievement(response.new_achievements[0]);
      }
    } catch (err) {
      if (isSubscriptionError(err)) {
        setShowSubscriptionModal(true);
      } else {
        console.error('Error al enviar respuesta:', err);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTrueFalse(answer: 'true' | 'false') {
    if (!child || !exercise) return;

    setTfAnswer(answer);
    setSubmitting(true);

    try {
      const response = await submitAnswer(exercise.id, {
        child_profile_id: child.id,
        answer,
      });

      setResult({
        correct: response.correct,
        pointsEarned: response.points_earned,
        correctAnswerText:
          exercise.correct_answer === 'true' ? 'Verdadero' : 'Falso',
      });

      if (response.new_achievements && response.new_achievements.length > 0) {
        setNewAchievement(response.new_achievements[0]);
      }
    } catch (err) {
      if (isSubscriptionError(err)) {
        setShowSubscriptionModal(true);
      } else {
        console.error('Error al enviar V/F:', err);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFillBlank(answer: string) {
    if (!child || !exercise) return;

    setSubmitting(true);

    try {
      const response = await submitAnswer(exercise.id, {
        child_profile_id: child.id,
        answer,
      });

      setResult({
        correct: response.correct,
        pointsEarned: response.points_earned,
        correctAnswerText: exercise.correct_answer || '',
      });

      if (response.new_achievements && response.new_achievements.length > 0) {
        setNewAchievement(response.new_achievements[0]);
      }
    } catch (err) {
      if (isSubscriptionError(err)) {
        setShowSubscriptionModal(true);
      } else {
        console.error('Error al enviar fill_blank:', err);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMatchingComplete(isCorrect: boolean) {
    if (!child || !exercise) return;

    setMatchingResult(isCorrect);
    setSubmitting(true);

    try {
      const matches = exercise.pairs.map((pair) => ({
        left: pair.left_text,
        right: pair.right_text,
      }));

      const response = await submitAnswer(exercise.id, {
        child_profile_id: child.id,
        matches,
      });

      setResult({
        correct: response.correct,
        pointsEarned: response.points_earned,
        correctAnswerText: '',
      });

      if (response.new_achievements && response.new_achievements.length > 0) {
        setNewAchievement(response.new_achievements[0]);
      }
    } catch (err) {
      if (isSubscriptionError(err)) {
        setShowSubscriptionModal(true);
      } else {
        console.error('Error al enviar matching:', err);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setSelectedOptionId(null);
    setTfAnswer(null);
    setMatchingResult(null);
    setResult(null);
  }

  function handleNext() {
    if (isLastExercise) {
      navigate(`/subjects/${subjectId}/complete`);
      return;
    }

    const sorted = [...subjectExercises].sort((a, b) => a.order - b.order);
    const currentIdx = sorted.findIndex((e) => e.id === exerciseIdNum);
    const nextExercise = sorted[currentIdx + 1];

    if (nextExercise) {
      navigate(`/subjects/${subjectId}/exercises/${nextExercise.id}`);
      setSelectedOptionId(null);
      setTfAnswer(null);
      setMatchingResult(null);
      setResult(null);
    }
  }

  function handleExit() {
    navigate(`/subjects/${subjectId}`);
  }

  const randomExplanation = EXPLANATIONS[exerciseIdNum % EXPLANATIONS.length];

  return (
    <div
      className="min-h-screen font-nunito flex flex-col relative overflow-x-hidden"
      style={{
        background:
          'linear-gradient(180deg, #70D6FF 0%, #BBE7FE 40%, #FFF3C4 85%, #FEF9E7 100%)',
      }}
    >
      <AnimatedBackground />

      <ChildTopBar backTo={`/subjects/${subjectId}`} backLabel="Salir" />

      <main className="flex-1 w-full relative z-10 pt-2 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          {loading && (
            <div className="clay-card p-8 text-center">
              <p className="font-bold text-[#59413A]">Cargando ejercicio...</p>
            </div>
          )}

          {!loading && exercise && (
            <>
              <section className="flex flex-col sm:flex-row items-center justify-between gap-4 clay-card p-4 sm:p-5">
                <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black"
                    style={{
                      backgroundColor: subject.bgLight,
                      color: subject.color,
                      boxShadow: `0 3px 0 ${subject.color}66`,
                    }}
                  >
                    <span className="text-base">{subject.icon}</span>
                    <span>
                      Ejercicio {currentIndex} de {totalExercises} • {subject.name}
                    </span>
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black"
                    style={{
                      backgroundColor: '#ABF4AC',
                      color: '#003D12',
                      boxShadow: '0 3px 0 #90D792',
                    }}
                  >
                    💎 +{exercise.points_reward} puntos
                  </span>
                </div>

                <div className="w-full sm:w-1/3 max-w-sm">
                  <ProgressMeter
                    current={currentIndex}
                    total={totalExercises}
                    color={subject.color}
                  />
                </div>
              </section>

              <section className="clay-card p-6 sm:p-8">
                <div className="text-center sm:text-left mb-6">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-3"
                    style={{
                      backgroundColor: '#FFE9E3',
                      color: '#59413A',
                    }}
                  >
                    {exercise.title}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black font-baloo text-[#2C160E] leading-tight">
                    {exercise.question}
                  </h1>
                  {exercise.instructions && (
                    <p className="text-base font-bold text-[#59413A] mt-3 max-w-2xl">
                      {exercise.instructions}
                    </p>
                  )}
                </div>

                {isMatching && (
                  <MatchingExercise
                    pairs={exercise.pairs}
                    onComplete={handleMatchingComplete}
                    disabled={submitting}
                    result={matchingResult}
                    color={subject.color}
                    bgLight={subject.bgLight}
                  />
                )}

                {isTrueFalse && (
                  <TrueFalseExercise
                    onAnswer={handleTrueFalse}
                    disabled={submitting || result !== null}
                    selected={tfAnswer}
                    color={subject.color}
                    bgLight={subject.bgLight}
                  />
                )}

                {isFillBlank && (
                  <FillBlankExercise
                    question={exercise.question}
                    onSubmit={handleFillBlank}
                    disabled={submitting || result !== null}
                    color={subject.color}
                    bgLight={subject.bgLight}
                  />
                )}

                {!isMatching && !isTrueFalse && !isFillBlank && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {exercise.options
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((option, idx) => (
                          <ExerciseOption
                            key={option.id}
                            letter={OPTION_LETTERS[idx]}
                            text={option.option_text}
                            selected={selectedOptionId === option.id}
                            disabled={result !== null || submitting}
                            onSelect={() => {
                              if (result === null) setSelectedOptionId(option.id);
                            }}
                          />
                        ))}
                    </div>

                    {!result && (
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!selectedOptionId || submitting}
                          className="w-full sm:w-auto min-w-[280px] min-h-[64px] px-8 py-4 rounded-full font-black text-lg flex items-center justify-center gap-3 transition-all active:translate-y-1.5 disabled:opacity-50 disabled:pointer-events-none"
                          style={{
                            backgroundColor: '#FF7043',
                            color: 'white',
                            boxShadow:
                              '0 8px 0 #AC3509, inset 0 4px 6px rgba(255,255,255,0.6)',
                          }}
                        >
                          <span>
                            {submitting ? 'Comprobando...' : '¡Comprobar respuesta!'}
                          </span>
                          {!submitting && <span className="text-xl">✨</span>}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOptionId(null)}
                          className="text-sm font-bold text-[#59413A] hover:text-[#2C160E] px-4 py-2 rounded-full hover:bg-[#FFE2DA] transition"
                        >
                          Limpiar selección
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>

              {result && result.correct && (
                <SuccessFeedback
                  childName={child?.name || 'aventurero'}
                  pointsEarned={result.pointsEarned}
                  correctAnswer={result.correctAnswerText || '¡Todos los pares correctos!'}
                  onNext={handleNext}
                  isLastExercise={isLastExercise}
                />
              )}

              {result && !result.correct && (
                <RetryFeedback
                  explanation={
                    isMatching
                      ? 'Algunos pares no coinciden. ¡Mira bien cada opción y vuelve a intentarlo! 💪'
                      : `La respuesta correcta era "${result.correctAnswerText}". ${randomExplanation}`
                  }
                  onRetry={handleRetry}
                />
              )}

              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={handleExit}
                  className="text-sm font-bold text-[#59413A] hover:text-[#AC3509] px-4 py-2 rounded-full hover:bg-[#FFE2DA] transition"
                >
                  ← Salir del ejercicio
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {newAchievement && (
        <AchievementPopup
          isOpen={!!newAchievement}
          onClose={() => setNewAchievement(null)}
          icon={newAchievement.badge_icon}
          title={newAchievement.title}
          description={newAchievement.description}
        />
      )}

      <SubscriptionRequiredModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={() => {
          setShowSubscriptionModal(false);
          navigate('/parent');
        }}
      />
    </div>
  );
}