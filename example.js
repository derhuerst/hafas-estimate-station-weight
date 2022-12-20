import createVbbHafas from 'vbb-hafas'
import vbbWeights from 'vbb-mode-weights'

import {createEstimate} from './index.js'

const hafas = createVbbHafas('hafas-estimate-station-weight example')
const estimate = createEstimate(hafas, vbbWeights)

const friedrichstr = '900000100001'

const weight = await estimate(friedrichstr)
console.log('weight of S+U Friedrichstr. is', weight)
