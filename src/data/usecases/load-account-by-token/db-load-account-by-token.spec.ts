import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'any-value'
    }
  }
  return new DecrypterStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return { sut, decrypterStub }
}

describe('DbLoadAccountByToken usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { decrypterStub, sut } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any-token', 'any-role')
    expect(decryptSpy).toHaveBeenCalledWith('any-token')
  })

  test('Should return null if Decrypter return null', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const account = await sut.load('any-token')
    expect(account).toBeNull()
  })
})
