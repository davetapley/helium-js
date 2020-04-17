import type Client from '../Client'
import Block from '../models/Block'
import Account from '../models/Account'
import Transaction from '../models/Transaction'
import PendingTransaction from '../models/PendingTransaction'
import ResourceList from '../ResourceList'

interface ListParams {
  cursor?: string
  filterTypes?: Array<string>
}

export default class Transactions {
  private client!: Client
  private context?: Block | Account

  constructor(client: Client, context?: Block | Account) {
    this.client = client
    this.context = context
  }

  async submit(txn: string): Promise<PendingTransaction> {
    const url = '/pending_transactions'
    const { data: { data } } = await this.client.post(url, { txn })
    return new PendingTransaction(data)
  }

  async get(hash: string): Promise<Transaction> {
    const url = `/transactions/${hash}`
    const { data: { data } } = await this.client.get(url)
    return new Transaction(this.client, data)
  }

  async list(params: ListParams = {}): Promise<ResourceList> {
    if (this.context instanceof Block) {
      return this.listFromBlock(params)
    }
    if (this.context instanceof Account) {
      return this.listFromAccount(params)
    }
    throw new Error('Must provide a block or account to list transactions from')
  }

  private async listFromBlock(params: ListParams): Promise<ResourceList> {
    const block = this.context as Block
    const url = `/blocks/${block.height}/transactions`
    const response = await this.client.get(url, { cursor: params.cursor })
    const { data: { data: txns, cursor } } = response
    const data = txns.map((d: object) => new Transaction(this.client, d))
    return new ResourceList(data, this.list.bind(this), cursor)
  }

  private async listFromAccount(params: ListParams): Promise<ResourceList> {
    const account = this.context as Account
    const url = `/accounts/${account.address}/activity`
    const filter_types = params.filterTypes ? params.filterTypes.join() : undefined
    const response = await this.client.get(url, { cursor: params.cursor, filter_types })
    const { data: { data: txns, cursor } } = response
    const data = txns.map((d: object) => new Transaction(this.client, d))
    return new ResourceList(data, this.list.bind(this), cursor)
  }
}
