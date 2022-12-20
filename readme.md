# hafas-estimate-station-weight

Pass in a [`hafas-client@6`](https://github.com/public-transport/hafas-client/tree/6)-compatible [HAFAS](https://de.wikipedia.org/wiki/HAFAS) API client and **estimate the importance/weight of a station**.

[![npm version](https://img.shields.io/npm/v/hafas-estimate-station-weight.svg)](https://www.npmjs.com/package/hafas-estimate-station-weight)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/hafas-estimate-station-weight.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installing

```shell
npm install hafas-estimate-station-weight
```


## Usage

```js
import {createEstimate} from 'hafas-estimate-station-weight'
import {createVbbHafas} from 'vbb-hafas' // can be any `hafas-client`-compatible client
import vbbWeights from 'vbb-mode-weights'

const hafas = createVbbHafas('my-awesome-program')
const estimate = createEstimate(hafas, vbbWeights)

const friedrichstr = '900100001'

const weight = await estimate(friedrichstr)
console.log('weight of S+U Friedrichstr. is', weight)
// weight of S+U Friedrichstr. is 1809.8
```

Estimating the weight of a station will take ~20s, because several requests will be made.


## Contributing

If you have a question or have difficulties using `hafas-estimate-station-weight`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/hafas-estimate-station-weight/issues).
