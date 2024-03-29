import {createCollectDeps} from 'hafas-collect-departures-at'
import {DateTime} from 'luxon'
import maxBy from 'lodash/maxBy.js'
import round from 'lodash/round.js'
import findDepsDurLimit from 'hafas-find-departures-duration-limit'

// Because this estimation only takes a single day into account, it is inaccurate.
// todo: improve it, e.g. using different days of the week or number of lines
const createEstimateStationWeight = (client, weights) => {
	// todo: validate args
	const collectDeps = createCollectDeps(client.departures)

	const estimate = async (id, maxIterations = Infinity) => {
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

		// Some HAFAS API do not support querying departures for more than
		// ~1 day at once. Therefore, we split the time period into sections.
		// todo: put this into hafas-client, see public-transport/hafas-client#14
		const dur = await findDepsDurLimit(client, id)
		const depsAt = collectDeps(id, start)
		const iterator = depsAt[Symbol.asyncIterator]()
		let iterations = 0
		// eslint-disable-next-line no-constant-condition
		while (true) {
			iterations++
			const deps = (await iterator.next(dur)).value
			for (let dep of deps) onDep(dep)

			const lastDep = maxBy(deps, dep => Date.parse(dep.when))
			if (lastDep && Date.parse(lastDep.when) >= end) break
			if (iterations > maxIterations) break
		}

		if (weight > 0) {
			const decimals = Math.floor(5 - Math.log10(weight))
			return round(weight, decimals)
		}
		return weight
	}
	return estimate
}

export {
	createEstimateStationWeight as createEstimate,
}
