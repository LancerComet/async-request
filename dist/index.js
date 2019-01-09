(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios')) :
    typeof define === 'function' && define.amd ? define(['exports', 'axios'], factory) :
    (factory((global.AsyncRequest = {}),global.Axios));
}(this, (function (exports,Axios) { 'use strict';

    Axios = Axios && Axios.hasOwnProperty('default') ? Axios['default'] : Axios;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

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
    function asyncRequestFactory(axios) {
        if (!axios) {
            axios = Axios.create();
        }
        var AsyncRequest = function (option) {
            return function (TargetClass, name, descriptor) {
                var method = option.method || 'get';
                var url = option.url, processor = option.processor, onSuccess = option.onSuccess, onError = option.onError, presetData = option.presetData, throwErrorWhen = option.throwErrorWhen;
                descriptor.value = function (requestData) {
                    return __awaiter(this, void 0, void 0, function () {
                        var reqConfig, _requestData, axiosResponse, requestError, res, error_1, customError, error;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    reqConfig = {
                                        url: url, method: method
                                    };
                                    if (typeof requestData === 'object' || typeof presetData === 'function') {
                                        _requestData = Object.assign(typeof presetData === 'function' ? presetData() : {}, requestData || {});
                                        typeof processor === 'function' && processor.call(this, _requestData);
                                        if (method === 'post') {
                                            reqConfig.data = _requestData;
                                        }
                                        else {
                                            reqConfig.params = _requestData;
                                        }
                                    }
                                    if (method === 'post' && !reqConfig.data) {
                                        // Axios will make request without Content-Type header if post body is empty.
                                        // https://github.com/axios/axios/issues/1535
                                        reqConfig.data = {};
                                    }
                                    axiosResponse = null;
                                    requestError = null;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, axios(reqConfig)];
                                case 2:
                                    res = _a.sent();
                                    axiosResponse = res;
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _a.sent();
                                    requestError = error_1;
                                    return [3 /*break*/, 4];
                                case 4:
                                    // Execute 'throwErrorWhen'.
                                    if (typeof throwErrorWhen === 'function') {
                                        customError = throwErrorWhen(requestData, axiosResponse);
                                        if (customError) {
                                            error = Object.assign({}, customError, {
                                                config: reqConfig,
                                                code: null,
                                                request: requestData,
                                                response: axiosResponse
                                            });
                                            typeof onError === 'function' && onError.call(this, error, axiosResponse);
                                            return [2 /*return*/, {
                                                    data: null,
                                                    rawResponse: null,
                                                    error: error
                                                }];
                                        }
                                    }
                                    if (requestError) {
                                        typeof onError === 'function' && onError.call(this, requestError, axiosResponse);
                                        return [2 /*return*/, {
                                                data: null,
                                                rawResponse: null,
                                                error: requestError
                                            }];
                                    }
                                    typeof onSuccess === 'function' && onSuccess.call(this, axiosResponse);
                                    return [2 /*return*/, {
                                            data: axiosResponse.data,
                                            rawResponse: axiosResponse,
                                            error: null
                                        }];
                            }
                        });
                    });
                };
            };
        };
        return AsyncRequest;
    }

    exports.asyncRequestFactory = asyncRequestFactory;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
