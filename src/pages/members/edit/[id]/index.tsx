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
import { getMemberById, updateMemberById } from 'apiSdk/members';
import { Error } from 'components/error';
import { memberValidationSchema } from 'validationSchema/members';
import { MemberInterface } from 'interfaces/member';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { FitnessCenterInterface } from 'interfaces/fitness-center';
import { getUsers } from 'apiSdk/users';
import { getFitnessCenters } from 'apiSdk/fitness-centers';
import { healthAdviceValidationSchema } from 'validationSchema/health-advices';
import { healthMetricValidationSchema } from 'validationSchema/health-metrics';
import { workoutPlanValidationSchema } from 'validationSchema/workout-plans';

function MemberEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MemberInterface>(
    () => (id ? `/members/${id}` : null),
    () => getMemberById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MemberInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMemberById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MemberInterface>({
    initialValues: data,
    validationSchema: memberValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Member
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<FitnessCenterInterface>
              formik={formik}
              name={'fitness_center_id'}
              label={'Select Fitness Center'}
              placeholder={'Select Fitness Center'}
              fetcher={getFitnessCenters}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
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
  entity: 'member',
  operation: AccessOperationEnum.UPDATE,
})(MemberEditPage);
