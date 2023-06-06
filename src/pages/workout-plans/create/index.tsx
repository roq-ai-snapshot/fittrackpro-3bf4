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
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createWorkoutPlan } from 'apiSdk/workout-plans';
import { Error } from 'components/error';
import { workoutPlanValidationSchema } from 'validationSchema/workout-plans';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { MemberInterface } from 'interfaces/member';
import { UserInterface } from 'interfaces/user';
import { getMembers } from 'apiSdk/members';
import { getUsers } from 'apiSdk/users';
import { WorkoutPlanInterface } from 'interfaces/workout-plan';

function WorkoutPlanCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: WorkoutPlanInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createWorkoutPlan(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<WorkoutPlanInterface>({
    initialValues: {
      plan_details: '',
      member_id: (router.query.member_id as string) ?? null,
      fitness_instructor_id: (router.query.fitness_instructor_id as string) ?? null,
    },
    validationSchema: workoutPlanValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Workout Plan
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="plan_details" mb="4" isInvalid={!!formik.errors?.plan_details}>
            <FormLabel>Plan Details</FormLabel>
            <Input type="text" name="plan_details" value={formik.values?.plan_details} onChange={formik.handleChange} />
            {formik.errors.plan_details && <FormErrorMessage>{formik.errors?.plan_details}</FormErrorMessage>}
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
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'fitness_instructor_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'workout_plan',
  operation: AccessOperationEnum.CREATE,
})(WorkoutPlanCreatePage);
