export interface User {
  id: number;
  name: string;
  email: string;
  role: 'tutor' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface StoreItemEquipped {
  id: number;
  name: string;
  category: string;
  icon: string;
  price: number;
}

export interface Child {
  id: number;
  user_id: number;
  name: string;
  age: number;
  avatar: string;
  total_points: number;
  equipped_avatar_id: number | null;
  equipped_accessory_id: number | null;
  equipped_accessory_id_2: number | null;
  equipped_frame_id: number | null;
  equipped_avatar?: StoreItemEquipped | null;
  equipped_accessory?: StoreItemEquipped | null;
  equipped_accessory2?: StoreItemEquipped | null;
  equipped_frame?: StoreItemEquipped | null;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  order: number;
  is_active: boolean;
  exercises_count: number;
}

export interface Option {
  id: number;
  exercise_id: number;
  option_text: string;
  is_correct: boolean;
  order: number;
}

export interface ExercisePair {
  id: number;
  exercise_id: number;
  left_text: string;
  right_text: string;
  order: number;
}

export interface Exercise {
  id: number;
  subject_id: number;
  title: string;
  question: string;
  instructions: string;
  type: string;
  difficulty: string;
  image_url: string | null;
  points_reward: number;
  order: number;
  is_active: boolean;
  correct_answer?: string;
  options: Option[];
  pairs: ExercisePair[];
}

export interface NewAchievement {
  id: number;
  title: string;
  description: string;
  badge_icon: string;
}

export interface AnswerResponse {
  correct: boolean;
  points_earned: number;
  total_points: number;
  progress: {
    id: number;
    child_profile_id: number;
    exercise_id: number;
    completed: boolean;
    score: number;
  };
  new_achievements: NewAchievement[];
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface SubjectProgress {
  subject_id: number;
  subject_name: string;
  icon: string;
  color: string;
  total: number;
  completed: number;
  completed_exercise_ids: number[];
  percentage: number;
}

export interface ChildProgress {
  child: Child;
  total_points: number;
  subjects: SubjectProgress[];
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  badge_icon: string;
  earned: boolean;
}

export interface ChildAchievements {
  child: Child;
  achievements: Achievement[];
}

export interface SubjectWithExercises {
  subject: Subject;
  exercises: Exercise[];
}

export interface RankingEntry {
  position: number;
  child_id: number;
  name: string;
  avatar: string;
  total_points: number;
}

export interface ChildHistoryEntry {
  progress_id: number;
  exercise_id: number;
  exercise_title: string;
  subject_name: string;
  subject_icon: string;
  score: number;
  completed_at: string;
}

export interface ChildHistory {
  child: Child;
  history: ChildHistoryEntry[];
}

export interface StoreItem {
  id: number;
  name: string;
  category: 'avatar' | 'accessory' | 'frame';
  icon: string;
  price: number;
  owned: boolean;
}

export interface StoreResponse {
  child: Child;
  total_points: number;
  items: StoreItem[];
}