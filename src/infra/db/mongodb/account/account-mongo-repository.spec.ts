import { Collection } from 'mongodb'
import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'

let accountCollection: Collection
const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        name: 'any-name',
        email: 'any-email@email.com',
        password: 'any-password'
      })

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any-name')
      expect(account.email).toBe('any-email@email.com')
      expect(account.password).toBe('any-password')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any-name',
        email: 'any-email@email.com',
        password: 'any-password'
      })
      const account = await sut.loadByEmail('any-email@email.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any-name')
      expect(account.email).toBe('any-email@email.com')
      expect(account.password).toBe('any-password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any-email@email.com')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account access token on updateAccessToken success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne({
        name: 'any-name',
        email: 'any-email@email.com',
        password: 'any-password'
      })
      const fakeAccount = res.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      await sut.updateAccessToken(fakeAccount._id, 'any-token')
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any-token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any-name',
        email: 'any-email@email.com',
        password: 'any-password',
        accessToken: 'any-token'
      })
      const account = await sut.loadByToken('any-token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any-name')
      expect(account.email).toBe('any-email@email.com')
      expect(account.password).toBe('any-password')
    })

    test('Should return an account on loadByToken with role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any-name',
        email: 'any-email@email.com',
        password: 'any-password',
        accessToken: 'any-token',
        role: 'any-role'
      })
      const account = await sut.loadByToken('any-token', 'any-role')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any-name')
      expect(account.email).toBe('any-email@email.com')
      expect(account.password).toBe('any-password')
    })
  })
})
