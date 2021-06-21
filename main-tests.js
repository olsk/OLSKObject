const { deepEqual, throws } = require('assert');

const mod = require('./main.js');

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

describe('OLSKObjectTrim', function test_OLSKObjectTrim() {
	
	it('throws if not object', function () {
		throws(function () {
			mod.OLSKObjectTrim(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns inputData', function () {
		const item = {};
		deepEqual(mod.OLSKObjectTrim(item), item);
	});

	it('ignores if not string', function () {
		const item = function () {};
		deepEqual(mod.OLSKObjectTrim({
			item,
		}), {
			item,
		});
	});

	it('trims if string', function () {
		const item = Math.random().toString();
		deepEqual(mod.OLSKObjectTrim({
			item: ' ' + item + ' ',
		}), {
			item,
		});
	});

	it('calls recursively', function () {
		const item = Math.random().toString();
		deepEqual(mod.OLSKObjectTrim({
			[item]: {
				item: ' ' + item + ' ',
			},
		}), {
			[item]: {
				item,
			},
		});
	});

	it('calls on arrays', function () {
		const item = Math.random().toString();
		deepEqual(mod.OLSKObjectTrim({
			[item]: [{
				item: ' ' + item + ' ',
			}],
		}), {
			[item]: [{
				item,
			}],
		});
	});

	it('trims array strings', function () {
		const item = Math.random().toString();
		deepEqual(mod.OLSKObjectTrim({
			[item]: [' ' + item + ' '],
		}), {
			[item]: [item],
		});
	});

});

describe('_OLSKObjectInferredType', function test_OLSKObjectInferredType() {

	it('throws error if not string', function() {
		throws(function() {
			mod._OLSKObjectInferredType(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('converts if string', function() {
		deepEqual(mod._OLSKObjectInferredType('XYZErrorNotString'), 'string');
	});

	it('converts if boolean', function() {
		deepEqual(mod._OLSKObjectInferredType('XYZErrorNotBoolean'), 'boolean');
	});

	it('converts if date', function() {
		deepEqual(mod._OLSKObjectInferredType('XYZErrorNotDate'), 'date');
	});

	it('converts variable prefix', function() {
		deepEqual(mod._OLSKObjectInferredType('ABCErrorNotDate'), 'date');
	});

});

describe('OLSKObjectJSONSchema', function OLSKObjectJSONSchema() {

	it('throws error if not object', function() {
		throws(function() {
			mod.OLSKObjectJSONSchema(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(mod.OLSKObjectJSONSchema({}), {
			type: 'object',
			properties: {},
			required: [],
		});
	});

	context('properties', function() {
		
		it('declares string', function() {
			deepEqual(mod.OLSKObjectJSONSchema({
				alfa: ['XYZErrorNotString']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
					},
				},
				required: [
					'alfa',
				],
			});
		});
		
		it('declares boolean', function() {
			deepEqual(mod.OLSKObjectJSONSchema({
				alfa: ['XYZErrorNotBoolean']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'boolean',
					},
				},
				required: [
					'alfa',
				],
			});
		});
		
		it('declares date', function() {
			deepEqual(mod.OLSKObjectJSONSchema({
				alfa: ['XYZErrorNotDate']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
						format: 'date-time',
					},
				},
				required: [
					'alfa',
				],
			});
		});
		
		it('declares filled', function() {
			deepEqual(mod.OLSKObjectJSONSchema({
				alfa: ['XYZErrorNotFilled']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
					},
				},
				required: [
					'alfa',
				],
			});
		});
		
	});

	context('required', function() {
		
		it('declares if required', function() {
			deepEqual(mod.OLSKObjectJSONSchema({
				alfa: ['XYZErrorNotString']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
					},
				},
				required: [
					'alfa',
				],
			});
		});

		it('ignores', function() {
			deepEqual(mod.OLSKObjectJSONSchema({
				alfa: ['XYZErrorNotString', '__RSOptional']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
					},
				},
				required: [],
			});
		});
		
	});

});

describe('OLSKObjectRemap', function test_OLSKObjectRemap() {
	
	it('throws if param1 not object', function () {
		throws(function () {
			mod.OLSKObjectRemap(null, {});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mod.OLSKObjectRemap({}, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function () {
		deepEqual(mod.OLSKObjectRemap({}, {}), {});
	});

	it('throws if param3 not boolean', function () {
		throws(function () {
			mod.OLSKObjectRemap({}, {}, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('excludes if not in param2', function () {
		deepEqual(mod.OLSKObjectRemap({
			[Math.random().toString()]: Math.random().toString()
		}, {}), {});
	});

	it('remaps if in param2', function () {
		const item = Math.random().toString();
		const source = Math.random().toString();
		const destination = Math.random().toString();
		deepEqual(mod.OLSKObjectRemap({
			[source]: item,
		}, {
			[source]: destination,
		}), {
			[destination]: item,
		});
	});

	it('remaps backward if param3 and in param2', function () {
		const item = Math.random().toString();
		const source = Math.random().toString();
		const destination = Math.random().toString();
		deepEqual(mod.OLSKObjectRemap({
			[destination]: item,
		}, {
			[source]: destination,
		}, true), {
			[source]: item,
		});
	});

});

describe('OLSKObjectPostJSONParse', function test_OLSKObjectPostJSONParse() {

	it('returns input null', function() {
		deepEqual(mod.OLSKObjectPostJSONParse(null), null);
	});

	it('returns input object', function() {
		deepEqual(mod.OLSKObjectPostJSONParse({}), {});
	});

	it('returns input with *Date as date', function() {
		deepEqual(mod.OLSKObjectPostJSONParse({
			alfaDate: '2018-12-09T19:07:01.902Z',
		}), {
			alfaDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with Array *Date as date', function() {
		deepEqual(mod.OLSKObjectPostJSONParse({
			alfa: [
				{
					bravoDate: '2018-12-09T19:07:01.902Z',
				}
			],
		}), {
			alfa: [
				{
					bravoDate: new Date('2018-12-09T19:07:01.902Z'),
				}
			],
		});
	});

	it('returns input with object *Date as date', function() {
		deepEqual(mod.OLSKObjectPostJSONParse({
			alfa: {
				bravoDate: '2018-12-09T19:07:01.902Z',
			},
		}), {
			alfa: {
				bravoDate: new Date('2018-12-09T19:07:01.902Z'),
			},
		});
	});

	it('returns input array with objects parsed', function() {
		deepEqual(mod.OLSKObjectPostJSONParse([{
			alfaDate: '2018-12-09T19:07:01.902Z',
		}]), [{
			alfaDate: new Date('2018-12-09T19:07:01.902Z'),
		}]);
	});

});
