import { AddAcount } from '@/domain/usecases/account/add-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'

export const makeDbAddAccount = (): AddAcount => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, loadAccountByEmailRepository)
}
