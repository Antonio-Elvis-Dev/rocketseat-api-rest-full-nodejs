import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*') // busca todos os dados da tabela sqlite_schema

  return tables
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server on 🌐')
  })
  .catch((err) => {
    console.log(`Erro: ${err}`)
  })
