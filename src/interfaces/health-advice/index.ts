import { MemberInterface } from 'interfaces/member';
import { UserInterface } from 'interfaces/user';

export interface HealthAdviceInterface {
  id?: string;
  member_id: string;
  health_advisor_id: string;
  advice_details: string;

  member?: MemberInterface;
  user?: UserInterface;
  _count?: {};
}
