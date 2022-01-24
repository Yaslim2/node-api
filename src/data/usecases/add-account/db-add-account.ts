
import { AddAcount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAcount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository
  constructor (hasher: Hasher, addAccountRepositoryStub: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepositoryStub
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return await new Promise((resolve) => resolve(account))
  }
}
