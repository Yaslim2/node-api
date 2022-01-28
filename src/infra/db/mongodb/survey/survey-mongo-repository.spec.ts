import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'

let surveyCollection: Collection
const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any-question',
        answers: [{
          image: 'any-image',
          answer: 'any-answer'
        }, {
          answer: 'other-answer'
        }],
        date: new Date()
      })

      const survey = await surveyCollection.findOne({ question: 'any-question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany([{
        id: 'any-id',
        question: 'any-question',
        answers: [{
          image: 'any-image',
          answer: 'any-answer'
        }],
        date: new Date()
      },
      {
        id: 'other-id',
        question: 'other-question',
        answers: [{
          image: 'other-image',
          answer: 'other-answer'
        }],
        date: new Date()
      }])
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any-question')
    })

    test('Should load an empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
})
