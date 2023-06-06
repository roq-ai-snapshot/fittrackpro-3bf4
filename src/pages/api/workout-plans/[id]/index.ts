import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { workoutPlanValidationSchema } from 'validationSchema/workout-plans';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.workout_plan
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getWorkoutPlanById();
    case 'PUT':
      return updateWorkoutPlanById();
    case 'DELETE':
      return deleteWorkoutPlanById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getWorkoutPlanById() {
    const data = await prisma.workout_plan.findFirst(convertQueryToPrismaUtil(req.query, 'workout_plan'));
    return res.status(200).json(data);
  }

  async function updateWorkoutPlanById() {
    await workoutPlanValidationSchema.validate(req.body);
    const data = await prisma.workout_plan.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteWorkoutPlanById() {
    const data = await prisma.workout_plan.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
