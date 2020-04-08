import * as request from 'request'
import * as crypto from 'crypto'
import * as querystring from 'querystring'
import * as url from 'url'
import 'es6-shim'

import { IApiConfig, IApiOptions } from './API/IApiConfig'

export default class Api {
  public readonly config: IApiConfig

  constructor(config?: IApiConfig) {
    const defaultConfig: IApiConfig = {
      uri: 'https://api.sendwyre.com',
      version: '3',
      format: 'json',
      qs: {},
      headers: {
        'Content-Type': 'application/json'
      }
    }

    this.config = Object.assign({}, defaultConfig, config)
  }

  public get isAuthed(): boolean {
    return !!this.config.auth && !!this.config.auth.secretKey && !!this.config.auth.apiKey
  }

  public requireAuthed() {
    if (!this.isAuthed)
      throw new Error('Must be authenticated for this endpoint.')
  }

  public masqueradeAs(id: string): Api {
    if (!this.isAuthed)
      throw new Error('Cannot masquerade with no authorization.')

    const newConfig = Object.assign({}, this.config)
    newConfig.auth.masqueradeTarget = id

    return new Api(newConfig)
  }

  public get<T extends any>(path: string, params?: object, options?: IApiOptions): Promise<T> {
    return this.request<T>('GET', path, params, options)
  }

  public post<T extends any>(path: string, body?: object, options?: IApiOptions): Promise<T> {
    return this.request<T>('POST', path, body, options)
  }

  public put<T extends any>(path: string, body?: object, options?: IApiOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options)
  }

  public delete<T extends any>(path: string, body?: object, options?: IApiOptions): Promise<T> {
    return this.request<T>('DELETE', path, body, options)
  }

  private request<T extends any>(method: string, path: string, params: object = {}, options: IApiOptions = {}): Promise<T> {
    if (!path)
      throw 'path required'

    let requestOptions = this.buildRequestOptions(method, path, params, options)

    return new Promise((resolve, reject) => {
      request(requestOptions, (err, res) => {
        if (err)
          throw err
        else if (res.statusCode >= 200 && res.statusCode < 300)
          resolve(res.body || {})
        else
          reject(res.body || { statusCode: res.statusCode })
      })
    })
  }

  private buildRequestOptions(method: string, path: string, params: any, options: IApiOptions): request.UrlOptions & request.CoreOptions {
    const config: IApiConfig = {
      ...this.config,
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers
      },
      qs: {
        ...this.config.qs,
        ...options.qs
      }
    }

    const parsedUrl = url.parse(url.resolve(config.uri, `v${config.version}/${path}`), true)
    const json = config.headers['Content-Type'] === 'application/json'

    let requestOptions: request.UrlOptions & request.CoreOptions = {
      ...options,
      url: parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.pathname, // no querystring here!
      method: method,
      headers: {
        ...config.headers
      },
      qs: {
        ...config.qs,
        timestamp: new Date().getTime(),
        format: this.config.format
      },
      json: json
    }

    if (requestOptions.method == 'GET')
      requestOptions.qs = Object.assign(requestOptions.qs, params)
    else
      requestOptions.body = params

    Object.assign(requestOptions.qs, parsedUrl.query)
    if (this.isAuthed && config.auth.masqueradeTarget && !('masqueradeAs' in requestOptions))
      requestOptions.qs.masqueradeAs = config.auth.masqueradeTarget

    if (this.isAuthed) {
      requestOptions.headers['X-Api-Key'] = config.auth.apiKey
      requestOptions.headers['X-Api-Signature'] = this.buildSignature(requestOptions)
    }

    return requestOptions
  }

  private buildSignature(requestOptions: request.UrlOptions & request.CoreOptions): string {
    this.requireAuthed()

    let buffers: Buffer[] = []
    const encoding = 'utf8'

    buffers.push(Buffer.from(requestOptions.url.toString(), encoding))
    buffers.push(Buffer.from(requestOptions.url.toString().indexOf('?') < 0 ? '?' : '&', encoding))
    buffers.push(Buffer.from(querystring.stringify(requestOptions.qs), encoding))

    if (requestOptions.body) {
      if (typeof requestOptions.body == 'string')
        buffers.push(Buffer.from(requestOptions.body, encoding))
      else if (requestOptions.body instanceof Buffer)
        buffers.push(requestOptions.body)
      else
        buffers.push(Buffer.from(JSON.stringify(requestOptions.body), encoding))
    }

    return crypto.createHmac('sha256', this.config.auth.secretKey)
      .update(Buffer.concat(buffers))
      .digest('hex')
  }
}