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
import { createMember } from 'apiSdk/members';
import { Error } from 'components/error';
import { memberValidationSchema } from 'validationSchema/members';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { FitnessCenterInterface } from 'interfaces/fitness-center';
import { getUsers } from 'apiSdk/users';
import { getFitnessCenters } from 'apiSdk/fitness-centers';
import { MemberInterface } from 'interfaces/member';

function MemberCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MemberInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMember(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MemberInterface>({
    initialValues: {
      user_id: (router.query.user_id as string) ?? null,
      fitness_center_id: (router.query.fitness_center_id as string) ?? null,
      health_advice: [],
      health_metric: [],
      workout_plan: [],
    },
    validationSchema: memberValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Member
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'member',
  operation: AccessOperationEnum.CREATE,
})(MemberCreatePage);
