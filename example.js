'use strict'

const createHafas = require('vbb-hafas')
const vbbWeights = require('vbb-mode-weights')

const createEstimate = require('.')

const hafas = createHafas('my-awesome-program')
const estimate = createEstimate(hafas, vbbWeights)

const friedrichstr = '900000100001'

estimate(friedrichstr)
.then((weight) => {
	console.log('weight of S+U Friedrichstr. is', weight)
})
.catch((err) => {
	console.error(err)
	process.exit(1)
})
