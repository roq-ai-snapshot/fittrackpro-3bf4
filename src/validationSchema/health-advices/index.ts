import * as yup from 'yup';

export const healthAdviceValidationSchema = yup.object().shape({
  advice_details: yup.string().required(),
  member_id: yup.string().nullable().required(),
  health_advisor_id: yup.string().nullable().required(),
});
