import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getMembers, deleteMemberById } from 'apiSdk/members';
import { MemberInterface } from 'interfaces/member';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function MemberListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<MemberInterface[]>(
    () => '/members',
    () =>
      getMembers({
        relations: ['user', 'fitness_center', 'health_advice.count', 'health_metric.count', 'workout_plan.count'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteMemberById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Member
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('member', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/members/create`}>
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
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>user</Th>}
                  {hasAccess('fitness_center', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>fitness_center</Th>
                  )}
                  {hasAccess('health_advice', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>health_advice</Th>
                  )}
                  {hasAccess('health_metric', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>health_metric</Th>
                  )}
                  {hasAccess('workout_plan', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>workout_plan</Th>
                  )}
                  {hasAccess('member', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('member', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('member', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user?.id}`}>
                          {record.user?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('fitness_center', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/fitness-centers/view/${record.fitness_center?.id}`}>
                          {record.fitness_center?.name}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('health_advice', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.health_advice}</Td>
                    )}
                    {hasAccess('health_metric', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.health_metric}</Td>
                    )}
                    {hasAccess('workout_plan', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.workout_plan}</Td>
                    )}
                    {hasAccess('member', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/members/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('member', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/members/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('member', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'member',
  operation: AccessOperationEnum.READ,
})(MemberListPage);
