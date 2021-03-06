import nock from 'nock'
import Client from '../../Client'

const statsFixture = () => ({
  token_supply: 33319737.03712976,
  election_times: {
    last_week: {
      stddev: 4381.802416301061,
      avg: 2491.7736625514403,
    },
    last_month: {
      stddev: 2058.844951917282,
      avg: 2258.0819529206624,
    },
    last_hour: {
      stddev: 2355.37268813239,
      avg: 3457.5,
    },
    last_day: {
      stddev: 29350.72671502,
      avg: 17517.2,
    },
  },
  block_times: {
    last_week: {
      stddev: 673.625988947502,
      avg: 69.75271049596309,
    },
    last_month: {
      stddev: 312.293385489168,
      avg: 63.87739057570978,
    },
    last_hour: {
      stddev: 21.09901328455719,
      avg: 59.53333333333333,
    },
    last_day: {
      stddev: 4253.253090144334,
      avg: 397.82488479262673,
    },
  },
})

describe('get stats', () => {
  nock('https://api.helium.io').get('/v1/stats').reply(200, {
    data: statsFixture(),
  })

  it('retrieves network stats', async () => {
    const client = new Client()
    const stats = await client.stats.get()
    expect(stats.tokenSupply).toBe(33319737.03712976)
  })
})
