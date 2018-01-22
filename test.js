'use strict'

const pTape = require('tape-promise').default
const tape = require('tape')
const sinon = require('sinon')
const co = require('co')

const createEstimate = require('.')

const test = pTape(tape)

const minute = 60 * 1000
const day = 24 * 60 * minute

const metropolis = '12345789'

const mockDeparture = (id, t) => ({
	station: {type: 'station', id, name: 'foo'},
	when: new Date(t).toISOString(),
	line: {
		type: 'line',
		id: 'foo',
		name: 'Foo',
		public: true,
		mode: 'train',
		product: 'hyperloop'
	}
})
const mockDepartures = (id, opt) => Promise.resolve([
	mockDeparture(id, 1 * minute + opt.when),
	mockDeparture(id, 2 * minute + opt.when),
	mockDeparture(id, 4 * minute + opt.when),
	mockDeparture(id, 7 * minute + opt.when)
])

// todo: move to async test fn once Node 6 is out of active LTS
test('properly collects the departures', co.wrap(function* (t) {
	let smallestWhen = Infinity, largestWhen = -Infinity
	const fetchDeps = (id, opt) => {
		if (id !== metropolis) throw new Error('id is not Metropolis')
		if (!opt && !opt.when) throw new Error('missing opt.when')
		if (opt.when < smallestWhen) smallestWhen = +opt.when
		if (opt.when > largestWhen) largestWhen = +opt.when
		return mockDepartures(id, opt)
	}

	const estimate = createEstimate({
		profile: {timezone: 'Europe/Berlin', locale: 'de-DE'},
		departures: fetchDeps
	}, {
		hyperloop: .5
	})

	t.notOk(largestWhen > smallestWhen + day, 'opt.when outside the range')
	const weight = yield estimate(metropolis)
	t.equal(typeof weight, 'number')
	t.ok(weight > 0)
	t.end()
}))
