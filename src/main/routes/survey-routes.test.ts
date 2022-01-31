import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

let accountCollection: Collection
let surveyCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne(
    { name: 'Yaslim', email: 'yaslim@gmail.com', password: '12345', role: 'admin' }
  )
  const id = res.ops[0]._id
  const accessToken = await sign({ id }, env.jwtSecret)

  await accountCollection.updateOne({ _id: id }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST/surveys', () => {
    test('should return 403 on add survey without access token', async () => {
      await request(app).post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer1',
            image: 'http://image-name.com'
          }, {
            answer: 'Answer2'

          }]
        })
        .expect(403)
    })

    test('should return 204 on add survey with valid access token', async () => {
      const accessToken = await makeAccessToken()
      await request(app).post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer1',
            image: 'http://image-name.com'
          }, {
            answer: 'Answer2'

          }]
        })
        .expect(204)
    })
  })

  describe('GET/surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('should return 204 on load surveys with valid access token', async () => {
      const accessToken = await makeAccessToken()
      await request(app).get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
