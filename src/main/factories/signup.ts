import { LogMongoRepository } from './../../infra/db/mongodb/log-repository/log'
import { AccountMongoRepository } from './../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorator/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const logErrorRepository = new LogMongoRepository()
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, makeSignUpValidation())
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
