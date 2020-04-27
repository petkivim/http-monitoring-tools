# HTTP Monitoring Tools

HTTP Monitoring Tools provides tools for monitoring availability and
certificate validity of HTTP endpoints:

* `getHealthInfo` returns information about HTTP endpoint's availability, such
as HTTP status code, request duration in milliseconds, is endpoint considered healthy.
* `getSslCertificateInfo` returns basic information about HTTP endpoint's SSL
certificate, such as common name, issued date, expire date, number of valid
days left.

## Installation

Add `http-monitoring-tools` as a dependency:

```
$ npm install http-monitoring-tools --save # npm i -s http-monitoring-tools
```

## Usage

### getHealthInfo

CommonJS:
```
const tools = require('http-monitoring-tools')
```

ES module:
```
import tools from 'http-monitoring-tools'
```

Request:
```
tools.getHealthInfo('www.google.com').then((res) => {
  console.log(res)
}).catch((e) =>  {
  console.log(e)
})
```

Response:
```
{
  host: 'www.google.com',
  httpStatusCode: 200,
  isHealthy: true,
  now: '2020-04-26T11:43:23.504Z',
  requestDuration: 153,
  useHttps: true
}
```

`isHealthy` is `true` when `httpStatusCode` is between 200 and 399. Otherwise
`isHealthy` is `false`. Some sites, e.g. sites hosted on Squarespace, may
return status code 400 if `user-agent` HTTP header is missing even if the site
is working normally. Therefore, the default value `{ 'user-agent': '...' }` is
used.

#### Options
| Option | Default | |
|--|--|--|
| port | `443` | Target port |
| path | ` ` | Target path |
| method | `HEAD` | HTTP request method |
| headers | `{ 'user-agent': '...' }` | HTTP request headers |
| https | `true` | Send request using `https`. When `https=false`, `http` is used  |

Override default options:
```
# Override port and method
tools.getSslCertificateInfo('www.google.com', { port: 8443, method: 'POST' })

# Use http instead of https
tools.getSslCertificateInfo('www.google.com', { port: 80, https: false })

# Override headers
tools.getSslCertificateInfo('www.google.com', { headers: { 'custom-header':'value'} })
```
### getSslCertificateInfo

CommonJS:
```
const tools = require('http-monitoring-tools')
```

ES module:
```
import tools from 'http-monitoring-tools'
```

Request:
```
tools.getSslCertificateInfo('www.google.com').then((res) => {
  console.log(res)
}).catch((e) =>  {
  console.log(e)
})
```

Response:
```
{
  host: 'www.google.com',
  commonName: 'www.google.com',
  issuerCommonName: 'GTS CA 1O1',
  validFrom: '2020-04-07T09:49:21.000Z',
  validTo: '2020-06-30T09:49:21.000Z',
  now: '2020-04-26T08:09:40.576Z',
  validDaysLeftCount: 65,
  valid: true,
  fingerprint: '51:E2:E8:B8:38:39:0F:FD:8F:5D:3F:93:F4:AE:BC:42:8B:3E:77:13'
}
```

**N.B.** Self-signed certificates are supported.

#### Options
| Option | Default | |
|--|--|--|
| port | `443` | Target port |
| path | ` ` | Target path |
| method | `HEAD` | HTTP request method |
| headers | `{ 'user-agent': '...' }` | HTTP request headers |

Override default options:
```
# Override port and method
tools.getSslCertificateInfo('www.google.com', { port: 8443, method: 'POST' })

# Override headers
tools.getSslCertificateInfo('www.google.com', { headers: { 'custom-header':'value'} })
```

## Build

```
$ git clone https://github.com/petkivim/http-monitoring-tools.git
$ npm install
$ npm run cjs
```
