import { MemberInterface } from 'interfaces/member';
import { UserInterface } from 'interfaces/user';

export interface FitnessCenterInterface {
  id?: string;
  name: string;
  user_id: string;
  member?: MemberInterface[];
  user?: UserInterface;
  _count?: {
    member?: number;
  };
}
