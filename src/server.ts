import { app } from './app'
import { env } from './env'

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
