import Axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { asyncRequestFactory, IAsyncRequestResult } from '../lib'

describe('AsyncRequest testing.', () => {
  const mock = new MockAdapter(Axios)
  mock.onGet('/get').reply(200, {
    data: {
      name: 'LancerComet'
    },
    code: 0
  })
  mock.onPost('/post').reply(200, {
    data: null,
    code: 0
  })
  mock.onGet('/400').reply(400, {
    data: null,
    code: 400
  })
  mock.onGet('/500').reply(500)

  const axios = Axios.create()
  const AsyncRequest = asyncRequestFactory(axios)

  it('Get request.', async (done) => {
    class TestService {
      @AsyncRequest({
        url: '/get',
        onSuccess (response) {
          done()
        }
      })
      async getRequest (): Promise<IAsyncRequestResult<{ name: string }>> {
        return null
      }
    }

    const testService = new TestService()
    const { data, error } = await testService.getRequest()
    expect(error).toBeNull()
    expect(data).toEqual({
      code: 0,
      data: {
        name: 'LancerComet'
      }
    })
  })

  it('Post request.', async (done) => {
    class TestService {
      @AsyncRequest<{ code: number, data: null }>({
        url: '/post',
        method: 'post',
        onSuccess (response) {
          const data = response.data
          expect(data).toEqual({
            data: null,
            code: 0
          })
          done()
        }
      })
      async postRequest (data: { name: string }): Promise<IAsyncRequestResult<void>> {
        return null
      }
    }

    const testService = new TestService()
    const { error } = await testService.postRequest({ name: 'LancerComet' })
    expect(error).toBeNull()
  })

  it('HTTP 400.', async (done) => {
    class TestService {
      @AsyncRequest({
        url: '/400',
        onError (error) {
          expect(error.response.status).toEqual(400)
          done()
        }
      })
      async http400 (): Promise<IAsyncRequestResult<void>> {
        return null
      }
    }

    const testService = new TestService()
    await testService.http400()
  })

  it('HTTP 404.', async (done) => {
    class TestService {
      @AsyncRequest({
        url: '/404',
        onError (error) {
          expect(error.response.status).toEqual(404)
          done()
        }
      })
      async http404 (): Promise<IAsyncRequestResult<void>> {
        return null
      }
    }

    const testService = new TestService()
    await testService.http404()
  })
})
