define([
	'lodash',
	'./HellaObjectConstructor',
	'./Creatable'
], function (_, HellaObjectConstructor, Creatable) {
	'use strict';

	function Class() { }

	_.extend(Class, Creatable);

	Class.prototype = new HellaObjectConstructor();

	return Class;

});