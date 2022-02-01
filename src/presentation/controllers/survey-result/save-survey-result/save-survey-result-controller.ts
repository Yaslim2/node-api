import { InvalidParamError } from '@/presentation/errors'
import { forbbiden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'
export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById, private readonly saveSurveyResult: SaveSurveyResult) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)

      if (survey) {
        const answers = survey.answers.map(value => value.answer)
        if (!answers.includes(answer)) {
          return forbbiden(new InvalidParamError('answer'))
        }
        const surveyResult = await this.saveSurveyResult.save({
          accountId, surveyId, answer, date: new Date()
        })
        return ok(surveyResult)
      } else {
        return forbbiden(new InvalidParamError('surveyId'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
