import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getMemberById } from 'apiSdk/members';
import { Error } from 'components/error';
import { MemberInterface } from 'interfaces/member';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteHealthAdviceById } from 'apiSdk/health-advices';
import { deleteHealthMetricById } from 'apiSdk/health-metrics';
import { deleteWorkoutPlanById } from 'apiSdk/workout-plans';

function MemberViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MemberInterface>(
    () => (id ? `/members/${id}` : null),
    () =>
      getMemberById(id, {
        relations: ['user', 'fitness_center', 'health_advice', 'health_metric', 'workout_plan'],
      }),
  );

  const health_adviceHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteHealthAdviceById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const health_metricHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteHealthMetricById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const workout_planHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteWorkoutPlanById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Member Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  User:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                    {data?.user?.email}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('fitness_center', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Fitness Center:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/fitness-centers/view/${data?.fitness_center?.id}`}>
                    {data?.fitness_center?.name}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('health_advice', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Health Advices:
                </Text>
                <NextLink passHref href={`/health-advices/create?member_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>advice_details</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.health_advice?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.advice_details}</Td>
                          <Td>
                            <NextLink passHref href={`/health-advices/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/health-advices/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => health_adviceHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('health_metric', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Health Metrics:
                </Text>
                <NextLink passHref href={`/health-metrics/create?member_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>metric_name</Th>
                        <Th>metric_value</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.health_metric?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.metric_name}</Td>
                          <Td>{record.metric_value}</Td>
                          <Td>
                            <NextLink passHref href={`/health-metrics/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/health-metrics/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => health_metricHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('workout_plan', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Workout Plans:
                </Text>
                <NextLink passHref href={`/workout-plans/create?member_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>plan_details</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.workout_plan?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.plan_details}</Td>
                          <Td>
                            <NextLink passHref href={`/workout-plans/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/workout-plans/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => workout_planHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'member',
  operation: AccessOperationEnum.READ,
})(MemberViewPage);
