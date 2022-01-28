import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

let surveyCollection: Collection

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
  })
})
