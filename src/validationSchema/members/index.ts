import * as yup from 'yup';
import { healthAdviceValidationSchema } from 'validationSchema/health-advices';
import { healthMetricValidationSchema } from 'validationSchema/health-metrics';
import { workoutPlanValidationSchema } from 'validationSchema/workout-plans';

export const memberValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  fitness_center_id: yup.string().nullable().required(),
  health_advice: yup.array().of(healthAdviceValidationSchema),
  health_metric: yup.array().of(healthMetricValidationSchema),
  workout_plan: yup.array().of(workoutPlanValidationSchema),
});
