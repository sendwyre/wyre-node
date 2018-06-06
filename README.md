Wyre
====

Node.js client library for the [Wyre API](https://www.sendwyre.com/docs/).

Install
-------

```
npm install wyre-api
```

Usage
-----

```js
const WyreClient = require('wyre-api').WyreClient
// import {WyreClient} from 'wyre-api'

let wyre = new WyreClient({
    apiKey: "P334FCDXQ4UVAWVPUZ4V",
    secretKey: "4AZEWMYB7CFJWWZMCEWX"
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
