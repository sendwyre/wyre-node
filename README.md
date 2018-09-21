Wyre
====

Node.js client library for the [Wyre API](https://www.sendwyre.com/docs/).

Install
-------

```
npm install @wyre/api
```

Usage
-----

*An important note on decimals*:

Some currencies, like ETH, have many decimal places. This can cause problems with the
many JSON implementations that fail to offer support arbitrary precision numbers. Moreover, IEEE 754 floating point
is not in general a good representation for money - it does not necessarily preserve precision.

In the examples below, we have supplied the `format` parameter as `"json_numberstring"`. This encodes all
numbers returned from our API as strings. If you need to perform arithmetic on these numbers, you ***must***
use an arbitrary-precision library:

- [BigDecimal.js](https://github.com/iriscouch/bigdecimal.js): a literal port of Java's BigInteger and BigDecimal classes.
- [bignum](https://github.com/justmoon/node-bignum): Big integer arithmetic using OpenSSL.

Alternatively, instead supply the (default) `"format":"json"` and the API will encode numbers directly in JSON.

```js
const WyreClient = require('@wyre/api').WyreClient
// import {WyreClient} from '@wyre/api'

let wyre = new WyreClient({
    format: "json_numberstring",
    apiKey: "P334FCDXQ4UVAWVPUZ4V",
    secretKey: "4AZEWMYB7CFJWWZMCEWX"
    //baseUrl: "https://api.testwyre.com"
})

wyre.get("/account")
    .then(data => {
        // .. success
    },
    err => {
        // .. error
    })

wyre.get("/transfers", {
    limit: 1,
    offset: 1
})
    .then(successCallback, errorCallback)

wyre.post("/transfers", {
    sourceAmount: "10",
    sourceCurrency: "USD",
    dest: "email:test@sendwyre.com"
})
    .then(successCallback, errorCallback)
```

Ability to override options used by the [Request](https://github.com/request/request) client on both constructor and per request:

```js
let wyre = new WyreClient({
    format: "json_numberstring",
    apiKey: "P334FCDXQ4UVAWVPUZ4V",
    secretKey: "4AZEWMYB7CFJWWZMCEWX",
    options: {
        timeout: 1500
    }
})
```

```js
wyre.get("/rates", {}, {
    timeout: 1500
})
    .then(successCallback, errorCallback)
```

Errors
------

Example error response:
```js
{
    language: "en",
    exceptionId: "8MAM48",
    compositeType: "Field deprecated",
    subType: "Field deprecated",
    message: "Field dest is required.",
    type: "FieldRequiredException",
    transient: false
}
```
