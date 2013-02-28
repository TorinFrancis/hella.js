define([
	'lodash',
	'./internal/HellaObjectImpl',
	'./internal/ClassImpl',
	'./HellaObject'
], function (_, HellaObjectImpl, ClassImpl, HellaObject) {
	'use strict';

	/**
	 * @author Torin Francis
	 * @class hella.Class
	 *
	 * Handles class creation.
	 */
	return new ClassImpl('hella.Class', HellaObject, ClassImpl.prototype, {

		create: function () {
			var instance = HellaObjectImpl.create(this.__prototype__);

			instance.initialize && instance.initialize.apply(instance, arguments);

			return instance;
		},


		getSuperclass: function () {
			return this.__superclass__;
		},


		getMethods: function () {
			var methods = { };

			_.forIn(this.__prototype__, function (value, key) {
				if (key.charAt(0) !== '_' && _.isFunction(value)) {
					methods[key] = value;
				}
			});

			return methods;
		},


		getDeclaredMethods: function () {
			var methods = { };

			_.forOwn(this.__members__, function (value, key) {
				if (_.isFunction(value)) {
					methods[key] = value;
				}
			});

			return methods;
		},


		lookup: function (name) {
			var membersByNameCache = this.__membersByNameCache__ || (this.__membersByNameCache__ = { });
			var members = membersByNameCache[name];

			if (!members) {
				members = [];

				_.each(this.getTypes(), function (type) {
					var typeMembers = type.__members__;

					if (_.has(typeMembers, name)) {
						members.push(typeMembers[name]);
					}
				});

				membersByNameCache[name] = members;
			}

			return members.slice();
		},


		define: function (obj) {
			this.__define__(obj);
			this.__resolve__();
		},


		include: function (modules) {
			this.__include__(modules);
			this.__resolve__();
		},


		toString: function () {
			return 'class ' + this.displayName;
		},


		statics: {

			create: function (name, superclass, definition) {
				var prototype;

				if (typeof name !== 'string') {
					definition = superclass;
					superclass = name;
					name = 'AnonymousClass';
				}

				if (superclass instanceof ClassImpl) {
					prototype = HellaObjectImpl.create(superclass.__prototype__);
				}
				else {
					definition = superclass;
					superclass = HellaObject;
					prototype = new HellaObjectImpl();
				}

				return new ClassImpl(name, superclass, prototype, definition);
			}

		}

	});


});