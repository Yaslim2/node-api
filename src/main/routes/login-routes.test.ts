import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST/signup', () => {
    test('should return 200 on signup', async () => {
      await request(app).post('/api/signup')
        .send({ name: 'Yaslim', email: 'yaslim@gmail.com', password: '1234', passwordConfirmation: '1234' })
        .expect(200)
    })
  })
})
