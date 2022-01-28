import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { Controller, HttpRequest, HttpResponse } from './load-survey-protocols'
import { ok } from '../../../helpers/http/http-helper'

export class LoadSurveyController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load()
    return ok(surveys)
  }
}
