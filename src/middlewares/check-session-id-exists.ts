import { FastifyReply, FastifyRequest } from 'fastify'

// NAO ESQUECE DO ASYNC!!!!!
export async function checkSessionIdExists(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = req.cookies
  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
