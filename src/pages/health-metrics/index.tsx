import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getHealthMetrics, deleteHealthMetricById } from 'apiSdk/health-metrics';
import { HealthMetricInterface } from 'interfaces/health-metric';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function HealthMetricListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<HealthMetricInterface[]>(
    () => '/health-metrics',
    () =>
      getHealthMetrics({
        relations: ['member'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteHealthMetricById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Health Metric
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('health_metric', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/health-metrics/create`}>
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
                  <Th>metric_name</Th>
                  <Th>metric_value</Th>
                  {hasAccess('member', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>member</Th>}

                  {hasAccess('health_metric', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('health_metric', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('health_metric', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.metric_name}</Td>
                    <Td>{record.metric_value}</Td>
                    {hasAccess('member', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/members/view/${record.member?.id}`}>
                          {record.member?.user_id}
                        </Link>
                      </Td>
                    )}

                    {hasAccess('health_metric', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/health-metrics/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('health_metric', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/health-metrics/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('health_metric', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'health_metric',
  operation: AccessOperationEnum.READ,
})(HealthMetricListPage);
