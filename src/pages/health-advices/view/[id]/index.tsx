import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getHealthAdviceById } from 'apiSdk/health-advices';
import { Error } from 'components/error';
import { HealthAdviceInterface } from 'interfaces/health-advice';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function HealthAdviceViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<HealthAdviceInterface>(
    () => (id ? `/health-advices/${id}` : null),
    () =>
      getHealthAdviceById(id, {
        relations: ['member', 'user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Health Advice Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Advice Details:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.advice_details}
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
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'health_advice',
  operation: AccessOperationEnum.READ,
})(HealthAdviceViewPage);
