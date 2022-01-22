
import { AuthenticationModel } from './../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from './db-authentication-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'any-id',
  password: 'any-password',
  name: 'any-name',
  email: 'any-email@email.com'
})

const makeFakeAuthentication = (): AuthenticationModel => ({ email: 'any-email@email.com', password: 'any-password' })

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account = makeFakeAccount()
      return await new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return { sut, loadAccountByEmailRepositoryStub }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenLastCalledWith('any-email@email.com')
  })
})
