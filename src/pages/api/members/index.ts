import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { memberValidationSchema } from 'validationSchema/members';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getMembers();
    case 'POST':
      return createMember();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMembers() {
    const data = await prisma.member
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'member'));
    return res.status(200).json(data);
  }

  async function createMember() {
    await memberValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.health_advice?.length > 0) {
      const create_health_advice = body.health_advice;
      body.health_advice = {
        create: create_health_advice,
      };
    } else {
      delete body.health_advice;
    }
    if (body?.health_metric?.length > 0) {
      const create_health_metric = body.health_metric;
      body.health_metric = {
        create: create_health_metric,
      };
    } else {
      delete body.health_metric;
    }
    if (body?.workout_plan?.length > 0) {
      const create_workout_plan = body.workout_plan;
      body.workout_plan = {
        create: create_workout_plan,
      };
    } else {
      delete body.workout_plan;
    }
    const data = await prisma.member.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
