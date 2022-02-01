import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('should return 403 on save survey result without access token', async () => {
      await request(app).put('/api/surveys/any-id/results')
        .send({
          answer: 'any-answer'
        })
        .expect(403)
    })
  })
})
