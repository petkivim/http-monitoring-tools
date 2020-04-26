/**
 * The MIT License
 *
 * Copyright (c) 2020 Petteri Kivimäki
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import https from 'https'

// One day in milliseconds
const millisPerDay = 1000 * 60 * 60 * 24

/*
    Calculate difference between the dates, divide by milliseconds per day,
    and round downwards to nearest integer.
  */
function dateDiff(firstDate, secondDate) {
  return Math.floor((new Date(secondDate) - new Date(firstDate)) / (millisPerDay))
}

/*
   Calculate the number of days between the given date and current date. If
   the given date is in the past, the returned value is negative.
 */
function getValidDaysCount(validTo) {
  return dateDiff(new Date(), validTo)
}

/*
  Return the given date as ISO 8601 formatted string:
  YYYY-MM-DDTHH:mm:ss.sssZ
 */
function formatDate(date) {
  return new Date(date).toISOString()
}

/*
  Generate response object returned by the getSslCertificateInfo function.
 */
function generateSslCertificateInfoResponse(res, options) {
  const validDaysCount = getValidDaysCount(res.certificate.valid_to)
  return {
    host: options.hostname,
    commonName: res.certificate.subject.CN,
    issuerCommonName: res.certificate.issuer.CN,
    validFrom: formatDate(res.certificate.valid_from),
    validTo: formatDate(res.certificate.valid_to),
    now: formatDate(new Date()),
    validDaysLeftCount: validDaysCount,
    valid: validDaysCount >= 0,
    fingerprint: res.certificate.fingerprint,
  }
}

/*
  Generate options for getSslCertificateInfo function by merging user
  supplied options and default options.
*/
function getSslCertificateInfoOptions(hostname, options = {}) {
  const headers = { 'user-agent': '...' }
  return {
    hostname,
    port: options.port === undefined ? 443 : options.port,
    path: options.path === undefined ? '' : options.path,
    method: options.method === undefined ? 'HEAD' : options.method,
    // Self-signed certificates are supported
    rejectUnauthorized: false,
    // Connection timeout is 30s
    timeout: 30000,
    headers: options.headers === undefined ? headers : options.headers,
  }
}

export default {
  getSslCertificateInfo(hostname, userOptions) {
    return new Promise((resolve, reject) => {
      const options = getSslCertificateInfoOptions(hostname, userOptions)
      const req = https.request(options, (res) => {
        res.certificate = res.connection.getPeerCertificate()
        resolve(generateSslCertificateInfoResponse(res, options))
      }).on('timeout', () => {
        req.abort()
      }).on('error', (e) => {
        reject(e)
      })
      req.end()
    })
  },
}
