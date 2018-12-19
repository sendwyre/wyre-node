# Wyre NodeJS API Client

Node.js client library for the [Wyre API](https://www.sendwyre.com/docs/).

## Install

```
npm install @wyre/api
```

### Regarding Decimal Numbers {#decimals}

Some currencies, like ETH, have many decimal places. This can cause problems with the
many JSON implementations that fail to offer support arbitrary precision numbers. Moreover, IEEE 754 floating point
is not in general a good representation for money - it does not necessarily preserve precision.

In the examples below, we have supplied the `format` parameter as `"json_numberstring"`. This encodes all
numbers returned from our API as strings. If you need to perform arithmetic on these numbers, you ***must***
use an arbitrary-precision library:

- [bignumber.js](https://github.com/MikeMcl/bignumber.js): A JavaScript library for arbitrary-precision decimal and non-decimal arithmetic

Alternatively, instead supply the (default) `"format":"json"` and the API will encode numbers directly in JSON.

### Regarding Masquerading

As the Wyre API may be used in a custodial context; this means that a single account may have permission to act
on behalf of subaccount. To assist maintaining firm barriers between account permissions (creating an extra barrier
of protection), when acting on behalf of a specific account we require explicitly declaring this via the `masqueradeAs`
parameter.

**This parameter must be passed as a query parameter and _not_ via the body!** Alternatively, you may use the [masquerading API](#masq)
for a more natural declaration.

## Quickstart

```js
const WyreClient = require('@wyre/api').WyreClient

let wyre = new WyreClient({
    format: "json_numberstring",
    apiKey: "AK-AAAAAAA-AAAAAAA-AAAAAAA-AAAAAAA",
    secretKey: "SK-AAAAAAA-AAAAAAA-AAAAAAA-AAAAAAA"
    // baseUrl: "https://api.testwyre.com" // todo uncomment this line to use the testwyre environment
});

wyre.get("/v2/account")
    .then(account => {
        console.log("I am Wyre account ", account.id);
    },
    err => {
        console.log("Problems, cap'n: ", err);
    });
```

You're all set to begin coding!

### Example API Calls

Attempt a $10 USD->BTC conversion:
```js
wyre.post("/transfers", {
    sourceAmount: "10",
    sourceCurrency: "USD",
    destCurrency: "BTC",
    dest: "account:" + account.id
}).then(successCallback, errorCallback)
```

Upload a document:
```js
var fs = require('fs');
let my_id = fs.readFileSync('./my_id.jpg');
wyre.post('/v3/accounts/' + account.id + '/individualGovernmentId', my_id, { headers: { 'Content-Type': 'image/jpeg' }})
    .then(successCallback, errorCallback);
```

## API Reference

### Constructor

```js
let wyre = new WyreClient({/*parameter object*/})
```

Constructor parameters:

| parameter | description
| ----------|--------------
| apiKey    | your environment-specific Wyre API key
| secretKey | your environment-specific Wyre API secret
| baseUrl   | specifies the Wyre environment you'd like to use. please use either:<br>`https://api.sendwyre.com` for production<br>`https://api.testwyre.com` for testwyre
| format    | the data format you're requesting.<br>`json` for straight JSON <br>`json_numberstring` for JSON with all decimals as strings (see [above](#decimals)]  
| options   | options that are passed to the underlying [Request](https://github.com/request/request) for _every_ request

Note that the ability to override options used by the [Request](https://github.com/request/request) client is 
available both generally as well as per-request.

Timeouts may be adjusted via the `options.timeout` (expressed in milliseconds). This may be controlled via the constructor,
or per-request (as with all options).

### Request API

Each of these methods performs a single Wyre API request and returns a promise for the resulting API response.

```js
wyre.get(path, parameters, options)
wyre.post(path, body, options)
wyre.put(path, body, options)
wyre.delete(path, body, options)
```

### Masquerading API {#masq}

This is an alternative to supplying the `masqueradeAs` parameter as a query parameter.

```js
// init the wyre client as usual
let wyre = new WyreClient({ /* your master api access setup here */ });

// create another sub-client authenticated as a particular user
let user1_wyre = wyre.masqueraded('AC-ABCDE12345');

// now use that client as normal!
user1_wyre.get('/v3/accounts/AC-ABCDE12345').then(successCallback, failureCallback);

```

### Errors

Example error response:
```json
{
    "language": "en",
    "exceptionId": "8MAM48",
    "compositeType": "",
    "subType": "",
    "message": "Field dest is required.",
    "type": "FieldRequiredException",
    "transient": false
}
```


