import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-survey-repository'
import { DbLoadSurveys } from './db-load-surveys'
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

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return makeFakeSurveys()
    }
  }
  return new LoadSurveysRepositoryStub()
}

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return { sut, loadSurveysRepositoryStub }
}

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    const { loadSurveysRepositoryStub, sut } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.load()
    expect(httpResponse).toEqual(makeFakeSurveys())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
