import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getHealthMetricById } from 'apiSdk/health-metrics';
import { Error } from 'components/error';
import { HealthMetricInterface } from 'interfaces/health-metric';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function HealthMetricViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<HealthMetricInterface>(
    () => (id ? `/health-metrics/${id}` : null),
    () =>
      getHealthMetricById(id, {
        relations: ['member'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Health Metric Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Metric Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.metric_name}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Metric Value:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.metric_value}
            </Text>
            <br />
            {hasAccess('member', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Member:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/members/view/${data?.member?.id}`}>
                    {data?.member?.user_id}
                  </Link>
                </Text>
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
  entity: 'health_metric',
  operation: AccessOperationEnum.READ,
})(HealthMetricViewPage);
