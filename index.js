'use strict'

const createCollectDeps = require('hafas-collect-departures-at')
const {DateTime} = require('luxon')
const maxBy = require('lodash.maxby')
const co = require('co')
const round = require('lodash.round')

// Because this estimation only takes a single day into account, it is inaccurate.
// todo: improve it, e.g. using different days of the week or number of lines
const createEstimate = (client, weights) => {
	// todo: validate args
	const collectDeps = createCollectDeps(client.departures)

	const estimate = co.wrap(function* (id, maxIterations = Infinity) {
		const startOfWeek = DateTime.fromMillis(Date.now(), {
			zone: client.profile.timezone,
			locale: client.profile.locale
		}).startOf('week')
		// next Monday 4 am
		const start = startOfWeek.plus({weeks: 1, hours: 4}).valueOf()
		// next Tuesday 4 am
		const end = startOfWeek.plus({weeks: 1, days: 1, hours: 4}).valueOf()

		let weight = 0
		const onDep = (dep) => {
			if (new Date(dep.when) > end || !dep.line || !dep.line.product) return
			const p = dep.line.product
			if ('number' === typeof weights[p]) weight += weights[p]
		}

		const depsAt = collectDeps(id, start)
		// Some HAFAS API do not support querying departures for more than
		// ~1 day at once. Therefore, we split the time period into sections.
		// todo: put this into hafas-client, see public-transport/hafas-client#14
		const iterator = depsAt[Symbol.asyncIterator]()
		let iterations = 0
		while (true) {
			iterations++
			const deps = (yield iterator.next(1200)).value
			for (let dep of deps) onDep(dep)

			const lastDep = maxBy(deps, dep => +new Date(dep.when))
			if (lastDep && new Date(lastDep.when) >= end) break
			if (iterations > maxIterations) break
		}

		if (weight > 0) {
			const decimals = Math.floor(5 - Math.log10(weight))
			return round(weight, decimals)
		}
		return weight
	})
	return estimate
}

module.exports = createEstimate
