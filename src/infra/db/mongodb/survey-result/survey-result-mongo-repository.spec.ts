import { SurveyModel } from '@/domain/models/survey'
import { Collection, ObjectID } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

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

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any-name',
    email: 'any-mail@mail.com',
    password: 'any-password'
  })
  return MongoHelper.map(res.ops[0])
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

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    test('Should update a survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const res = await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(ObjectID(surveyResult.id)).toEqual(res.ops[0]._id)
      expect(surveyResult.answer).toBe(survey.answers[1].answer)
    })
  })
})
