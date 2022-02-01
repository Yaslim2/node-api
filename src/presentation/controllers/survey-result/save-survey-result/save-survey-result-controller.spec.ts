import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, LoadSurveyById, SurveyModel, SaveSurveyResult, SaveSurveyResultModel, SurveyResultModel } from './save-survey-result-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbbiden, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any-id',
    question: 'any-question',
    answers: [{
      image: 'any-image',
      answer: 'any-answer'
    }],
    date: new Date()
  }
}

const makeFakeSurveyResult = (): SurveyResultModel => ({
  accountId: 'valid-account-id',
  answer: 'valid-answer',
  id: 'valid-id',
  date: new Date(),
  surveyId: 'valid-survey-id'
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any-survey-id'
  },
  body: {
    answer: 'any-answer'
  },
  accountId: 'any-account-id'
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return makeFakeSurvey()
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeFakeSurveyResult()
    }
  }
  return new SaveSurveyResultStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return { sut, loadSurveyByIdStub, saveSurveyResultStub }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any-survey-id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbbiden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        answer: 'wrong-answer'
      },
      params: {
        surveyId: 'any-survey-id'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbbiden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'any-account-id',
      surveyId: 'any-survey-id',
      date: new Date(),
      answer: 'any-answer'
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
