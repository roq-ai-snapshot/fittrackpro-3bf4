import { UserInterface } from 'interfaces/user';

export interface ScheduleInterface {
  id?: string;
  user_id: string;
  start_time: Date;
  end_time: Date;

  user?: UserInterface;
  _count?: {};
}
