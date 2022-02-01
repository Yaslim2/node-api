import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'
import { SurveyModel } from '@/domain/models/survey'

let accountCollection: Collection
let surveyCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    id: 'any-id',
    question: 'any-question',
    answers: [{
      image: 'any-image',
      answer: 'any-answer'
    }, {
      image: 'another-image',
      answer: 'another-answer'
    }],
    date: new Date()
  })
  return MongoHelper.map(res.ops[0])
}

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne(
    { name: 'Yaslim', email: 'yaslim@gmail.com', password: '12345' }
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('should return 403 on save survey result without access token', async () => {
      await request(app).put('/api/surveys/any-id/results')
        .send({
          answer: 'any-answer'
        })
        .expect(403)
    })

    test('should return 200 on save survey result with token', async () => {
      const res = await makeSurvey()
      const token = await makeAccessToken()
      await request(app).put(`/api/surveys/${res.id}/results`)
        .set('x-access-token', token)
        .send({
          answer: 'any-answer'
        })
        .expect(200)
    })
  })
})
