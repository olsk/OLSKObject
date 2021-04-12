const mod = {

	OLSKObjectSafeCopy (inputData) {
		return Object.keys(inputData).reduce(function (coll, item) {
			if (item[0] !== '$') {
				coll[item] = inputData[item];
			}

			return coll
		}, {});
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
	
};

export default mod;
