import { HealthAdviceInterface } from 'interfaces/health-advice';
import { HealthMetricInterface } from 'interfaces/health-metric';
import { WorkoutPlanInterface } from 'interfaces/workout-plan';
import { UserInterface } from 'interfaces/user';
import { FitnessCenterInterface } from 'interfaces/fitness-center';

export interface MemberInterface {
  id?: string;
  user_id: string;
  fitness_center_id: string;
  health_advice?: HealthAdviceInterface[];
  health_metric?: HealthMetricInterface[];
  workout_plan?: WorkoutPlanInterface[];
  user?: UserInterface;
  fitness_center?: FitnessCenterInterface;
  _count?: {
    health_advice?: number;
    health_metric?: number;
    workout_plan?: number;
  };
}
