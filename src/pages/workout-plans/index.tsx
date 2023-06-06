import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getWorkoutPlans, deleteWorkoutPlanById } from 'apiSdk/workout-plans';
import { WorkoutPlanInterface } from 'interfaces/workout-plan';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function WorkoutPlanListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<WorkoutPlanInterface[]>(
    () => '/workout-plans',
    () =>
      getWorkoutPlans({
        relations: ['member', 'user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteWorkoutPlanById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Workout Plan
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('workout_plan', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/workout-plans/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>plan_details</Th>
                  {hasAccess('member', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>member</Th>}
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>user</Th>}

                  {hasAccess('workout_plan', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('workout_plan', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('workout_plan', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.plan_details}</Td>
                    {hasAccess('member', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/members/view/${record.member?.id}`}>
                          {record.member?.user_id}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user?.id}`}>
                          {record.user?.email}
                        </Link>
                      </Td>
                    )}

                    {hasAccess('workout_plan', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/workout-plans/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('workout_plan', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/workout-plans/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('workout_plan', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'workout_plan',
  operation: AccessOperationEnum.READ,
})(WorkoutPlanListPage);
