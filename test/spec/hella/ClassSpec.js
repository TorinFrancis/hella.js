define([
	'chai',
	'lodash',
	'hella/HellaObject',
	'hella/Class',
	'hella/Module'
], function (chai, _, HellaObject, Class, Module) {

	var expect = chai.expect;


	describe('Class', function () {

		it('is a Class', function () {
			expect(Class.instanceOf(Class)).to.be.true;
		});


		it('is it\'s own Class', function () {
			expect(Class.getClass()).to.equal(Class);
		});


		it('has HellaObject as its parent Class', function () {
			expect(Class.getClass().getSuperclass()).to.equal(HellaObject);
		});


		describe('.initialize([name], [superclass], [definition])', function () {
			var MyClass, MyChildClass;

			beforeEach(function () {
				MyClass = Class.create('MyClass', {
					hello: function () {
						return 'hello world!';
					}
				});

				MyChildClass = Class.create(MyClass, {
					goodbye: function () {
						return 'goodbye world!';
					}
				});
			});


			it('sets the Class\' displayName to {name} or "AnonymousClass"', function () {
				expect(MyClass.displayName).to.equal('MyClass');
				expect(Class.create().displayName).to.equal('AnonymousClass');
			});


			it('sets the Class\' superclass to {superclass} or HellaObject', function () {
				expect(MyChildClass.getSuperclass()).to.equal(MyClass);
				expect(MyClass.getSuperclass()).to.equal(HellaObject);
			});


			it('sets the Class\' prototype to an empty object with prototype [[super_prototype]]', function () {
				expect(MyChildClass.create().hello()).to.equal('hello world!');
			});

		});


		describe('.create([args...])', function () {
			var MyClass, myInstance;

			beforeEach(function () {
				MyClass = Class.create();
				myInstance = MyClass.create();
			});


			it('returns a new instance of the Class', function () {
				expect(myInstance.instanceOf(MyClass)).to.be.true;
				expect(MyClass.instanceOf(Class)).to.be.true;
			});


			it('returns a HellaObject', function () {
				expect(myInstance.instanceOf(HellaObject)).to.be.true;
				expect(MyClass.instanceOf(HellaObject)).to.be.true;
			});


			describe('when the Class includes an initialize method', function () {
				var Animal, kermit;

				beforeEach(function () {
					Animal = Class.create({
						initialize: function (name, type) {
							this.name = name;
							this.type = type;
						}
					});

					kermit = Animal.create('kermit', 'frog');
				});


				it('calls the initialize method with any given arguments on the created instance', function () {
					expect(kermit.name).to.equal('kermit');
					expect(kermit.type).to.equal('frog');
				});
			});
		});


		describe('.getTypes()', function () {
			var MyClass, MyChildClass, MyModule, MyOtherModule, MyIncludingModule, MyOtherIncludingModule;

			beforeEach(function () {
				MyClass = Class.create('MyClass');
				MyChildClass = Class.create('MyChildClass', MyClass);
				MyModule = Module.create('MyModule');
				MyOtherModule = Module.create('MyOtherModule');
				MyIncludingModule = Module.create('MyIncludingModule', { includes: MyModule });
				MyOtherIncludingModule = Module.create('MyOtherIncludingModule', { includes: MyModule });
			});


			describe('with no superclass or modules', function () {
				it('returns the HellaObject Class and the Class it was called on', function () {
					expect(MyClass.getTypes()).to.eql([HellaObject, MyClass]);
				});
			});


			describe('with a superclass', function () {
				it('returns the HellaObject Class, the superclass, and the Class it was called on', function () {
					expect(MyChildClass.getTypes()).to.eql([HellaObject, MyClass, MyChildClass]);
				});
			});


			describe('with an included module', function () {
				beforeEach(function () {
					MyClass.include(MyModule);
				});

				it('returns the HellaObject Class, the included Module, and the Class it was called on', function () {
					expect(MyClass.getTypes()).to.eql([HellaObject, MyModule, MyClass]);
					expect(MyChildClass.getTypes()).to.eql([HellaObject, MyModule, MyClass, MyChildClass]);
				});
			});


			describe('with two included Modules', function () {
				beforeEach(function () {
					MyClass.include([MyModule, MyOtherModule]);
				});

				it('sorts the modules by inclusion order', function () {
					expect(MyClass.getTypes()).to.eql([HellaObject, MyModule, MyOtherModule, MyClass]);
					expect(MyChildClass.getTypes()).to.eql([HellaObject, MyModule, MyOtherModule, MyClass, MyChildClass]);
				});
			});


			describe('with a tree of included modules', function () {
				beforeEach(function () {
					MyClass.include(MyIncludingModule);
				});


				it('returns the flattened tree', function () {
					expect(MyClass.getTypes()).to.eql([HellaObject, MyModule, MyIncludingModule, MyClass]);
					expect(MyChildClass.getTypes()).to.eql([HellaObject, MyModule, MyIncludingModule, MyClass, MyChildClass]);
				});


				describe('with a repeated reference in the tree', function () {
					beforeEach(function () {
						MyClass.include(MyOtherIncludingModule);
					});

					it('places the repeated module at its earliest possible position', function () {
						expect(MyClass.getTypes()).to.eql([HellaObject, MyModule, MyIncludingModule, MyOtherIncludingModule, MyClass]);
						expect(MyChildClass.getTypes()).to.eql([HellaObject, MyModule, MyIncludingModule, MyOtherIncludingModule, MyClass, MyChildClass]);
					});
				});
			});
		});


		describe('.getSuperclass()', function () {
			var MyClass, MyChildClass;

			beforeEach(function () {
				MyClass = Class.create('MyClass', {
					hello: function () {
						return 'hello world!';
					}
				});

				MyChildClass = Class.create(MyClass, {
					goodbye: function () {
						return 'goodbye world!';
					}
				});
			});

			it('returns the superclass for the Class it was called on', function () {
				expect(MyChildClass.getSuperclass()).to.equal(MyClass);
				expect(MyClass.getSuperclass()).to.equal(HellaObject);
			});
		});


		describe('.displayName', function () {
			var MyClass;

			beforeEach(function () {
				MyClass = Class.create('MyClass', {
					methodOne: function () {},
					methodTwo: function () {}
				});
			});


			describe('when called on a Class', function () {

				it('returns the name of the class', function () {
					expect(MyClass.displayName).to.equal('MyClass');
				});

			});


			describe('when called on a Class method', function () {

				it('returns the name of each method', function () {
					expect(MyClass.create().methodOne.displayName).to.equal('MyClass.methodOne()');
					expect(MyClass.create().methodTwo.displayName).to.equal('MyClass.methodTwo()');
				});

			});

		});


		describe('.define(definition)', function () {
			var Parent, Child, Grandkid, MyModule, parent, child, grandkid, definition;

			beforeEach(function () {
				Parent = Class.create('Parent');
				Child = Class.create('Child', Parent);
				Grandkid = Class.create('Grandkid', Child);

				parent = Parent.create();
				child = Child.create();
				grandkid = Grandkid.create();

				MyModule = Module.create({ foo: function () { return 'foo' } });
				definition = { definedMethod: function () { return 'defined method' } }
			});


			it('adds the objects\'s members directly to the Class', function () {
				expect(Parent.getDeclaredMethods()).to.be.empty;
				expect(Parent.getMethods()).to.not.have.property('definedMethod');

				Parent.define(definition);

				expect(Parent.getDeclaredMethods()).to.eql(definition);
				expect(Parent.getMethods()).to.have.property('definedMethod');
			});


			it('adds the objects\'s members indirectly to children of the Class', function () {
				expect(Child.getDeclaredMethods()).to.be.empty;
				expect(Child.getMethods()).to.not.have.property('definedMethod');

				Parent.define(definition);

				expect(Child.getDeclaredMethods()).to.be.empty;
				expect(Child.getMethods()).to.have.property('definedMethod');
			});


			it('adds the member to instances of the Class and its children', function () {
				expect(parent.definedMethod).to.be.undefined;
				expect(child.definedMethod).to.be.undefined;
				expect(grandkid.definedMethod).to.be.undefined;

				Parent.define(definition);

				expect(parent.definedMethod()).to.equal('defined method');
				expect(child.definedMethod()).to.equal('defined method');
				expect(grandkid.definedMethod()).to.equal('defined method');
			});
		});


		describe('.include(modules)', function () {
			var Parent, Child, Grandkid, MyModule, parent, child, grandkid;

			beforeEach(function () {
				Parent = Class.create('Parent');
				Child = Class.create('Child', Parent);
				Grandkid = Class.create('Grandkid', Child);

				parent = Parent.create();
				child = Child.create();
				grandkid = Grandkid.create();

				MyModule = Module.create({ foo: function () { return 'foo' } });
			})

			describe('taking a module', function () {
				it('makes the Module a type of the receiver', function () {
					expect(Parent.getTypes()).to.eql([HellaObject, Parent]);

					Parent.include(MyModule);

					expect(Parent.getTypes()).to.eql([HellaObject, MyModule, Parent]);
				});


				it('makes the Module a type of downstream classes', function () {
					expect(Child.getTypes()).to.eql([HellaObject, Parent, Child]);
					expect(Grandkid.getTypes()).to.eql([HellaObject, Parent, Child, Grandkid]);

					Parent.include(MyModule);

					expect(Child.getTypes()).to.eql([HellaObject, MyModule, Parent, Child]);
					expect(Grandkid.getTypes()).to.eql([HellaObject, MyModule, Parent, Child, Grandkid]);
				});


				it('adds the Module\'s members indirectly to the Class', function () {
					expect(Parent.getMethods()).to.eql(HellaObject.getMethods());

					Parent.include(MyModule);

					expect(Parent.getDeclaredMethods()).to.be.empty;
					expect(Parent.getMethods()).to.have.keys(_.keys(HellaObject.getMethods()).concat('foo'));
				});


				it('adds the Module\'s members indirectly to children of the Class', function () {
					Parent.include(MyModule);

					expect(Child.getDeclaredMethods()).to.be.empty;
					expect(Grandkid.getDeclaredMethods()).to.be.empty;

					expect(Child.getMethods()).to.eql(Parent.getMethods());
					expect(Grandkid.getMethods()).to.eql(Parent.getMethods());
				});


				it('adds the Module\'s members to instances of the Class and its children', function () {
					expect(parent.foo).to.be.undefined;
					expect(child.foo).to.be.undefined;
					expect(grandkid.foo).to.be.undefined;

					Parent.include(MyModule);

					expect(parent.foo()).to.equal('foo');
					expect(child.foo()).to.equal('foo');
					expect(grandkid.foo()).to.equal('foo');
				});


				describe('when the Module defines members also defined in a subclass', function () {
					beforeEach(function () {
						Child.define({
							foo: function () { return 'child foo' }
						});
					});


					it('adds the mixin method to the receiver but not the subclass', function () {
						Parent.include(MyModule);

						expect(parent.foo()).to.equal('foo');
						expect(child.foo()).to.equal('child foo');
						expect(grandkid.foo()).to.equal('child foo');
					});
				});
			});
		});
		describe('.getMethods()', function () {
			var Parent, Child;

			beforeEach(function () {
				Parent = Class.create('Parent', {
					field: 'foo',
					_privateField: 'woop',
					method: function () {},
					_privateMethod: function () {}
				});
				Child = Class.create('Child', Parent);
			});


			describe('with no members', function () {
				it('returns a list of inherited public members', function () {
					expect(Child.getMethods()).to.eql(Parent.getMethods());
				});
			});

			describe('with some members', function () {
				var publicMethods;

				beforeEach(function () {
					publicMethods = {
						childMethod: function () {}
					};

					Child.define(_.extend({
						childField: 'foo',
						_privateChildField: 'woop',
						_privateChildMethod: function () {}
					}, publicMethods));
				});

				it('returns the inherited public methods and the Class\'s own public methods', function () {
					expect(Child.getMethods()).to.eql(_.extend(Parent.getMethods(), publicMethods));
				});
			});
		});


		describe('.getDeclaredMethods()', function () {
			var Parent, Child;

			beforeEach(function () {
				Parent = Class.create('Parent', {
					field: 'foo',
					_privateField: 'woop',
					method: function () {},
					_privateMethod: function () {}
				});

				Child = Class.create('Child', Parent);
			});


			describe('with no members', function () {
				it('returns an empty list', function () {
					expect(Child.getDeclaredMethods()).to.be.empty;
				});
			});


			describe('with some members', function () {
				var methods;

				beforeEach(function () {
					methods = {
						childMethod: function () {},
						_privateChildMethod: function () {}
					};

					Child.define(_.extend({
						childField: 'foo',
						_privateChildField: 'woop'
					}, methods));
				});


				it('returns only the Class\'s own methods', function () {
					expect(Child.getDeclaredMethods()).to.eql(methods);
				});
			});
		});

		describe('Method Precedence', function () {
			var MyClass, MyModule, myInstance;

			beforeEach(function () {
				MyClass = Class.create({ aMethod: function () { return 'Class' } });
				MyModule = Module.create({ someCall: function () { return 'Module' } });

				myInstance = MyClass.create();
			});


			describe('a member defined in a Class', function () {
				it('takes precedence over included modules', function () {
					MyClass.include(Module.create({ aMethod: function () { return 'Module' } }));

					expect(myInstance.aMethod()).to.equal('Class');
				});
			});


			describe('a member defined in a Module', function () {
				it('gets through if the including Class does not define it', function () {
					MyClass.include(MyModule);

					expect(myInstance.someCall()).to.equal('Module');
				});


				it('takes precedence over previously included Modules', function () {
					MyClass.include(Module.create({ someCall: function () { return 'previous' } }));
					MyClass.include(MyModule);

					expect(myInstance.someCall()).to.equal('Module');
				});


				it('is overriden by later mixins', function () {
					MyClass.include(MyModule);
					MyClass.include(Module.create({ someCall: function () { return 'late' } }));

					expect(myInstance.someCall()).to.equal('late');
				});


				it('is overridden by methods inherited by later Modules', function () {
					var Parent = Module.create({ someCall: function () { return 'parent' } })
					var Child = Module.create({ includes: Parent });

					MyClass.include(MyModule);
					MyClass.include(Child);

					expect(myInstance.someCall()).to.equal('parent');
				});
			});
		});
	});

});