/**
 * Created by alberto on 31/07/2015.
 */
Ext.define('Proformas.view.ClausulasGrid', {
    extend: 'Ext.form.field.Base',
    alias: 'widget.clausulasgrid',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.toolbar.Paging',
        'Ext.ux.ajax.JsonSimlet',
        'Ext.ux.ajax.SimManager',
        'Ext.ux.grid.FiltersFeature',
        'Ext.ux.SearchField',
        'Proformas.view.CustomGrid'
    ],
    errors: new Array(),

    preventMark: false,

    fieldSubTpl: ['<div id="{id}" class="{fieldCls}"></div>', {}],

    initComponent: function () {
        this.createBody();

        this.callParent(arguments);
    },
    onRender: function (ct, position) {
        var _this = this;
        _this.callParent(arguments);
        _this.bodyContainer.render(_this.inputEl);
    },
    afterComponentLayout: function (width) {
        this.callParent();
        this.bodyContainer.initialConfig.width = width;
        this.bodyContainer.setWidth(width);
        this.grid.setWidth(width);
    },
    createBody: function () {
        var _this = this;

        this.grid = Ext.create('Proformas.view.CustomGrid');

        this.bodyContainer = Ext.create('Ext.container.Container', {
            height: _this.height || 300,
            layout: 'fit',
            items: this.grid
        });
    },
    setValue: function (value) {
        if (value) {
            this.grid.getStore().loadData(value);
        }
    },
    getValue: function () {
        var store = this.grid.getStore(),
            cant = store.getCount();

        if (cant) {
            var range = store.getRange(0, cant - 1),
                value = new Array();

            Ext.each(range, function (record) {
                value.push(record.data);
            });

            return Ext.encode(value);
        }
    },
    getSubmitValue: function () {
        var value = this.getValue();
        return value;
    },
    reset: function () {
        this.preventMark = true;
        this.grid.getStore().removeAll();
        this.preventMark = false;
    },
    isEmpty: function () {
        var value = this.getValue();

        if (Ext.isEmpty(value)) {
            this.addError(this.blankText);
        } else {
            this.removeError(this.blankText);
        }
    },
    getErrors: function () {
        if (this.allowBlank === false) {
            this.isEmpty();
        }
        return this.errors;
    },
    addError: function (error) {
        if (this.errors.indexOf(error) == -1) {
            this.errors.push(error);
        }
    },
    removeError: function (error) {
        var pos = this.errors.indexOf(error);
        if (pos != -1) {
            this.errors.splice(pos, 1);
        }
    },
    isValid: function () {
        var _this = this,
            disabled = _this.disabled,
            validate = _this.forceValidation || !disabled;
        return validate ? _this.validateValue() : disabled;
    },
    validateValue: function () {
        var _this = this,
            errors = _this.getErrors(),
            isValid = Ext.isEmpty(errors);
        if (!_this.preventMark) {
            if (isValid) {
                _this.clearInvalid();
            } else {
                _this.markInvalid(errors[0]);
            }
        }

        return isValid;
    }
});