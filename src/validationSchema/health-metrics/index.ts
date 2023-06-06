import * as yup from 'yup';

export const healthMetricValidationSchema = yup.object().shape({
  metric_name: yup.string().required(),
  metric_value: yup.number().integer().required(),
  member_id: yup.string().nullable().required(),
});
