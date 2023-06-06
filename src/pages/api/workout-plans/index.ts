import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { workoutPlanValidationSchema } from 'validationSchema/workout-plans';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getWorkoutPlans();
    case 'POST':
      return createWorkoutPlan();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getWorkoutPlans() {
    const data = await prisma.workout_plan
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'workout_plan'));
    return res.status(200).json(data);
  }

  async function createWorkoutPlan() {
    await workoutPlanValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.workout_plan.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
