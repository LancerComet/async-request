import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Create an AsyncRequest Decorator.
 *
 * @param {AxiosInstance} [axios] Axios instance.
 * @returns
 *
 * @example
 *   const AsyncRequest = asyncRequestFactory()
 *
 *   class UserService {
 *     @AsyncRequest({...})
 *     async getUserData () {
 *       return null
 *     }
 *   }
 */
function asyncRequestFactory (axios?: AxiosInstance) {
  if (!axios) {
    axios = Axios.create()
  }

  const AsyncRequest = <TRes, TReq = object>(option: IAsyncRequestOption<TRes, TReq>) => {
    return function (TargetClass: any, name: string, descriptor: PropertyDescriptor) {
      const method = option.method || 'get'
      const { url, processor, onSuccess, onError, presetData, throwErrorWhen } = option

      descriptor.value = async function (requestData: TReq): Promise<IAsyncRequestResult<TRes>> {
        const reqConfig: AxiosRequestConfig = {
          url, method
        }

        if (typeof requestData === 'object' || typeof presetData === 'function') {
          const _requestData = Object.assign(
            typeof presetData === 'function' ? presetData() : {},
            requestData || {}
          )

          typeof processor === 'function' && processor.call(this, _requestData)

          if (method === 'post') {
            reqConfig.data = _requestData
          } else {
            reqConfig.params = _requestData
          }
        }

        if (method === 'post' && !reqConfig.data) {
          // Axios will make request without Content-Type header if post body is empty.
          // https://github.com/axios/axios/issues/1535
          reqConfig.data = {}
        }

        let axiosResponse: AxiosResponse<TRes> = null
        let requestError: AxiosError = null

        try {
          const res = await axios(reqConfig)
          axiosResponse = res
        } catch (error) {
          requestError = error
        }

        // Execute 'throwErrorWhen'.
        if (typeof throwErrorWhen === 'function') {
          const customError = throwErrorWhen(requestData, axiosResponse)
          if (customError) {
            const error: AxiosError = Object.assign({}, customError, {
              config: reqConfig,
              code: null,
              request: requestData,
              response: axiosResponse
            })

            typeof onError === 'function' && onError.call(this, error, axiosResponse)

            return {
              data: null,
              rawResponse: null,
              error
            }
          }
        }

        if (requestError) {
          typeof onError === 'function' && onError.call(this, requestError, axiosResponse)

          return {
            data: null,
            rawResponse: null,
            error: requestError
          }
        }

        typeof onSuccess === 'function' && onSuccess.call(this, axiosResponse)

        return {
          data: axiosResponse.data,
          rawResponse: axiosResponse,
          error: null
        }
      }
    }
  }

  return AsyncRequest
}

export {
  asyncRequestFactory,
  IAsyncRequestOption,
  IAsyncRequestResult
}

/**
 * Async Request Decorator Option.
 */
interface IAsyncRequestOption <TRes, TReq = object> {
  /**
   * Request URL.
   */
  url: string

  /**
   * Request http method.
   *
   * @default 'get'
   */
  method?: 'get' | 'post' | 'put' | 'delete' | 'head'

  /**
   * Request data processor.
   * Only available when request data was given.
   *
   * @param {TReq} requestData
   */
  processor?: (requestData: TReq) => void

  /**
   * Request data preset.
   */
  presetData?: () => TReq

  /**
   * On success callback.
   *
   * @param {TRes} response
   */
  onSuccess?: (response: AxiosResponse<TRes>) => void

  /**
   * On error callback.
   *
   * @param {AxiosError} error
   * @param {AxiosResponse<TRes>}
   */
  onError?: (error: AxiosError, response: AxiosResponse<TRes>) => void

  /**
   * Custom error handler.
   * Return your custom error.
   *
   * @param {TReq} requestData
   * @param {AxiosResponse<Tes>} response
   */
  throwErrorWhen?: (requestData: TReq, response: AxiosResponse<TRes>) => Error
}

/**
 * AsyncRequest result wrapper.
 */
interface IAsyncRequestResult<T> {
  data: T
  rawResponse: AxiosResponse<T>
  error: AxiosError
}
