import * as request from 'request'
import * as crypto from 'crypto'
import * as querystring from 'querystring'
import * as url from 'url'
import 'es6-shim'

import Authed from '../Authed'

const WYRE_BASEURL = 'https://api.testwyre.com'
const WYRE_API_VERSION = '3'
const WYRE_DEFAULT_API_FORMAT = 'json'

export default class API extends Authed {
  public get<T extends any>(path: string, params?: any, options?: any): Promise<T> {
    return this.request<T>('GET', path, params, options)
  }

  public post<T extends any>(path: string, body?: any, options?: any): Promise<T> {
    return this.request<T>('POST', path, body, options)
  }

  public put<T extends any>(path: string, body?: any, options?: any): Promise<T> {
    return this.request<T>('PUT', path, body, options)
  }

  public delete<T extends any>(path: string, body?: any, options?: any): Promise<T> {
    return this.request<T>('DELETE', path, body, options)
  }

  private request<T extends any>(method: string, path: string, params: any = {}, options: any = {}): Promise<T> {
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

  private buildRequestOptions(method: string, path: string, params: any, options: any): request.UrlOptions & request.CoreOptions {
    options = options || {}

    let parsedUrl = url.parse(url.resolve(WYRE_BASEURL, `v${WYRE_API_VERSION}/${path}`), true)
    let json = !(options.headers || {}).hasOwnProperty('Content-Type') || options.headers['Content-Type'] == 'application/json'

    let requestOptions: request.UrlOptions & request.CoreOptions = {
      ...this.config.options,
      ...options,
      url: parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.pathname, // no querystring here!
      method: method,
      headers: {
        ...this.config.options.headers,
        ...options.headers
      },
      qs: {
        ...this.config.qs,
        ...options.qs,
        timestamp: new Date().getTime(),
        format: this.config.format || WYRE_DEFAULT_API_FORMAT
      },
      json: json
    }

    if (requestOptions.method == 'GET')
      requestOptions.qs = Object.assign(requestOptions.qs, params)
    else
      requestOptions.body = params

    Object.assign(requestOptions.qs, parsedUrl.query)
    if (this.isAuthed && this.config.auth.masqueradeTarget && !('masqueradeAs' in requestOptions))
      requestOptions.qs.masqueradeAs = this.config.auth.masqueradeTarget

    if (this.isAuthed) {
      requestOptions.headers['X-Api-Key'] = this.config.auth.apiKey
      requestOptions.headers['X-Api-Signature'] = this.buildSignature(requestOptions)
    }

    return requestOptions
  }

  private buildSignature(requestOptions: request.UrlOptions & request.CoreOptions): string {
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