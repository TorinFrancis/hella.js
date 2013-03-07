define([
	'lodash',
	'./ClassConstructor',
	'./Creatable'
], function (_, ClassConstructor, Creatable) {
	'use strict';

	function Singleton() { }

	_.extend(Singleton, Creatable);

	Singleton.prototype = new ClassConstructor();

	return Singleton;

});