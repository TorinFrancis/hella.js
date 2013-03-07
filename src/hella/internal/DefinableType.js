define([
	'lodash',
	'./ModuleConstructor'
], function (_, ModuleConstructor) {
	'use strict';

	return {

		getTypes: function () {
			var types = this.__typesCache__;

			if (!types) {
				this.__typesCache__ = types = this.__getTypes__();
			}

			return types.slice();
		},


		hasType: function (classOrModule) {
			return classOrModule === this || _.contains(this.getTypes(), classOrModule);
		},


		getMethods: function () {
			var methods = { };

			_.each(this.getTypes(), function (type) {
				_.forIn(type.__members__, function (value, key) {
					if (key.charAt(0) !== '_' && _.isFunction(value)) {
						methods[key] = value;
					}
				});
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


		__getTypes__: function () {
			var modules = this.__modules__;
			var parent = this.__superclass__;
			var types = parent ? parent.getTypes() : [ ];

			for (var i = modules.length - 1; i >= 0; i--) {
				types.push(modules[i]);
			}

			types.push(this);

			return types;
		},


		__define__: function (definition) {
			var members = this.__members__;
			var unresolvedMembers = this.__unresolvedMembers__ || (this.__unresolvedMembers__ = { });

			_.forOwn(definition, function (value, key) {
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
						members[key] = unresolvedMembers[key] = value;

						if (_.isFunction(value)) {
							value.displayName = this.displayName + '.' + key + '()';
						}

						break;
				}
			}, this);
		},


		__include__: function (modules) {
			var selfModules = this.__modules__;
			var unresolvedModules = this.__unresolvedModules__ || (this.__unresolvedModules__ = [ ]);

			_.each([].concat(modules), function (module) {
				if (module instanceof ModuleConstructor && !_.contains(this.__getTypes__(), module)) {
					_.each(module.__modules__, this.__include__, this);

					selfModules.unshift(module);

					unresolvedModules.push(module);
				}
			}, this);
		}

	};

});