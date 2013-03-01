define([
	'lodash',
	'./HellaObjectImpl'
], function (_, HellaObjectImpl) {
	'use strict';

	return _.extend(new HellaObjectImpl(), {

		getTypes: function () {
			var types = this.__typesCache__;
			var modules;
			var parent;

			if (!types) {
				if (parent = this.__superclass__) {
					types = parent.getTypes();
				}
				else {
					types = [];
				}

				modules = this.__modules__;

				for (var i = modules.length - 1; i >= 0; i--) {
					types.push(modules[i]);
				}

				types.push(this);

				this.__typesCache__ = types;
			}

			return types.slice();
		},


		hasType: function (classOrModule) {
			return classOrModule === this || _.indexOf(this.getTypes(), classOrModule) !== -1;
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


		findMembersNamed: function (name) {
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


		__define__: function (definition) {
			this.__unresolvedMembers__ || (this.__unresolvedMembers__ = { });

			_.forOwn(definition, this.__defineIterator__, this);
		},


		__defineIterator__: function (value, key) {
			switch (key) {
				case 'includes':
					this.__include__(value);

					break;
				case 'statics':
					_.forOwn(value, function (staticValue, staticKey) {
						this[staticKey] = staticValue;
					}, this);

					break;
				default:
					this.__members__[key] = this.__unresolvedMembers__[key] = value;

					if (typeof value === 'function') {
						value.displayName = this.displayName + '.' + key + '()';
					}

					break;
			}
		}

	});

});