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