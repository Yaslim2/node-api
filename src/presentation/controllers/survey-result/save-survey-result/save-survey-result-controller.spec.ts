import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, LoadSurveyById, SurveyModel } from './save-survey-result-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbbiden, serverError } from '@/presentation/helpers/http/http-helper'

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

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any-survey-id'
  },
  body: {
    answer: 'any-answer'
  }
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return makeFakeSurvey()
    }
  }
  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)
  return { sut, loadSurveyByIdStub }
}

describe('SaveSurveyResult Controller', () => {
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
})
