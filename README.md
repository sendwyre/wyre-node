# Wyre NodeJS API Client

Node.js client library for the [Wyre API](https://www.sendwyre.com/docs/).

## Install

```
npm install @wyre/api
```

### Regarding Decimal Numbers

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

**This parameter must be passed as a query parameter and _not_ via the body!** Alternatively, you may use the [masquerading API](#masquerading-api)
for a more natural declaration.

## Quickstart

```js
const WyreClient = require('@wyre/api')

const client = new WyreClient({
    auth: {
        apiKey: 'AK-api-key',
        secretKey: 'SK-secret-key'
    },
    version: '3', // Keep this unless doing manual api calls
    // uri: 'https://api.testwyre.com', // Uncomment this line to use the testwyre environment
    format: 'json_numberstring',
    headers: {},
    qs: {}
})

// Get account from auth credentials
client.fetchAccount()
    .then((account) => {
        console.log("I am Wyre account ", account.id);
    })
    .catch((err) => {
        console.log("Problems, cap'n: ", err);
    })
```

You're all set to begin coding!

### Example API Calls

Attempt a $10 USD->BTC conversion:
```js
account.createTransfer({
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
client.api.post('accounts/' + account.id + '/individualGovernmentId', 
        my_id, 
        { headers: { 'Content-Type': 'image/jpeg' }})
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
| auth.apiKey    | your environment-specific Wyre API key
| auth.secretKey | your environment-specific Wyre API secret
| auth.masqueradeTarget | sub-account id to masquerade as
| uri   | specifies the Wyre environment you'd like to use. please use either:<br>`https://api.sendwyre.com` for production<br>`https://api.testwyre.com` for testwyre
| version   | specifies the Wyre API version to use. Defaults to 3.
| format    | the data format you're requesting.<br>`json` for straight JSON <br>`json_numberstring` for JSON with all decimals as strings (see [above](#regarding-decimal-numbers)]  
| headers   | headers that are passed to the underlying [Request](https://github.com/request/request) for _every_ request
| qs   | query string parameters that are passed to the underlying [Request](https://github.com/request/request) for _every_ request
| timeout   | timeout limit for API request in milliseconds

Note that the ability to override options used by the [Request](https://github.com/request/request) client is 
available both generally as well as per-request.

Timeouts may be adjusted via the `options.timeout` (expressed in milliseconds). This may be controlled via the constructor,
or per-request (as with all options).

### Request API

Each of these methods performs a single Wyre API request and returns a promise for the resulting API response.

```js
client.api.get(path, parameters, options)
client.api.post(path, body, options)
client.api.put(path, body, options)
client.api.delete(path, body, options)
```

### Masquerading API

This is an alternative to supplying the `masqueradeAs` parameter as a query parameter.

```js
// init the wyre client as usual
const client = new WyreClient({ /* your master api access setup here */ });

// Get sub-account with masquerade = true
client.fetchAccount('AC-sub-account-id', true)
    .then((account) => {
        console.log("I am Wyre sub-account ", account.id);
    })
    .catch((err) => {
        console.log("Problems, cap'n: ", err);
    })
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


