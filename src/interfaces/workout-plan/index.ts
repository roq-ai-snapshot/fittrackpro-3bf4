import { MemberInterface } from 'interfaces/member';
import { UserInterface } from 'interfaces/user';

export interface WorkoutPlanInterface {
  id?: string;
  member_id: string;
  fitness_instructor_id: string;
  plan_details: string;

  member?: MemberInterface;
  user?: UserInterface;
  _count?: {};
}
