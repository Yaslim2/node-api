import { AccountModel } from '../models/account'
import { AddAccountParams } from '../usecases/account/add-account'

export const mockAccountModel = (): AccountModel => ({
  id: 'any-id',
  name: 'any-name',
  email: 'any-email@any.com',
  password: 'hashed-password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any-name',
  email: 'any-email@any.com',
  password: 'any-password'
})
