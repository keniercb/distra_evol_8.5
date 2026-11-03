Ext.define('Ext.ux.MoneyField',{
    extend: 'Ext.form.field.Number',//Extending the NumberField
    alias: 'widget.moneyfield',//Defining the xtype,
    currencySymbol: null,
    useThousandSeparator: true,
    decimalSeparator: ',',
    thousandSeparator: '.',
    alwaysDisplayDecimals: true,
    fieldStyle: 'text-align: right;',
    minValue: 0,
    decimalPrecision: 2,
    forcePrecision: true,
    allowDecimals: true,
    allowExponential: false,
    enableKeyEvents: true,
    // selectOnFocus: true, //auto seleccionarse el texto cuando seleccionas el campo
    useBothToDecimals: true,  // acepta poner tanto (,) como (.) como separador decimal, el campo automaticamente arregla al formato definido
    initComponent: function(){
        var me=this;
        if (this.useThousandSeparator && this.decimalSeparator == ',' && this.thousandSeparator == ',')
            this.thousandSeparator = '.';
        else
        if (this.allowDecimals && this.thousandSeparator == '.' && this.decimalSeparator == '.')
            this.decimalSeparator = ',';

        this.callParent(arguments);
        // cuando el valor sea 0 se autoselecciona todo el texto, en caso contrario no
        this.on('focus', function(yo){
            if(yo.getValue()==0)yo.selectText();
        })
        if(me.useBothToDecimals) {
            me.changeMaskRe();
            this.on('keyup', me.setUnformatedValue);
        }
    },
    setValue: function(value){
        Ext.ux.MoneyField.superclass.setValue.call(this, value != null ? value.toString().replace('.', this.decimalSeparator) : value);

        this.setRawValue(this.getFormattedValue(this.getValue()));
    },
    getFormattedValue: function(value){
        if (Ext.isEmpty(value) || !this.hasFormat())
            return value;
        else
        {
            var neg = null;

            value = (neg = value < 0) ? value * -1 : value;
            value = this.allowDecimals && this.alwaysDisplayDecimals ? value.toFixed(this.decimalPrecision) : value;

            if (this.useThousandSeparator)
            {
                if (this.useThousandSeparator && Ext.isEmpty(this.thousandSeparator))
                    throw ('NumberFormatException: invalid thousandSeparator, property must has a valid character.');

                if (this.thousandSeparator == this.decimalSeparator)
                    throw ('NumberFormatException: invalid thousandSeparator, thousand separator must be different from decimalSeparator.');

                value = value.toString();

                var ps = value.split('.');
                ps[1] = ps[1] ? ps[1] : null;

                var whole = ps[0];

                var r = /(\d+)(\d{3})/;

                var ts = this.thousandSeparator;

                while (r.test(whole))
                    whole = whole.replace(r, '$1' + ts + '$2');

                value = whole + (ps[1] ? this.decimalSeparator + ps[1] : '');
            }

            return Ext.String.format('{0}{1}{2}', (neg ? '-' : ''), (Ext.isEmpty(this.currencySymbol) ? '' : this.currencySymbol + ' '), value);
        }
    },
    /**
     * overrides parseValue to remove the format applied by this class
     */
    parseValue: function(value){
        //Replace the currency symbol and thousand separator
        return Ext.ux.MoneyField.superclass.parseValue.call(this, this.removeFormat(value));
    },
    /**
     * Remove only the format added by this class to let the superclass validate with it's rules.
     * @param {Object} value
     */
    removeFormat: function(value){
        if (Ext.isEmpty(value) || !this.hasFormat())
            return value;
        else
        {
            value = value.toString().replace(this.currencySymbol + ' ', '');

            value = this.useThousandSeparator ? value.replace(new RegExp('[' + this.thousandSeparator + ']', 'g'), '') : value;

            return value;
        }
    },
    /**
     * Remove the format before validating the the value.
     * @param {Number} value
     */
    // getErrors: function(value){
    //     // console.log('getErrors:', value, this.getRawValue(), '||',this.removeFormat(value), '||', this.removeFormat(value).replace(',','.'), Ext.isDefined(this.removeFormat(value)))
    //     return Ext.ux.MoneyField.superclass.getErrors.call(this, this.removeFormat(value));
    // },
    hasFormat: function(){
        return this.decimalSeparator != '.' || (this.useThousandSeparator == true && this.getRawValue() != null) || !Ext.isEmpty(this.currencySymbol) || this.alwaysDisplayDecimals;
    },
    /**
     * Display the numeric value with the fixed decimal precision and without the format using the setRawValue, don't need to do a setValue because we don't want a double
     * formatting and process of the value because beforeBlur perform a getRawValue and then a setValue.
     */
    onFocus: function(){
        this.setRawValue(this.removeFormat(this.getRawValue()));

        this.callParent(arguments);
    },
    getSubmitData: function(){
        return Ext.ux.MoneyField.superclass.getSubmitData.call(this);
    },
    getSubmitValue: function(){
        return this.getValue();
    },
    getErrors: function(value) {
        var me = this,
            // errors = me.callParent(arguments),
            errors = [],
            format = Ext.String.format,
            num;
        value=me.removeFormat(value);
        value = Ext.isDefined(value) ? value : this.processRawValue(this.getRawValue());
        if (value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
            return errors;
        }

        value = String(value).replace(me.decimalSeparator, '.');
        if(isNaN(value)){
            errors.push(format(me.nanText, value));
        }

        num = parseFloat(String(value).replace(this.decimalSeparator, '.'));
        // console.log('mf:', num < me.minValue, num, value)
        if (me.minValue === 0 && num < 0) {
            errors.push(this.negativeText);
        }
        else if (num < me.minValue) {
            errors.push(format(me.minText, me.minValue));
        }

        if (num > me.maxValue) {
            errors.push(format(me.maxText, me.maxValue));
        }

        // console.log('errors', errors)
        return errors;
    },
    changeMaskRe: function(){
        var me=this, allowed = this.baseChars;
        if (me.allowDecimals) {
            allowed += ',.';
        }
        if (me.minValue < 0) {
            allowed += '-';
        }
        allowed = Ext.String.escapeRegex(allowed);
        this.maskRe = new RegExp('[' + allowed + ']');
    },
    setUnformatedValue: function(yo){
        var me=this;
        Ext.ux.MoneyField.superclass.setRawValue.call(this, yo.getRawValue() != null ? String(yo.getRawValue()).replace(me.thousandSeparator, me.decimalSeparator) : yo.getRawValue());
    }
});