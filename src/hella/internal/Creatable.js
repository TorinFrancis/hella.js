define({

	createWithPrototype: function (prototype) {
		var originalPrototype = this.prototype;

		if (prototype === originalPrototype) {
			return new this();
		}

		if (!(prototype instanceof this)) {
			throw new TypeError('"prototype" must be an instance of "this"');
		}

		try {
			this.prototype = prototype;

			return new this();
		}
		finally {
			this.prototype = originalPrototype;
		}
	}

});