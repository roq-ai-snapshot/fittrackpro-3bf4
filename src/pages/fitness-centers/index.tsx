import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getFitnessCenters, deleteFitnessCenterById } from 'apiSdk/fitness-centers';
import { FitnessCenterInterface } from 'interfaces/fitness-center';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function FitnessCenterListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<FitnessCenterInterface[]>(
    () => '/fitness-centers',
    () =>
      getFitnessCenters({
        relations: ['user', 'member.count'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteFitnessCenterById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Fitness Center
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('fitness_center', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/fitness-centers/create`}>
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
                  <Th>name</Th>
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>user</Th>}
                  {hasAccess('member', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>member</Th>}
                  {hasAccess('fitness_center', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('fitness_center', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('fitness_center', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.name}</Td>
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user?.id}`}>
                          {record.user?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('member', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.member}</Td>
                    )}
                    {hasAccess('fitness_center', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/fitness-centers/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('fitness_center', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/fitness-centers/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('fitness_center', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'fitness_center',
  operation: AccessOperationEnum.READ,
})(FitnessCenterListPage);
