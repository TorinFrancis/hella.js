define([
	'lodash',
	'./internal/ClassImpl',
	'./internal/ModuleImpl',
	'./HellaObject',
	'./Class'
], function (_, ClassImpl, ModuleImpl, HellaObject) {
	'use strict';

	return new ClassImpl('hella.Module', HellaObject, ModuleImpl.prototype, {

		toString: function () {
			return 'module ' + this.displayName;
		},


		statics: {

			create: function (name, definition) {
				if (typeof name !== 'string') {
					definition = name;
					name = 'AnonymousModule';
				}

				return new ModuleImpl(name, definition);
			}

		}

	});

});