import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  // middleware global para a rota de transactions, pode ser implementado no arquivo server antes de todas as rotas para se tornar um hook/middleware global

  // app.addHook('preHandler', async (req) => {
  //   console.log(`[${req.method}] ${req.url}`)
  // })

  // NAO ESQUECE DO ASYNC!!!!!
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const transactions = await knex('transactions')
        .where({ session_id: sessionId })
        .select()
      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { sessionId } = req.cookies
      const { id } = getTransactionParamsSchema.parse(req.params)

      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',

    async (req) => {
      const { sessionId } = req.cookies
      console.log(sessionId)
      const summary = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .where({ session_id: sessionId })
        .first()

      return { summary }
    },
  )

  app.post(
    '/',

    async (req, reply) => {
      const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['credit', 'debit']),
      })

      const { title, amount, type } = createTransactionBodySchema.parse(
        req.body,
      )

      let sessionId = req.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()
        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })
      }

      await knex('transactions').insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
      })
      return reply.status(201).send()
    },
  )
}
