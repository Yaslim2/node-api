import { InvalidParamError, MissingParamError } from '../../errors'
import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAcount } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAcount

  constructor (emailValidator: EmailValidator, addAccount: AddAcount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) { return badRequest(new MissingParamError(field)) }
      }
      const { name, password, email, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) { return badRequest(new InvalidParamError('passwordConfirmation')) }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) { return badRequest(new InvalidParamError('email')) }

      const account = this.addAccount.add({
        name, email, password
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}