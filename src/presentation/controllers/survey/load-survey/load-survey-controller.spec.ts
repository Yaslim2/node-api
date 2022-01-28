import { SurveyModel, LoadSurveys } from './load-survey-protocols'
import { LoadSurveyController } from './load-survey-controller'
import MockDate from 'mockdate'

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
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
    }]
}

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return makeFakeSurveys()
    }
  }
  return new LoadSurveysStub()
}

interface SutTypes {
  sut: LoadSurveyController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveyController(loadSurveysStub)
  return {
    sut, loadSurveysStub
  }
}

describe('LoadSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    const { loadSurveysStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
