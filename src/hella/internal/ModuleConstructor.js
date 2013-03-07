define([
	'lodash',
	'./HellaObjectConstructor',
	'./Creatable'
], function (_, HellaObjectConstructor, Creatable) {
	'use strict';

	function Module() { }

	_.extend(Module, Creatable);

	Module.prototype = new HellaObjectConstructor();

	return Module;

});