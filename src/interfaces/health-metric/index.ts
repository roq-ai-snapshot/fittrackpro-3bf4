import { MemberInterface } from 'interfaces/member';

export interface HealthMetricInterface {
  id?: string;
  member_id: string;
  metric_name: string;
  metric_value: number;

  member?: MemberInterface;
  _count?: {};
}
