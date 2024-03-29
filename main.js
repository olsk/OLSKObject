(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
			(factory((global.OLSKObject = global.OLSKObject || {})));
}(this, (function(exports) { 'use strict';

	const mod = {

		OLSKObjectSafeCopy (inputData) {
			return Object.keys(inputData).reduce(function (coll, item) {
				if (item[0] !== '$') {
					coll[item] = inputData[item];
				}

				return coll
			}, {});
		},

		OLSKObjectTrim (inputData) {
			if (typeof inputData === 'string') {
				return inputData.trim();
			}

			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('OLSKErrorInputNotValid');
			}

			return Object.fromEntries(Object.entries(inputData).map(function (e) {
				return e.map(function (e) {
					if (Array.isArray(e)) {
						return e.map(mod.OLSKObjectTrim);
					}

					if (e instanceof Date) {
						return e
					}

					if (typeof e === 'object') {
						return mod.OLSKObjectTrim(e);
					}

					if (typeof e !== 'string') {
						return e;
					}
					
					return e.trim();
				});
			}));
		},

		_OLSKObjectInferredType (inputData) {
			if (typeof inputData !== 'string') {
				throw new Error('OLSKErrorInputNotValid');
			}

			return inputData.replace(/\w+ErrorNot/, '').toLowerCase();
		},

		OLSKObjectJSONSchema (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('OLSKErrorInputNotValid');
			}

			return {
				type: 'object',
				properties: Object.entries(inputData).reduce(function (coll, [key, val]) {
					coll[key] = {};

					coll[key].type = mod._OLSKObjectInferredType([...val].shift()).replace('filled', 'string');

					if (coll[key].type === 'date') {
						coll[key].type = 'string';
						coll[key].format = 'date-time';
					}

					return coll;
				}, {}),
				required: Object.entries(inputData).filter(function ([key, val]) {
					return !val.includes('__RSOptional');
				}).map(function ([key, val]) {
					return key;
				}),
			};
		},

		OLSKObjectRemap (param1, param2, param3 = false) {
			if (typeof param1 !== 'object' || param1 === null) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (typeof param2 !== 'object' || param2 === null) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (typeof param3 !== 'boolean') {
				throw new Error('OLSKErrorInputNotValid');
			}

			return Object.entries(param2).reduce(function (coll, item) {
				if (param3) {
					item = item.reverse();
				}
				
				return !param1[item[0]] ? coll : Object.assign(coll, {
					[item[1]]: param1[item[0]],
				});
			}, {});
		},

		OLSKObjectPostJSONParse (inputData) {
			if (!inputData) {
				return inputData;
			}

			if (Array.isArray(inputData)) {
				return inputData.map(mod.OLSKObjectPostJSONParse);
			}

			for (const key in inputData) {
				if (key.slice(-4) === 'Date') {
					inputData[key] = new Date(inputData[key]);
				} else if (Array.isArray(inputData[key])) {
					inputData[key].map(mod.OLSKObjectPostJSONParse);
				} else if (typeof inputData[key] === 'object') {
					mod.OLSKObjectPostJSONParse(inputData[key]);
				}
			}

			return inputData;
		},
		
	};

	Object.assign(exports, mod);

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

})));
