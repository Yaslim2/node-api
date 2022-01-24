import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise((resolve) => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return await new Promise((resolve) => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any-value')
    expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
  })

  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any-value')
    expect(hash).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.hash('any-value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any-value', 'any-hash')
    expect(compareSpy).toHaveBeenCalledWith('any-value', 'any-hash')
  })
})
