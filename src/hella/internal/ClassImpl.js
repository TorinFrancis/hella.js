define([
	'lodash',
	'./ClassConstructor',
	'./HellaObjectConstructor',
	'./DefinableType'
], function (_, ClassConstructor, HellaObjectConstructor, DefinableType) {
	'use strict';

	_.extend(ClassConstructor.prototype, DefinableType, {

		initialize: function (name, superclass, constructor, prototype, definition) {
			prototype.__class__ = this;

			if (superclass) {
				superclass.__children__.push(this);
			}

			this.__superclass__ = superclass;
			this.__children__ = [ ];
			this.__modules__ = [ ];
			this.__members__ = { };

			this.__constructor__ = constructor;
			this.__prototype__ = prototype;


			this.displayName = name;

			this.__define__(definition);
			this.__resolve__();

			return this;
		},


		/**
		 * Create a new instance of this Class.
		 * @return {*}
		 */
		create: function () {
			var instance = this.__constructor__.createWithPrototype(this.__prototype__);

			instance.initialize.apply(instance, arguments);

			return instance;
		},


		__resolve__: function () {
			this.__clearCaches__();

			if (this.__unresolvedMembers__) {
				_.forIn(this.__unresolvedMembers__, this.__resolveMember__, this);

				delete this.__unresolvedMembers__;
			}

			if (this.__unresolvedModules__) {
				_.each(this.__unresolvedModules__, this.__resolveModule__, this);

				delete this.__unresolvedModules__;
			}
		},


		__resolveMember__: function (value, key) {
			var prototype = this.__prototype__;

			if (typeof value === 'function' && value.toString().indexOf('__super__') !== -1) {
				value = compile(value, key, this);
			}

			if (prototype[key] !== value) {
				prototype[key] = value;
			}
		},


		__resolveModule__: function (module) {
			var members = this.__members__;

			_.forIn(module.__members__, function (member, key) {
				if (!_.has(members, key)) {
					this.__resolveMember__(member, key);
				}
			}, this);
		},


		__clearCaches__: function () {
			this.__typesCache__ = null;
			this.__membersByNameCache__ = null;

			_.each(this.__children__, function (child) {
				child.__clearCaches__();
			});
		}

	});


	function compile(method, name, methodOwner) {
		var compiledMethod = function () {
			var previousSuper = this.__super__;
			var returnValue;

			this.__super__ = makeSuper(methodOwner.findMembersNamed(name), this, _.toArray(arguments));

			returnValue = method.apply(this, arguments);

			if (previousSuper) {
				this.__super__ = previousSuper;
			}
			else {
				delete this.__super__;
			}

			return returnValue;
		};

		compiledMethod.displayName = method.displayName;

		return compiledMethod;
	}


	function makeSuper(methods, context, args) {
		var stackIndex = methods.length - 1;

		return function __super__() {
			var i = arguments.length;
			var returnValue;

			if (stackIndex > 0) {
				while (i--) {
					args[i] = arguments[i];
				}

				stackIndex--;

				returnValue = methods[stackIndex].apply(context, args);

				stackIndex++;
			}

			return returnValue;
		};
	}


	return ClassConstructor;

});