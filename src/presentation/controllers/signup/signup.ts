import { HttpRequest, HttpResponse, Controller, AddAcount, Validation } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  private readonly addAccount: AddAcount
  private readonly validation: Validation

  constructor (addAccount: AddAcount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, password, email } = httpRequest.body

      const account = await this.addAccount.add({
        name, email, password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
