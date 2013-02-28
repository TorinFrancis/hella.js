define([
	'lodash',
	'./HellaObjectImpl',
	'./DefinableType'
], function (_, HellaObjectImpl, DefinableType) {
	'use strict';

	function HellaModule(name, definition) {
		this.__modules__ = [ ];
		this.__members__ = { };

		this.displayName = name;

		this.__define__(definition);
		this.__resolve__();
	}


	HellaModule.prototype = _.extend(HellaObjectImpl.create(DefinableType), {

		__resolve__: function () {
			delete this.__unresolvedMembers__;
			delete this.__unresolvedModules__;
		}

	});


	_.extend(DefinableType, {

		__include__: function (modules) {
			this.__unresolvedModules__ || (this.__unresolvedModules__ = [ ]);

			_.each([].concat(modules), this.__includeIterator__, this);
		},


		__includeIterator__: function (module) {
			if (module instanceof HellaModule && !this.hasType(module)) {
				_.each(module.__modules__, this.__include__, this);

				this.__modules__.unshift(module);

				this.__unresolvedModules__.push(module);
			}
		}

	});


	return HellaModule;

});