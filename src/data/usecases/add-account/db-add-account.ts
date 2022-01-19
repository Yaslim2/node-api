
import { AddAcount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAcount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  constructor (encrypter: Encrypter, addAccountRepositoryStub: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepositoryStub
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return await new Promise((resolve) => resolve({ email: 'oi', name: 'oi', password: 'oi', id: 'eu' }))
  }
}
