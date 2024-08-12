import { test, beforeAll, afterAll, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { beforeEach, describe } from 'node:test'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready() // aguarda que todos os testes estejam prontos.
  })

  afterAll(async () => {
    await app.close() // fecha a aplicação (remove da memoria)
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  // deve ser capaz de...
  // it('should be able to create a new transaction')
  // jamais posso escrever um teste que depende de outro
  test('user can create a new transaction ', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transation',
        amount: 4000,
        type: 'credit',
      })
      .expect(201)
  })

  test('user can list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'teste',
        amount: 3000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'teste',
        amount: 3000,
      }),
      // {
      // id: expect.any(String),
      // },
    ])

    console.log(listTransactionsResponse.body)
  })

  test('user can list specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'teste',
        amount: 3000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'teste',
        amount: 3000,
      }),
    )
  })

  test('user can get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'salarios',
        amount: 3000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'lazer',
        amount: 1000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    console.log(summaryResponse)
    expect(summaryResponse.body.summary).toEqual({
      amount: 2000,
    })
  })
})
