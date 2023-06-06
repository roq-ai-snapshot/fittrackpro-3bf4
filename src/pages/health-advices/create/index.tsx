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
import { createHealthAdvice } from 'apiSdk/health-advices';
import { Error } from 'components/error';
import { healthAdviceValidationSchema } from 'validationSchema/health-advices';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { MemberInterface } from 'interfaces/member';
import { UserInterface } from 'interfaces/user';
import { getMembers } from 'apiSdk/members';
import { getUsers } from 'apiSdk/users';
import { HealthAdviceInterface } from 'interfaces/health-advice';

function HealthAdviceCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: HealthAdviceInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createHealthAdvice(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<HealthAdviceInterface>({
    initialValues: {
      advice_details: '',
      member_id: (router.query.member_id as string) ?? null,
      health_advisor_id: (router.query.health_advisor_id as string) ?? null,
    },
    validationSchema: healthAdviceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Health Advice
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="advice_details" mb="4" isInvalid={!!formik.errors?.advice_details}>
            <FormLabel>Advice Details</FormLabel>
            <Input
              type="text"
              name="advice_details"
              value={formik.values?.advice_details}
              onChange={formik.handleChange}
            />
            {formik.errors.advice_details && <FormErrorMessage>{formik.errors?.advice_details}</FormErrorMessage>}
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
            name={'health_advisor_id'}
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
  entity: 'health_advice',
  operation: AccessOperationEnum.CREATE,
})(HealthAdviceCreatePage);
