define([
	'lodash'
], function (_) {
	'use strict';

	return _.extend(function HellaObject() {}, {

		prototype: {},


		create: function (parentPrototype) {
			var hellaPrototype = this.prototype;

			if (!(parentPrototype instanceof this)) {
				throw new TypeError('parentPrototype must be an instance of HellaObject');
			}

			try {
				this.prototype = parentPrototype;

				return new this();
			}
			finally {
				this.prototype = hellaPrototype;
			}
		}

	});

});