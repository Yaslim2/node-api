
import { AddAcount, AddAccountModel, AccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAcount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return await new Promise((resolve) => resolve(account))
  }
}
