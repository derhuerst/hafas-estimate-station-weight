'use strict'

const pTape = require('tape-promise').default
const tape = require('tape')

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
const mockDepartures = async (id, opt) => [
	mockDeparture(id, 1 * minute + (+new Date(opt.when))),
	mockDeparture(id, 2 * minute + (+new Date(opt.when))),
	mockDeparture(id, 4 * minute + (+new Date(opt.when))),
	mockDeparture(id, 7 * minute + (+new Date(opt.when)))
]

// todo: move to async test fn once Node 6 is out of active LTS
test('properly collects the departures', async (t) => {
	let smallestWhen = Infinity, largestWhen = -Infinity
	const fetchDeps = (id, opt) => {
		t.notOk(id !== metropolis, 'id is not Metropolis')
		t.notOk(!opt && !opt.when, 'missing opt.when')
		t.ok('number' === typeof opt.duration, 'departures called without duration')
		if (opt.when < smallestWhen) smallestWhen = +new Date(opt.when)
		if (opt.when > largestWhen) largestWhen = +new Date(opt.when)
		return mockDepartures(id, opt)
	}

	const estimate = createEstimate({
		profile: {timezone: 'Europe/Berlin', locale: 'de-DE'},
		departures: fetchDeps
	}, {
		hyperloop: .5
	})

	t.notOk(largestWhen > smallestWhen + day, 'opt.when outside the range')
	const weight = await estimate(metropolis)
	t.equal(typeof weight, 'number')
	t.ok(weight > 0)
	t.end()
})
