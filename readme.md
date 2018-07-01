# hafas-estimate-station-weight

Pass in a [`hafas-client`](https://github.com/public-transport/hafas-client#hafas-client)-compatible [HAFAS](https://de.wikipedia.org/wiki/HAFAS) API client and **estimate the importance/weight of a station**.

[![npm version](https://img.shields.io/npm/v/hafas-estimate-station-weight.svg)](https://www.npmjs.com/package/hafas-estimate-station-weight)
[![build status](https://api.travis-ci.org/derhuerst/hafas-estimate-station-weight.svg?branch=master)](https://travis-ci.org/derhuerst/hafas-estimate-station-weight)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/hafas-estimate-station-weight.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install hafas-estimate-station-weight
```


## Usage

```js
const createEstimate = require('hafas-estimate-station-weight')
const vbb = require('vbb-hafas') // can be any `hafas-client`-compatible client
const vbbWeights = require('vbb-mode-weights')

const estimate = createEstimate(vbb, vbbWeights)

const friedrichstr = '900000100001'
estimate(friedrichstr)
.then(weight => console.log('weight of S+U Friedrichstr. is', weight))
.catch(console.error)
```

```
weight of S+U Friedrichstr. is 1882.8
```


## Contributing

If you have a question or have difficulties using `hafas-estimate-station-weight`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/hafas-estimate-station-weight/issues).
