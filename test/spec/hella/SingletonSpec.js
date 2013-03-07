define([
	'chai',
	'hella/Class',
	'hella/HellaObject',
	'hella/Module',
	'hella/Singleton',
	'spec/hella/shared/DefinableTypeSpec'
], function (chai, Class, HellaObject, Module, Singleton, DefinableTypeSpec) {
	var expect = chai.expect;

	describe('Singleton', function () {
		var parent, module;

		DefinableTypeSpec(Singleton);

		beforeEach(function () {
			module = Module.create();
			parent = Class.create();
		});


		describe('with no ancestors', function () {
			var singleton;

			beforeEach(function () {
				singleton = Singleton.create({
					foo: function () { return 'foo'; }
				});
			});

			it('creates an object that inherits from Kernel', function () {
				expect(singleton.getTypes()).to.eql([HellaObject, singleton]);
			});

//		it('creates an object with the right methods', function () {
//			expect(singleton)
//			assertEqual('foo', singleton.foo())
//		});
		});


		describe('.create([args])', function () {
			var singleton;

			beforeEach(function () {
				singleton = Singleton.create({
					foo: function () { return 'foo'; }
				});
			});

			it('creates an object that inherits from Kernel', function () {
				expect(singleton.getTypes()).to.eql([HellaObject, singleton]);
			});
		});
//	describe('with a parent class', function () {
//		before(function () {
//			this.singleton = Singleton(parent)
//		})
//
//		it('creates an object that inherits from the parent', function () {
//			assertEqual([JS.Kernel, parent, singleton.klass, singleton.__eigen__()],
//				singleton.__eigen__().ancestors())
//		})
//	})
//
//	describe('with a mixin', function () {
//		before(function () {
//			this.singleton = Singleton({ include: mixin })
//		})
//
//		it('creates an object that inherits from the mixin', function () {
//			assertEqual([JS.Kernel, mixin, singleton.klass, singleton.__eigen__()],
//				singleton.__eigen__().ancestors())
//		})
//	})
	});
});