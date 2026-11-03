/**
 * Test if a value is a number
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Element} el
 * @returns {boolean}
 */
function isNumeric(el)
{
		return !isNaN(el);
}
/**
 * Test if a value is a text
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Element} el
 * @returns {boolean}
 */
function isString(el)
{
		return isNaN(el);
}
/**
 * Clear the array
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @returns {Void}
 */
Array.prototype.clear = function ()
{
		while (this.length > 0) {
				this.pop();
		}
};
/**
 * Count elements in array
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @returns {Number}
 */
Array.prototype.count = function ()
{
		return this.length
}
/**
 * Split in arrays of {size} elements
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Integer} size
 * @return {Array}
 */
Array.prototype.chunk = function (size)
{
		if (size > 1) {
				var result = new Array();
				var start = 0;
				while ((start + size) < this.length) {
						var end = start + size;
						result.push(this.slice(start, end));
						start += size;
				}
				if (start < this.length) {
						result.push(this.slice(start, this.length));
				}
				return result;
		} else {
				return this;
		}
}
/**
 * Create array with the elements of the array and extra array values
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Array} array1
 * @return {Array}
 */
Array.prototype.combine = function (array1)
{
		return this.concat(this, array1);
}
/**
 * Find value and return position if found
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Text, Numeric, Object} el
 * @return {Integer}  Position or null
 */
Array.prototype.search = function (el)
{
		for (var i = 0; i < this.length; i++) {
				if (this[i] == el) {
						return i;
				}
		}
		return null;
}
/**
 * Find value by {id} and return position if found
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Numeric} el
 * @return {Integer} Position or null
 */
Array.prototype.searchById = function (id)
{
		var array = this;
		for (var i = 0; i < array.length; i++) {
				if (array[i].id == id) {
						return i;
				}
		}
		return null;
};
Array.prototype.searchRecordById = function (id)
{
		var array = this;
		for (var i = 0; i < array.length; i++) {
				if (array[i].data.id == id) {
						return i;
				}
		}
		return null;
};
/**
 * Remove an element by {id}
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Integer}id
 * @return {Array}
 */
Array.prototype.removeById = function (id)
{
		var index = this.searchById(id);
		var array = this.remove(this[index]);
		return array;
};
Array.prototype.removeRecordById = function (id)
{
		var index = this.searchRecordById(id);
		var array = this.remove(this[index]);
		return array;
};
/**
 * Return Array with # of frecuency of values
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @return {Array}
 */
Array.prototype.count_values = function ()
{
		var arrayResult = new Array();
		for (var i = 0; i < this.length; i++) {
				var arrayTemporal = new Array();
				if (arrayTemporal.search(this[i]) == null) {
						arrayTemporal.push(this[i]);
						var cant = 0;
						for (var j = 0; j < this.length; j++) {
								if (this[j] == this[i]) {
										cant++;
								}
						}
						arrayTemporal.push(cant);
						arrayResult.push(arrayTemporal);
				}
		}
		return arrayResult;
}
/**
 * Return math with values than return true in function
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Function} filter
 * @return {Array}
 */
Array.prototype.filter = function (filter)
{
		var arrayResult = new Array();
		for (var i = 0; i < this.length; i++) {
				if (filter(this[i])) {
						arrayResult.push(this[i]);
				}
		}
		return arrayResult;
}
/**
 * Calculate product value in elements of array
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @return {number}
 */
Array.prototype.product = function ()
{
		var calc = this.length > 0 ? 1 : 0;
		for (var i = 0; i < this.length; i++) {
				calc *= this[i];
		}
		return calc;
}
/**
 * Calculate sum value in elements of array
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @return {number}
 */
Array.prototype.sum = function ()
{
		var calc = this.length > 0 ? 1 : 0;
		for (var i = 0; i < this.length; i++) {
				calc += this[i];
		}
		return calc;
}
/**
 * Build an array with {count} elements random
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Integer} count
 * @return {Array}
 */
Array.prototype.rand = function (count)
{
		var cant = 0;
		if (this.length >= count || !count) {
				return this;
		}
		var arrayPos = new Array();
		var arrayTemporal = new Array();
		while (cant > 0) {
				var pos = Math.round(Math.rand(this.length));
				while (arrayPos.search(pos) != null) {
						pos = Math.round(Math.rand(this.length));
				}
				arrayPos.push(pos);
				arrayTemporal.push(this[pos]);
				cant--;
		}
		return arrayTemporal;
}
/**
 * Remove duplicated values in array
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @return {Array}
 */
Array.prototype.unique = function ()
{
		var arrayTemporal = new Array();
		for (var i = 0; i < this.length; i++) {
				var pos = arrayTemporal.search(this[i]);
				if (pos == null) {
						arrayTemporal.push(this[i]);
				}
		}
		return arrayTemporal;
}
/**
 * Create array with number range
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Integer} start
 * @param {Integer} end
 * @return {Array}
 */
Array.prototype.range = function (start, end)
{
		return this.slice(start, end);
}
/**
 * Difference between the array and {array1}
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Array} array1
 * @returns {Array}
 */
Array.prototype.diff = function (array1)
{
		var arrayTemporal = new Array();
		for (var i = 0; i < this.length; i++) {
				if (array1.search(this[i] == null)) {
						arrayTemporal.push(this[i]);
				}
		}
		return arrayTemporal;
}
/**
 * Intersec between the array and {array1}
 * @author Ing.Osvaldo Manuel Gonzalez Ortiz
 * @param {Array} array1
 * @returns {Array}
 */
Array.prototype.intersec = function (array1)
{
		var arrayTemporal = new Array();
		for (var i = 0; i < this.length; i++) {
				if (array1.search(this[i] != null)) {
						arrayTemporal.push(this[i]);
				}
		}
		return arrayTemporal;
}
/**
 * @author Julio Cesar Cusco Alemañy
 * Simple plugin for using an Ext.Tip with a slider to show the slider value
 */
String.prototype.firstUp = function ()
{
		return this.charAt(0).toUpperCase() + this.slice(1);
};
/**
 * Función para determinar de forma precisa el tipo de dato de de un objeto
 * @param obj
 * @returns {*}
 */
var toType = function (obj)
{
		if (typeof obj === "undefined") {
				return "undefined";
				// consider: typeof null === object
		}
		if (obj === null) {
				return "null";
		}
		var type = Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1] || '';
		switch (type) {
				case 'Number':
						if (isNaN(obj)) {
								return "nan";
						} else {
								return "number";
						}
				case 'String':
				case 'Boolean':
				case 'Array':
				case 'Date':
				case 'RegExp':
				case 'Function':
						return type.toLowerCase();
		}
		if (typeof obj === "object") {
				return "object";
		}
		return undefined;
};
/**
 * Funcion para comparar arrays, obj, ....
 */
var equals = function ()
{
		var innerEquiv; // the real equiv function
		var callers = []; // stack to decide between skip/abort functions
		var parents = []; // stack to avoiding loops from circular referencing
		// Call the o related callback with the given arguments.
		function bindCallbacks(o, callbacks, args)
		{
				var prop = toType(o);
				if (prop) {
						if (toType(callbacks[prop]) === "function") {
								return callbacks[prop].apply(callbacks, args);
						} else {
								return callbacks[prop]; // or undefined
						}
				}
		}

		var callbacks = function ()
		{

				// for string, boolean, number and null
				function useStrictEquality(b, a)
				{
						if (b instanceof a.constructor || a instanceof b.constructor) {
								// to catch short annotaion VS 'new' annotation of a
								// declaration
								// e.g. var i = 1;
								// var j = new Number(1);
								return a == b;
						} else {
								return a === b;
						}
				}

				return {
						"string"   : useStrictEquality,
						"boolean"  : useStrictEquality,
						"number"   : useStrictEquality,
						"null"     : useStrictEquality,
						"undefined": useStrictEquality,
						"nan"      : function (b)
						{
								return isNaN(b);
						},
						"date"     : function (b, a)
						{
								return QUnit.toType(b) === "date" && a.valueOf() === b.valueOf();
						},
						"regexp"   : function (b, a)
						{
								return QUnit.toType(b) === "regexp" && a.source === b.source && // the regex itself
										a.global === b.global && // and its modifers
										// (gmi) ...
										a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
						},
						// - skip when the property is a method of an instance (OOP)
						// - abort otherwise,
						// initial === would have catch identical references anyway
						"function" : function ()
						{
								var caller = callers[callers.length - 1];
								return caller !== Object && typeof caller !== "undefined";
						},
						"array"    : function (b, a)
						{
								var i, j, loop;
								var len;
								// b could be an object literal here
								if (!(toType(b) === "array")) {
										return false;
								}
								len = a.length;
								if (len !== b.length) { // safe and faster
										return false;
								}
								// track reference to avoid circular references
								parents.push(a);
								for (i = 0; i < len; i++) {
										loop = false;
										for (j = 0; j < parents.length; j++) {
												if (parents[j] === a[i]) {
														loop = true; // dont rewalk array
												}
										}
										if (!loop && !innerEquiv(a[i], b[i])) {
												parents.pop();
												return false;
										}
								}
								parents.pop();
								return true;
						},
						"object"   : function (b, a)
						{
								var i, j, loop;
								var eq = true; // unless we can proove it
								var aProperties = [], bProperties = []; // collection of
								// strings
								// comparing constructors is more strict than using
								// instanceof
								if (a.constructor !== b.constructor) {
										return false;
								}
								// stack constructor before traversing properties
								callers.push(a.constructor);
								// track reference to avoid circular references
								parents.push(a);
								for (i in a) { // be strict: don't ensures hasOwnProperty
										// and go deep
										loop = false;
										for (j = 0; j < parents.length; j++) {
												if (parents[j] === a[i]) {
														loop = true;
												} // don't go down the same path
												// twice
										}
										aProperties.push(i); // collect a's properties
										if (!loop && !innerEquiv(a[i], b[i])) {
												eq = false;
												break;
										}
								}
								callers.pop(); // unstack, we are done
								parents.pop();
								for (i in b) {
										bProperties.push(i); // collect b's properties
								}
								// Ensures identical properties name
								return eq && innerEquiv(aProperties.sort(), bProperties.sort());
						}
				};
		}();
		innerEquiv = function ()
		{ // can take multiple arguments
				var args = Array.prototype.slice.apply(arguments);
				if (args.length < 2) {
						return true; // end transition
				}
				return (function (a, b)
				{
						if (a === b) {
								return true; // catch the most you can
						} else {
								if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || toType(a) !== toType(b)) {
										return false; // don't lose time with error prone cases
								} else {
										return bindCallbacks(a, callbacks, [b, a]);
								}
						}
						// apply transition with (1..n) arguments
				})(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length - 1));
		};
		return innerEquiv;
}();