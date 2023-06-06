import * as yup from 'yup';
import { memberValidationSchema } from 'validationSchema/members';

export const fitnessCenterValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  member: yup.array().of(memberValidationSchema),
});
