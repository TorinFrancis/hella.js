define([
	'lodash',
	'./Creatable'
], function (_, Creatable) {
	'use strict';

	function HellaObject() { }

	_.extend(HellaObject, Creatable);

	HellaObject.prototype = { };

	return HellaObject;

});