define([
	'lodash',
	'./internal/HellaObjectConstructor',
	'./internal/ClassImpl',
	'./HellaObject'
], function (_, HellaObjectConstructor, ClassImpl, HellaObject) {
	'use strict';

	/**
	 * @author Torin Francis
	 * @class hella.Class
	 * @extends hella.Object
	 *
	 * Handles class creation.
	 */
	return (new ClassImpl()).initialize('hella.Class', HellaObject, ClassImpl, ClassImpl.prototype, {

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
				var constructor;
				var prototype;

				if (typeof name !== 'string') {
					definition = superclass;
					superclass = name;
					name = 'AnonymousClass';
				}

				if (superclass instanceof ClassImpl) {
					constructor = superclass.__constructor__;
					prototype = constructor.createWithPrototype(superclass.__prototype__);
				}
				else {
					definition = superclass;
					superclass = HellaObject;
					constructor = HellaObjectConstructor;
					prototype = new HellaObjectConstructor();
				}

				return ClassImpl.prototype.create.call(this, name, superclass, constructor, prototype, definition);
			}

		}

	});


});