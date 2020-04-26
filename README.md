
# HTTP Monitoring Tools

HTTP Monitoring Tools is a Node.js library that provides tools for monitoring
availability and certificate validity of HTTP endpoints:

* `getSslCertificateInfo` returns basic information of HTTP endpoint's SSL
certificate, such as common name, issued date, expire date, number of valid
days left, etc.

## Installation

Add `http-monitoring-tools` as a dependency:

```
$ npm install http-monitoring-tools --save # npm i -s http-monitoring-tools
```

## Usage

### getSslCertificateInfo
```
import http-monitoring-tools from "http-monitoring-tools";

(async function() {
  try {
    const response = await tools.getSslCertificateInfo('www.google.com')
    console.log(response)
  } catch(e) {
    console.log(e)
  }
})();

```
Returns:
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

#### Options
| Option | Default | |
|--|--|--|
| port | `443` | Target port |
| path | ` ` | Target path |
| method | `HEAD` | HTTP method |
| headers | `{ 'user-agent': '...' }` | HTTP request headers |

Override default options:
```
# Override port and method
tools.getSslCertificateInfo('www.google.com', { port: 8443, method: 'POST' })

# Override headers
tools.getSslCertificateInfo('www.google.com', { headers: { 'custom-header':'value'} })
```
