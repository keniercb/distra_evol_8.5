Ext.apply(Ext, {
    /**
     * Returns true if the passed value is a JavaScript Object, otherwise false.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isObject: function (v)
    {
        return !!v && Object.prototype.toString.call(v) === '[object Object]';
    },

    /**
     * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isPrimitive: function (v)
    {
        return Ext.isString(v) || Ext.isNumber(v) || Ext.isBoolean(v);
    },

    /**
     * Returns true if the passed value is a JavaScript Function, otherwise false.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isFunction: function (v)
    {
        return toString.apply(v) === '[object Function]';
    },

    /**
     * Returns true if the passed value is a number. Returns false for non-finite numbers.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isNumber: function (v)
    {
        return typeof v === 'number' && isFinite(v);
    },

    /**
     * Returns true if the passed value is a string.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isString: function (v)
    {
        return typeof v === 'string';
    },

    /**
     * Returns true if the passed value is a boolean.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isBoolean: function (v)
    {
        return typeof v === 'boolean';
    },

    /**
     * Returns true if the passed value is an HTMLElement
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isElement: function (v)
    {
        return v ? !!v.tagName : false;
    },

    /**
     * Returns true if the passed value is not undefined.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isDefined: function (v)
    {
        return typeof v !== 'undefined';
    }
});

Ext.apply(Ext, function ()
{
    var c = Ext, a = 0, b = null;
    return {
        getScrollBarWidth: function (g)
        {
            if (!Ext.isReady) {
                return 0
            }
            if (g === true || b === null) {
                var i = Ext.getBody().createChild('<div class="x-hide-offsets" style="width:100px;height:50px;overflow:hidden;"><div style="height:200px;"></div></div>'), h = i.child("div", true);
                var e = h.offsetWidth;
                i.setStyle("overflow", (Ext.isWebKit || Ext.isGecko) ? "auto" : "scroll");
                var d = h.offsetWidth;
                i.remove();
                b = e - d + 2
            }
            return b;
        }
    };
}());

Ext.data.SortTypes = {
    /**
     * Default sort that does nothing
     * @param {Mixed} s The value being converted
     * @return {Mixed} The comparison value
     */
    none: function (s)
    {
        return s;
    },

    /**
     * The regular expression used to strip tags
     * @type {RegExp}
     * @property
     */
    stripTagsRE: /<\/?[^>]+>/gi,

    /**
     * Strips all HTML tags to sort on text only
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
    asText: function (s)
    {
        return String(s).replace(this.stripTagsRE, "");
    },

    /**
     * Strips all HTML tags to sort on text only - Case insensitive
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
    asUCText: function (s)
    {
        return String(s).toUpperCase().replace(this.stripTagsRE, "");
    },

    /**
     * Case insensitive string
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
    asUCString: function (s)
    {
        return String(s).toUpperCase();
    },

    /**
     * Date sorting
     * @param {Mixed} s The value being converted
     * @return {Number} The comparison value
     */
    asDate: function (s)
    {
        if (!s) {
            return 0;
        }
        if (Ext.isDate(s)) {
            return s.getTime();
        }
        return Date.parse(String(s));
    },

    /**
     * Float sorting
     * @param {Mixed} s The value being converted
     * @return {Float} The comparison value
     */
    asFloat: function (s)
    {
        var val = parseFloat(String(s).replace(/,/g, ""));
        return isNaN(val) ? 0 : val;
    },

    /**
     * Integer sorting
     * @param {Mixed} s The value being converted
     * @return {Number} The comparison value
     */
    asInt: function (s)
    {
        var val = parseInt(String(s).replace(/,/g, ""), 10);
        return isNaN(val) ? 0 : val;
    }
};
Ext.data.Types = new function ()
{
    var st = Ext.data.SortTypes;
    Ext.apply(this, {
        /**
         * @type Regexp
         * @property stripRe
         * A regular expression for stripping non-numeric characters from a numeric value. Defaults to <tt>/[\$,%]/g</tt>.
         * This should be overridden for localization.
         */
        stripRe: /[\$,%]/g,

        /**
         * @type Object.
         * @property AUTO
         * This data type means that no conversion is applied to the raw data before it is placed into a Record.
         */
        AUTO: {
            convert: function (v)
            {
                return v;
            },
            sortType: st.none,
            type: 'auto'
        },

        /**
         * @type Object.
         * @property STRING
         * This data type means that the raw data is converted into a String before it is placed into a Record.
         */
        STRING: {
            convert: function (v)
            {
                return (v === undefined || v === null) ? '' : String(v);
            },
            sortType: st.asUCString,
            type: 'string'
        },

        /**
         * @type Object.
         * @property INT
         * This data type means that the raw data is converted into an integer before it is placed into a Record.
         * <p>The synonym <code>INTEGER</code> is equivalent.</p>
         */
        INT: {
            convert: function (v)
            {
                return v !== undefined && v !== null && v !== '' ?
                    parseInt(String(v).replace(Ext.data.Types.stripRe, ''), 10) : 0;
            },
            sortType: st.none,
            type: 'int'
        },

        /**
         * @type Object.
         * @property FLOAT
         * This data type means that the raw data is converted into a number before it is placed into a Record.
         * <p>The synonym <code>NUMBER</code> is equivalent.</p>
         */
        FLOAT: {
            convert: function (v)
            {
                return v !== undefined && v !== null && v !== '' ?
                    parseFloat(String(v).replace(Ext.data.Types.stripRe, ''), 10) : 0;
            },
            sortType: st.none,
            type: 'float'
        },

        /**
         * @type Object.
         * @property BOOL
         * <p>This data type means that the raw data is converted into a boolean before it is placed into
         * a Record. The string "true" and the number 1 are converted to boolean <code>true</code>.</p>
         * <p>The synonym <code>BOOLEAN</code> is equivalent.</p>
         */
        BOOL: {
            convert: function (v)
            {
                return v === true || v === 'true' || v == 1;
            },
            sortType: st.none,
            type: 'bool'
        },

        /**
         * @type Object.
         * @property DATE
         * This data type means that the raw data is converted into a Date before it is placed into a Record.
         * The date format is specified in the constructor of the {@link Ext.data.Field} to which this type is
         * being applied.
         */
        DATE: {
            convert: function (v)
            {
                var df = this.dateFormat;
                if (!v) {
                    return null;
                }
                if (Ext.isDate(v)) {
                    return v;
                }
                if (df) {
                    if (df == 'timestamp') {
                        return new Date(v * 1000);
                    }
                    if (df == 'time') {
                        return new Date(parseInt(v, 10));
                    }
                    return Date.parseDate(v, df);
                }
                var parsed = Date.parse(v);
                return parsed ? new Date(parsed) : null;
            },
            sortType: st.asDate,
            type: 'date'
        }
    });

    Ext.apply(this, {
        /**
         * @type Object.
         * @property BOOLEAN
         * <p>This data type means that the raw data is converted into a boolean before it is placed into
         * a Record. The string "true" and the number 1 are converted to boolean <code>true</code>.</p>
         * <p>The synonym <code>BOOL</code> is equivalent.</p>
         */
        BOOLEAN: this.BOOL,
        /**
         * @type Object.
         * @property INTEGER
         * This data type means that the raw data is converted into an integer before it is placed into a Record.
         * <p>The synonym <code>INT</code> is equivalent.</p>
         */
        INTEGER: this.INT,
        /**
         * @type Object.
         * @property NUMBER
         * This data type means that the raw data is converted into a number before it is placed into a Record.
         * <p>The synonym <code>FLOAT</code> is equivalent.</p>
         */
        NUMBER: this.FLOAT
    });
};