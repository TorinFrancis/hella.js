define([
	'./internal/ClassImpl',
	'./internal/SingletonConstructor',
	'./Class'
], function (ClassImpl, SingletonConstructor, Class) {
	'use strict';

	return (new ClassImpl()).initialize('hella.Singleton', Class, SingletonConstructor, SingletonConstructor.prototype, {

		create: function () {
			var instance = this.__instance__;

			if (!instance) {
				instance = this.__instance__ = this.__super__();
			}

			return instance;
		},


		toString: function () {
			return 'singleton ' + this.displayName;
		},


		statics: {

			create: Class.create

		}

	});

});