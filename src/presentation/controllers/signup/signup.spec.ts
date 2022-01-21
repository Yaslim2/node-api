import { AddAcount, AddAccountModel, AccountModel, HttpRequest, Validation } from './signup-protocols'
import { MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './signup'
import { ok, serverError, badRequest } from '../../helpers/http-helper'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid-name',
  email: 'valid-email@valid.com',
  password: 'valid-password'
})

const makeFakeRequest = (): HttpRequest => ({

  body: {
    name: 'any-name',
    email: 'any-email@email.com',
    password: 'any-password',
    passwordConfirmation: 'any-password'
  }

})

const makeAddAcount = (): AddAcount => {
  class AddAcountStub implements AddAcount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAcountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAcount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAcount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const { passwordConfirmation, ...requestWithoutPasswordConfirmation } = httpRequest.body
    expect(addSpy).toHaveBeenCalledWith(requestWithoutPasswordConfirmation)
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any-field'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any-field')))
  })
})
