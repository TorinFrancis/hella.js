define([
	'lodash',
	'./internal/ClassImpl',
	'./internal/ModuleConstructor',
	'./internal/DefinableType',
	'./HellaObject',
	'./Class'
], function (_, ClassImpl, ModuleConstructor, DefinableType, HellaObject) {
	'use strict';

	_.extend(ModuleConstructor.prototype, DefinableType);


	return (new ClassImpl()).initialize('hella.Module', HellaObject, ModuleConstructor, ModuleConstructor.prototype, {

		initialize: function (name, definition) {
			this.__modules__ = [ ];
			this.__members__ = { };

			this.displayName = name;

			this.__define__(definition);
		},


		toString: function () {
			return 'module ' + this.displayName;
		},


		statics: {

			create: function (name, definition) {
				if (typeof name !== 'string') {
					definition = name;
					name = 'AnonymousModule';
				}

				return ClassImpl.prototype.create.call(this, name, definition);
			}

		}

	});

});