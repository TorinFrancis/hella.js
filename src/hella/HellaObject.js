define([
	'lodash',
	'./internal/HellaObjectImpl',
	'./internal/ClassImpl'
], function (_, HellaObjectImpl, ClassImpl) {
	'use strict';

	var __nextID__ = 0;
	
	/**
	 * @author Torin Francis
	 * @class hella.Object
	 *
	 * The root of all classes created with {@link hella.Class#create}. Defines methods shared by all objects.
	 */
	return new ClassImpl('hella.Object', null, HellaObjectImpl.prototype, {

		getBoundMethod: function (name) {
			var method = this[name];
			var boundMethodCache;
			var boundMethod;

			if (_.isFunction(name)) {
				return method;
			}


			boundMethodCache = this.__boundMethodCache__ || (this.__boundMethodCache__ = { });
			boundMethod = boundMethodCache[name];

			if (boundMethod && boundMethod.__original__ === method) {
				return boundMethod;
			}


			boundMethod = method.bind(this);
			boundMethod.__original__ = method;

			boundMethodCache[name] = boundMethod;

			return boundMethod;
		},


		/**
		 * @method getClass
		 *
		 * Get the reference to the current class from which this object was instantiated.
		 *
		 * @return {hella.Class}
		 */
		getClass: function () {
			return this.__class__;
		},


		/**
		 * @method equals
		 *
		 * Indicates whether some other object is "equal to" this one.
		 *
		 * The `equal` method implements an equivalence relation on non-null object references:
		 *
		 * - It is *reflexive*: for any non-null reference value `x`, `x.equals(x)` should return true.
		 * - It is *symmetric*: for any non-null reference values `x` and `y`, `x.equals(y)` should return `true` if and
		 *   only if `y.equals(x)` returns `true`.
		 * - It is *transitive*: for any non-null reference values `x`, `y`, and `z`, if `x.equals(y)` returns `true`
		 *   and `y.equals(z)` returns `true`, then `x.equals(z)` should return `true`.
		 * - It is *consistent*: for any non-null reference values `x` and `y`, multiple invocations of `x.equals(y)`
		 *   consistently return `true` or consistently return `false`, provided no information used in `equals`
		 *   comparisons on the objects is modified.
		 * - For any non-null reference value `x`, `x.equals(null)` should return `false`.
		 *
		 *
		 * The `equals` method for class `HellaObject` implements the most discriminating possible equivalence relation
		 * on objects; that is, for any non-null reference values `x` and `y`, this method returns `true` if and only if
		 * `x` and `y` refer to the same object (`x === y` has the value true).
		 *
		 * Note that it is generally necessary to override the {@link #hash} method whenever this method is overridden,
		 * so as to maintain the general contract for the {@link #hash} method, which states that equal objects must
		 * have equal hash codes.
		 *
		 * @param {Object} obj the reference object with which to compare.
		 * @return {Boolean} true if this object is the same as the obj argument; false otherwise.
		 */
		equals: function (obj) {
			return this === obj;
		},


		/**
		 * @method hash
		 *
		 * Returns a hash code value for the object. This method is supported for the benefit of hash tables such as
		 * those provided by `HashMap`.
		 *
		 * The general contract of `hash` is:
		 *
		 * * Whenever it is invoked on the same object more than once during an execution of a Java application, the
		 *   `hashCode` method must consistently return the same integer, provided no information used in `equals`
		 *   comparisons on the object is modified. This integer need not remain consistent from one execution of an
		 *   application to another execution of the same application.
		 * * If two objects are equal according to the `equals(Object)` method, then calling the `hashCode` method on
		 *   each of the two objects must produce the same integer result.
		 * * It is *not* required that if two objects are unequal according to the {@link #equals} method, then calling
		 *   the `hashCode` method on each of the two objects must produce distinct integer results.  However, the
		 *   programmer should be aware that producing distinct integer results for unequal objects may improve the
		 *   performance of hash tables.
		 *
		 *
		 * As much as is reasonably practical, the hashCode method defined by class `HellaObject` does return distinct
		 * integers for distinct objects.
		 *
		 * @return {Number} a hash code value for this object.
		 */
		hash: function () {
			if (this.__hash__ === undefined) {
				this.__hash__ = __nextID__;

				__nextID__++;
			}

			return this.__hash__;
		},


		instanceOf: function (classOrModule) {
			return this.getClass().hasType(classOrModule);
		},


		/**
		 * @method toString
		 *
		 * Returns a string representation of the object. In general, the `toString` method returns a string that
		 * "textually represents" this object. The result should be a concise but informative representation that is
		 * easy for a person to read.
		 *
		 * It is recommended that all subclasses override this method.
		 *
		 * The `toString` method for class `Object` returns a string consisting of the name of the class of which the
		 * object is an instance, the at-sign character "`@`", and the unsigned hexadecimal representation of the hash
		 * code of the object. In other words, this method returns a string equal to the value of:
		 *
		 *     this.getClass().displayName + '@' + this.hash().toString(16)
		 *
		 * @return {String} a string representation of the object.
		 */
		toString: function () {
			return this.getClass().displayName + '@' + this.hash().toString(16);
		},


		statics: {

			create: function () {
				return new HellaObjectImpl();
			}

		}

	});

});