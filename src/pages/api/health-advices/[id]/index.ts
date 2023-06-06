import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { healthAdviceValidationSchema } from 'validationSchema/health-advices';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.health_advice
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getHealthAdviceById();
    case 'PUT':
      return updateHealthAdviceById();
    case 'DELETE':
      return deleteHealthAdviceById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getHealthAdviceById() {
    const data = await prisma.health_advice.findFirst(convertQueryToPrismaUtil(req.query, 'health_advice'));
    return res.status(200).json(data);
  }

  async function updateHealthAdviceById() {
    await healthAdviceValidationSchema.validate(req.body);
    const data = await prisma.health_advice.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteHealthAdviceById() {
    const data = await prisma.health_advice.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
