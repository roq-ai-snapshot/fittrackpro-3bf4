import React from 'react';
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { useSession } from '@roq/nextjs';

export const HelpBox: React.FC = () => {
  const ownerRoles = ['GymOwner'];
  const roles = ['GymOwner', 'FitnessInstructor', 'HealthAdvisor', 'Admin', 'GymMember'];
  const applicationName = 'FitTrackPro';
  const tenantName = 'Fitness Center';
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  const userStories = `GymOwner:
1. As a GymOwner, I want to be able to create and manage member profiles so that I can keep track of my gym's membership base.
2. As a GymOwner, I want to be able to assign FitnessInstructors and HealthAdvisors to specific members so that they can provide personalized guidance and support.
3. As a GymOwner, I want to be able to view and analyze overall member health metrics so that I can make informed decisions about gym offerings and improvements.
4. As a GymOwner, I want to be able to manage the schedules of FitnessInstructors and HealthAdvisors so that I can ensure adequate staffing and availability for members.
5. As a GymOwner, I want to be able to send notifications and updates to members so that they are informed about gym news and events.

FitnessInstructor:
1. As a FitnessInstructor, I want to be able to design personalized workout plans for assigned members so that they can achieve their fitness goals.
2. As a FitnessInstructor, I want to be able to track member progress and adjust workout plans as needed so that members continue to improve and stay engaged.
3. As a FitnessInstructor, I want to be able to communicate with assigned members so that I can provide support, motivation, and guidance.
4. As a FitnessInstructor, I want to be able to view my schedule and assigned members so that I can manage my time and responsibilities effectively.

HealthAdvisor:
1. As a HealthAdvisor, I want to be able to review member health metrics and provide personalized advice so that members can improve their overall health and well-being.
2. As a HealthAdvisor, I want to be able to communicate with assigned members so that I can provide support, motivation, and guidance.
3. As a HealthAdvisor, I want to be able to track member progress and adjust advice as needed so that members continue to improve and stay engaged.
4. As a HealthAdvisor, I want to be able to view my schedule and assigned members so that I can manage my time and responsibilities effectively.

Admin:
1. As an Admin, I want to be able to manage user access and permissions so that the application remains secure and organized.
2. As an Admin, I want to be able to troubleshoot and resolve technical issues so that the application runs smoothly for all users.
3. As an Admin, I want to be able to generate reports on member health metrics, gym usage, and other relevant data so that GymOwners can make informed decisions.

GymMember:
1. As a GymMember, I want to be able to view my personalized workout plan and track my progress so that I can stay motivated and achieve my fitness goals.
2. As a GymMember, I want to be able to communicate with my assigned FitnessInstructor and HealthAdvisor so that I can receive support, motivation, and guidance.
3. As a GymMember, I want to be able to view my health metrics and receive personalized advice so that I can improve my overall health and well-being.
4. As a GymMember, I want to be able to receive notifications and updates from my gym so that I am informed about news and events.`;

  const { session } = useSession();
  if (!process.env.NEXT_PUBLIC_SHOW_BRIEFING || process.env.NEXT_PUBLIC_SHOW_BRIEFING === 'false') {
    return null;
  }
  return (
    <Box width={1} position="fixed" left="20px" bottom="20px" zIndex={3}>
      <Popover placement="top">
        <PopoverTrigger>
          <IconButton
            aria-label="Help Info"
            icon={<FiInfo />}
            bg="blue.800"
            color="white"
            _hover={{ bg: 'blue.800' }}
            _active={{ bg: 'blue.800' }}
            _focus={{ bg: 'blue.800' }}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>App Briefing</PopoverHeader>
          <PopoverBody maxH="400px" overflowY="auto">
            <Text mb="2">Hi there!</Text>
            <Text mb="2">
              Welcome to {applicationName}, your freshly generated B2B SaaS application. This in-app briefing will guide
              you through your application. Feel free to remove this tutorial with the{' '}
              <Box as="span" bg="yellow.300" p={1}>
                NEXT_PUBLIC_SHOW_BRIEFING
              </Box>{' '}
              environment variable.
            </Text>
            <Text mb="2">You can use {applicationName} with one of these roles:</Text>
            <UnorderedList mb="2">
              {roles.map((role) => (
                <ListItem key={role}>{role}</ListItem>
              ))}
            </UnorderedList>
            {session?.roqUserId ? (
              <Text mb="2">You are currently logged in as a {session?.user?.roles?.join(', ')}.</Text>
            ) : (
              <Text mb="2">
                Right now, you are not logged in. The best way to start your journey is by signing up as{' '}
                {ownerRoles.join(', ')} and to create your first {tenantName}.
              </Text>
            )}
            <Text mb="2">
              {applicationName} was generated based on these user stories. Feel free to try them out yourself!
            </Text>
            <Box mb="2" whiteSpace="pre-wrap">
              {userStories}
            </Box>
            <Text mb="2">
              If you are happy with the results, then you can get the entire source code here:{' '}
              <Link href={githubUrl} color="cyan.500" isExternal>
                {githubUrl}
              </Link>
            </Text>
            <Text mb="2">
              Console Dashboard: For configuration and customization options, access our console dashboard. Your project
              has already been created and is waiting for your input. Check your emails for the invite.
            </Text>
            <Text mb="2">
              <Link href="https://console.roq.tech" color="cyan.500" isExternal>
                ROQ Console
              </Link>
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
