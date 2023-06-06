import * as yup from 'yup';

export const workoutPlanValidationSchema = yup.object().shape({
  plan_details: yup.string().required(),
  member_id: yup.string().nullable().required(),
  fitness_instructor_id: yup.string().nullable().required(),
});
