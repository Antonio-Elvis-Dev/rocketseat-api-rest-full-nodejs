import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
  const transaction = await knex('transactions')
    .select('*')
    .where('amount', 100)
  /*
    .insert({
      id: crypto.randomUUID(),
      title: 'Transação de teste',
      amount: 1000,
      // session_id: crypto.randomUUID(),
    })
    .returning('*')

    */
  return transaction
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server on 🌐')
  })
  .catch((err) => {
    console.log(`Erro: ${err}`)
  })
