import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '@/main/factories/usecases/survey/load-survey/db-load-surveys-factory'
import { LoadSurveyController } from '@/presentation/controllers/survey/load-survey/load-survey-controller'

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveyController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
