define([
	'chai',
	'hella/HellaObject',
	'hella/Class',
	'hella/Module'
], function(chai, HellaObject, Class, Module) {

	var expect = chai.expect;


	describe('HellaObject', function() {

		it('is a Class', function() {
			expect(HellaObject.instanceOf(Class)).to.be.true;
		});

		it('has no parent Class', function() {
			expect(HellaObject.getSuperclass()).to.be.null;
		});


		describe('.getClass()', function() {
			var MyClass, object;

			beforeEach(function() {
				MyClass = Class.create();
				object = MyClass.create();
			});

			it('returns the class that the object was created from', function() {
				expect(object.getClass()).to.equal(MyClass);
			});
		});


		describe('.equals(other)', function() {
			var object, otherObject;

			beforeEach(function() {
				object = HellaObject.create();
				otherObject = HellaObject.create();
			});

			it('returns true if both references are to the same object', function() {
				expect(object.equals(object)).to.be.true;
			});

			it('returns false if the references are to different objects', function() {
				expect(object.equals(otherObject)).to.be.false;
			});

			it('is symmetric', function() {
				expect(object.equals(otherObject)).to.equal(otherObject.equals(object));
			});
		});


		describe('.hash()', function() {
			var object, otherObject;

			beforeEach(function() {
				object = HellaObject.create();
				otherObject = HellaObject.create();
			});

			it('returns a number', function() {
				expect(object.hash()).to.be.a('number')
			});

			it('returns a different value for each object', function() {
				expect(object.hash).to.not.equal(otherObject.hash())
			});

			it('returns the same value every time for the same object', function() {
				expect(object.hash()).to.equal(object.hash())
			});
		});


		describe('.toString()', function() {
			var object;

			beforeEach(function() {
				object = HellaObject.create();
			});

			it('returns a string containing the object\'s type and its hash', function() {
				expect(object.toString()).to.equal(object.getClass().displayName + '@' + object.hash().toString(16));
			});
		});


		describe('.instanceOf(classOrModule)', function() {
			var ModuleA, ModuleB, ModuleC, Parent, Child, Other, childObject;

			beforeEach(function() {
				ModuleA = Module.create('ModuleA');
				ModuleB = Module.create('ModuleB', {
					includes: ModuleA
				});
				ModuleC = Module.create('ModuleC');

				Parent = Class.create('Parent', {
					includes: ModuleB
				});
				Child = Class.create('Child', Parent);
				Other = Class.create('Other');

				childObject = Child.create();
			});

			it('returns true iff the object is an instance of the class', function() {
				expect(childObject.instanceOf(Child)).to.be.true;
			});

			it('returns true iff the object inherits from the class', function() {
				expect(childObject.instanceOf(Parent)).to.be.true;
				expect(childObject.instanceOf(HellaObject)).to.be.true;
			});

			it('returns false iff the object is not an instance of the class', function() {
				expect(childObject.instanceOf(Other)).to.be.false;
			});

			it('returns true iff the object inherits from the module', function() {
				expect(childObject.instanceOf(ModuleA)).to.be.true;
				expect(childObject.instanceOf(ModuleB)).to.be.true;
			});

			it('returns false iff the object does not inherit from the module', function() {
				expect(childObject.instanceOf(ModuleC)).to.be.false;
			});

			it('returns true iff the module is mixed into the object\'s class', function() {
				Child.include(ModuleC);

				expect(childObject.instanceOf(ModuleC)).to.be.true;
			});
		});


		describe('.getBoundMethod(name)', function() {
			var PersonModule, Person, person;

			beforeEach(function() {
				PersonModule = Module.create({
					mixinMethod: function() {}
				});

				Person = Class.create({
					initialize: function(name) {
						this._name = name;
					},
					getName: function() {
						return this._name;
					},
					otherMethod: function() {
						return 'woop';
					}
				});

				person = Person.create('Torin');
			});

			it('returns a function', function() {
				expect(person.getBoundMethod('getName')).to.be.a('function');
			});

			it('returns the same function every time', function() {
				expect(person.getBoundMethod('getName')).to.equal(person.getBoundMethod('getName'));
			});

			it('returns a function not equal to the unbound method', function() {
				expect(person.getBoundMethod('getName')).to.not.equal(person.getName);
			});

			it('returns a bound method', function() {
				var method = person.getName;
				var boundMethod = person.getBoundMethod('getName');

				expect(method()).to.not.equal('Torin');
				expect(boundMethod()).to.equal('Torin');
			});

			it('returns a different function for each method', function() {
				expect(person.getBoundMethod('getName')).to.not.equal(person.getBoundMethod('otherMethod'));
			});


			describe('when the implementation changes in the object', function() {
				var getName;

				beforeEach(function() {
					getName = person.getBoundMethod('getName');
					person.getName = function() {
						return 'NOT TORIN!'
					}
				});

				it('still uses the old implementation for existing bound methods', function() {
					expect(getName()).to.equal('Torin');
				});

				it('returns a new function using the new implementation', function() {
					var newGetName = person.getBoundMethod('getName');

					expect(getName).to.not.equal(newGetName);
					expect(newGetName()).to.equal('NOT TORIN!');
				});
			});


			describe('when the implementation changes in the class', function() {
				var getName;

				beforeEach(function() {
					getName = person.getBoundMethod('getName');

					Person.define({
						getName: function() {
							return 'NOT TORIN!';
						}
					});
				});

				it('still uses the old implementation for existing bound methods', function() {
					expect(getName()).to.equal('Torin');
				});

				it('returns a new function using the new implementation', function() {
					var overridenGetName = person.getBoundMethod('getName');

					expect(getName).to.not.equal(overridenGetName);
					expect(overridenGetName()).to.equal('NOT TORIN!');
				});
			});
		});


		describe('.__super__([args...])', function() {
			var Parent;

			beforeEach(function() {
				Parent = Class.create({
					method: function(thing, stuff) {
						return thing + ', ' + stuff;
					}
				});
			});

			describe('calling a method with a context', function() {
				var Child, obj;

				beforeEach(function() {
					Child = Class.create(Parent, {
						method: function() {
							return this.name + ': ' + this.__super__();
						}
					});

					obj = {
						name: 'user'
					};
				});

				it('uses the inheritance chain of the applied method', function() {
					expect(Child.create().method.call(obj, 'foo', 'bar')).to.equal('user: foo, bar');
				});
			});

			describe('when calling with implicit args', function() {
				var Child;

				beforeEach(function() {
					Child = Class.create(Parent, {
						method: function() {
							return this.__super__();
						}
					});
				})

				it('passes args through to the parent method', function() {
					var object = Child.create();

					expect(object.method('foo', 'bar')).to.equal('foo, bar');
				})
			})

			describe('calling the superclass with one explicit arg', function() {
				var Child;

				beforeEach(function() {
					Child = Class.create(Parent, {
						method: function(a) {
							return this.__super__(a.toUpperCase());
						}
					});
				});

				it('passes the remaining implicit args after the explicit one', function() {
					var object = Child.create();

					expect(object.method('foo', 'bar')).to.equal('FOO, bar');
				});
			})

			describe('calling the superclass with explicit args', function() {
				var Child;

				beforeEach(function() {
					Child = Class.create(Parent, {
						method: function(a, b) {
							return this.__super__(a.toUpperCase(), b.toUpperCase());
						}
					});
				});

				it('passes args through to the parent method', function() {
					var object = Child.create();

					expect(object.method('foo', 'bar')).to.equal('FOO, BAR');
				});
			});


			describe('calling methods from Modules', function() {
				var ModuleA, ModuleB, ClassC, ModuleD, ClassE, myInstance;

				beforeEach(function() {
					ModuleA = Module.create('ModuleA', {
						method: function() {
							return 'A'
						}
					});

					ModuleB = Module.create('ModuleB', {
						includes: ModuleA,
						method: function() {
							return this.__super__() + ', B'
						}
					})

					ClassC = Class.create('ClassC', {
						includes: ModuleB,
						method: function() {
							return this.__super__() + ', C'
						}
					})

					ModuleD = Module.create('ModuleD', {
						includes: ModuleA,
						method: function() {
							return this.__super__() + ', D'
						}
					})

					ClassE = Class.create('ClassE', ClassC, {
						includes: [ModuleB, ModuleD],
						method: function() {
							return this.__super__() + ', E'
						}
					})

					myInstance = ClassE.create();
				});

				it('uses the object\'s ancestry to route each super() call', function() {
					expect(myInstance.method()).to.equal('A, B, C, D, E');
				});

				// http://blog.jcoglan.com/2007/11/14/wheres-my-inheritance/
				describe('when a method in the superclass is defined', function() {
					beforeEach(function() {
						ClassC.define({
							method: function() {
								return 'override'
							}
						})
					})

					it('uses the new method when calling super()', function() {
						expect(myInstance.method()).to.equal('override, D, E');
					})
				})

				describe('when a method calls super() twice', function() {
					beforeEach(function() {
						ClassC.define({
							method: function() {
								return this.__super__() + ', ' + this.__super__() + ', C'
							}
						})
					})

					it('calls the correct series of methods', function() {
						expect(myInstance.method()).to.equal('A, B, A, B, C, D, E');
					})
				})
			})

			// http://www.ajaxpath.com/javascript-inheritance
			describe('methods referenced by super methods', function() {
				var BaseClass, SubClass, TopClass;

				beforeEach(function() {
					BaseClass = Class.create('BaseClass', {
						getName: function() {
							return 'BaseClass(' + this.getId() + ')'
						},
						getId: function() {
							return 1
						}
					})

					SubClass = Class.create('SubClass', BaseClass, {
						getName: function() {
							return 'SubClass(' + this.getId() + ') extends ' + this.__super__()
						},
						getId: function() {
							return 2
						}
					})

					TopClass = Class.create('TopClass', SubClass, {
						getName: function() {
							return 'TopClass(' + this.getId() + ') extends ' + this.__super__()
						},
						getId: function() {
							return this.__super__();
						}
					})
				})

				it('refer to the implementation in the receiver object', function() {
					var top = TopClass.create();

					expect(top.getName()).to.equal('TopClass(2) extends SubClass(2) extends BaseClass(2)');
				})
			})
		})

	});

});