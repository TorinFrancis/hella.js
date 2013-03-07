define([
	'chai',
	'lodash',
	'hella/HellaObject',
	'hella/Class',
	'hella/Module'
], function (chai, _, HellaObject, Class, Module) {

	function ensureSuperTypes(types) {
		var topLevelType = _.last(types);

		if (topLevelType.getSuperclass) {
			types = topLevelType.getSuperclass().getTypes().concat(types);
		}

		return types;
	}


	return function (Type) {
		var expect = chai.expect;

		it('is an instance of Class', function () {
			expect(Type.instanceOf(Class)).to.be.true;
		});


		it('is an instance of HellaObject', function () {
			expect(Type.instanceOf(HellaObject)).to.be.true;
		});


		describe('.getTypes()', function () {

			describe('with no explicit ancestors', function () {
				beforeEach(function () {
					this.MyType = Type.create('MyType');
				});

				it('returns an array containing any super Types and the Type itself', function () {
					expect(this.MyType.getTypes()).to.eql(ensureSuperTypes([this.MyType]));
				});
			});


			describe('with an included module', function () {
				beforeEach(function () {
					this.ModuleA = Module.create('ModuleA');

					this.MyType = Type.create('MyType', {
						includes: this.ModuleA
					});
				});

				it('returns an array containing any super Types, the included Module, and the Type itself', function () {
					expect(this.MyType.getTypes()).to.eql(ensureSuperTypes([this.ModuleA, this.MyType]));
				});
			});


			describe('with two included Modules', function () {
				beforeEach(function () {
					this.ModuleA = Module.create('ModuleA');
					this.ModuleB = Module.create('ModuleB');

					this.MyType = Type.create('MyType', {
						includes: [this.ModuleA, this.ModuleB]
					});
				});

				it('sorts the modules by inclusion order', function () {
					expect(this.MyType.getTypes()).to.eql(ensureSuperTypes([this.ModuleA, this.ModuleB, this.MyType]));
				});
			});


			describe('with a tree of included modules', function () {
				beforeEach(function () {
					this.ModuleA = Module.create('ModuleA');
					this.ModuleB = Module.create('ModuleB', {
						includes: this.ModuleA
					});

					this.MyType = Type.create('MyType', {
						includes: this.ModuleB
					});
				});


				it('returns the flattened tree', function () {
					expect(this.MyType.getTypes()).to.eql(ensureSuperTypes([this.ModuleA, this.ModuleB, this.MyType]));
				});


				describe('with a repeated reference in the tree', function () {
					beforeEach(function () {
						this.ModuleC = Module.create('ModuleC', {
							includes: this.ModuleA
						});

						this.MyType = Type.create('MyType', {
							includes: [this.ModuleB, this.ModuleC]
						});
					});

					it('places the repeated module at its earliest possible position', function () {
						expect(this.MyType.getTypes()).to.eql(ensureSuperTypes([this.ModuleA, this.ModuleB, this.ModuleC, this.MyType]));
					});
				});
			});
		});


		describe('.displayName', function () {
			beforeEach(function () {
				this.MyType = Type.create('MyType', {
					methodOne: function () {},
					methodTwo: function () {}
				});
			});


			describe('when called on a Type', function () {

				it('returns the name of the Type', function () {
					expect(this.MyType.displayName).to.equal('MyType');
				});

			});


			describe('when called on a Type method', function () {

				it('returns the name of the Type along with the method name', function () {
					expect(this.MyType.getDeclaredMethods().methodOne.displayName).to.equal('MyType.methodOne()');
					expect(this.MyType.getDeclaredMethods().methodTwo.displayName).to.equal('MyType.methodTwo()');
				});

			});

		});


		describe('.getMethods()', function () {
			beforeEach(function () {
				this.MyModule = Module.create('MyModule', {
					field: 'foo',
					_privateField: 'woop',
					method: function () {},
					_privateMethod: function () {}
				});
			});


			describe('with no members', function () {
				beforeEach(function () {
					this.MyType = Type.create('MyType', {
						includes: this.MyModule
					});
				});

				it('returns a list of inherited public members', function () {
					var expectedMethods = { };

					_.forIn(_.initial(this.MyType.getTypes()), function (type) {
						_.extend(expectedMethods, type.getMethods());
					});

					expect(this.MyType.getMethods()).to.eql(expectedMethods);
				});
			});


			describe('with some members', function () {
				var myPublicMethod;

				beforeEach(function () {
					myPublicMethod = function () {}

					this.MyType = Type.create('MyType', {
						includes: this.MyModule,
						myField: 'foo',
						_myPrivateField: 'woop',
						myMethod: myPublicMethod,
						_myPrivateMethod: function () {}
					});
				});

				it('returns the inherited public methods and the Type\'s own public methods', function () {
					var expectedMethods = { };

					_.forIn(_.initial(this.MyType.getTypes()), function (type) {
						_.extend(expectedMethods, type.getMethods());
					});

					expectedMethods.myMethod = myPublicMethod;

					expect(this.MyType.getMethods()).to.eql(expectedMethods);
				});
			});
		});


		describe('.getDeclaredMethods()', function () {
			beforeEach(function () {
				this.MyModule = Module.create('MyModule', {
					field: 'foo',
					_privateField: 'woop',
					method: function () {},
					_privateMethod: function () {}
				});
			});


			describe('with no members', function () {
				beforeEach(function () {
					this.MyType = Type.create('MyType', {
						includes: this.MyModule
					});
				});

				it('returns an empty list', function () {
					expect(this.MyType.getDeclaredMethods()).to.be.empty;
				});
			});


			describe('with some members', function () {
				var myPublicMethod;
				var myPrivateMethod;

				beforeEach(function () {
					myPublicMethod = function () {};
					myPrivateMethod = function () {};


					this.MyType = Type.create('MyType', {
						includes: this.MyModule,
						myField: 'foo',
						_myPrivateField: 'woop',
						myMethod: myPublicMethod,
						_myPrivateMethod: myPrivateMethod
					});
				});


				it('returns only the Type\'s own methods', function () {
					expect(this.MyType.getDeclaredMethods()).to.eql({ myMethod: myPublicMethod, _myPrivateMethod: myPrivateMethod });
				});
			});
		});
	};

});