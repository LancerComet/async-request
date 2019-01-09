/* tslint:disable */

import AxiosInstance from 'axios'

declare namespace AsyncRequest {
  const AsyncRequest: <TRes, TReq = object>(
    option: IAsyncRequestOption<TRes, TReq>
  ) => any

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
  export const asyncRequestFactory: (axios?: AxiosInstance) => AsyncRequest

  /**
   * Async Request Decorator Option.
   */
  export interface IAsyncRequestOption <TRes, TReq = object> {
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
  export interface IAsyncRequestResult<T> {
    data: T
    rawResponse: AxiosResponse<T>
    error: AxiosError
  }
}

export = AsyncRequest
