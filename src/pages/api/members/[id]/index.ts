import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { memberValidationSchema } from 'validationSchema/members';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.member
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getMemberById();
    case 'PUT':
      return updateMemberById();
    case 'DELETE':
      return deleteMemberById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMemberById() {
    const data = await prisma.member.findFirst(convertQueryToPrismaUtil(req.query, 'member'));
    return res.status(200).json(data);
  }

  async function updateMemberById() {
    await memberValidationSchema.validate(req.body);
    const data = await prisma.member.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteMemberById() {
    const data = await prisma.member.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
