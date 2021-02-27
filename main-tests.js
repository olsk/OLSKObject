const { deepEqual } = require('assert');

const mod = require('./main.js').default;

describe('OLSKObjectSafeCopy', function test_OLSKObjectSafeCopy() {

	const item = {
		alfa: 'bravo',
		$charlie: 'delta',
	};
	
	it('returns object', function () {
		deepEqual(mod.OLSKObjectSafeCopy(item).alfa, 'bravo');
	});

	it('creates copy', function () {
		deepEqual(mod.OLSKObjectSafeCopy(item) !== item, true);
	});
	
	it('ignores $dynamic fields', function () {
		deepEqual(mod.OLSKObjectSafeCopy(item).$charlie, undefined);
	});

});
