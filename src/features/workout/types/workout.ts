
export type WorkoutStatus =
  | "Planned"
  | "InProgress"
  | "Completed";

export type WorkoutSetType =
  | "Normal"
  | "Warmup"
  | "Dropset";

export interface WorkoutCategory {
  id: string;
  name: string;
  color: string | null;
}

export interface WorkoutSession {
  id: string;
  name: string;
  workoutDate: string;
  status: WorkoutStatus;
  notes: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSessionExercise {
  id: string;
  workoutSessionId: string;
  workoutCategoryId: string;
  exerciseName: string;
  exerciseColor: string | null;
  sortOrder: number;
  notes: string | null;
}

export interface WorkoutSet {
  id: string;
  workoutSessionExerciseId: string;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  setType: WorkoutSetType;
  isCompleted: boolean;
  completedAt: string | null;
  notes: string | null;
}

export interface WorkoutSessionDetail
  extends WorkoutSession {
  exercises: WorkoutExerciseDetail[];
}

export interface WorkoutExerciseDetail
  extends WorkoutSessionExercise {
  sets: WorkoutSet[];
}

export interface CreateWorkoutCategoryRequest {
  name: string;
  color?: string | null;
}

export type UpdateWorkoutCategoryRequest =
  CreateWorkoutCategoryRequest;

export interface CreateWorkoutSessionRequest {
  name: string;
  workoutDate: string;
  notes?: string | null;
}

export type UpdateWorkoutSessionRequest =
  CreateWorkoutSessionRequest;

export interface CreateWorkoutSessionExerciseRequest {
  workoutCategoryId: string;
  sortOrder?: number;
  notes?: string | null;
}

export interface UpdateWorkoutSessionExerciseRequest {
  sortOrder: number;
  notes?: string | null;
}

export interface CreateWorkoutSetRequest {
  setNumber?: number;
  reps?: number | null;
  weightKg?: number | null;
  setType?: WorkoutSetType;
  isCompleted?: boolean;
  notes?: string | null;
}

export interface UpdateWorkoutSetRequest {
  reps?: number | null;
  weightKg?: number | null;
  setType: WorkoutSetType;
  isCompleted: boolean;
  notes?: string | null;
}
