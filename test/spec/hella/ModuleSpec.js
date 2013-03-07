define([
	'chai',
	'lodash',
	'hella/HellaObject',
	'hella/Class',
	'hella/Module',
	'spec/hella/shared/DefinableTypeSpec'
], function (chai, _, HellaObject, Class, Module, DefinableTypeSpec) {

	var expect = chai.expect;


	describe('Module', function () {
		DefinableTypeSpec(Module);
	});

});