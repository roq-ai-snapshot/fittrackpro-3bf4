import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getHealthMetricById, updateHealthMetricById } from 'apiSdk/health-metrics';
import { Error } from 'components/error';
import { healthMetricValidationSchema } from 'validationSchema/health-metrics';
import { HealthMetricInterface } from 'interfaces/health-metric';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { MemberInterface } from 'interfaces/member';
import { getMembers } from 'apiSdk/members';

function HealthMetricEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<HealthMetricInterface>(
    () => (id ? `/health-metrics/${id}` : null),
    () => getHealthMetricById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: HealthMetricInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateHealthMetricById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<HealthMetricInterface>({
    initialValues: data,
    validationSchema: healthMetricValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Health Metric
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="metric_name" mb="4" isInvalid={!!formik.errors?.metric_name}>
              <FormLabel>Metric Name</FormLabel>
              <Input type="text" name="metric_name" value={formik.values?.metric_name} onChange={formik.handleChange} />
              {formik.errors.metric_name && <FormErrorMessage>{formik.errors?.metric_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="metric_value" mb="4" isInvalid={!!formik.errors?.metric_value}>
              <FormLabel>Metric Value</FormLabel>
              <NumberInput
                name="metric_value"
                value={formik.values?.metric_value}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('metric_value', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.metric_value && <FormErrorMessage>{formik.errors?.metric_value}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<MemberInterface>
              formik={formik}
              name={'member_id'}
              label={'Select Member'}
              placeholder={'Select Member'}
              fetcher={getMembers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.user_id}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'health_metric',
  operation: AccessOperationEnum.UPDATE,
})(HealthMetricEditPage);
