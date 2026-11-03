Ext.define('Ext.ux.CustomForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.customform',

    layout: 'column',
    anchor: '100%',
    bodyStyle: 'background:#DFE9F6; padding:5px',
    border: false,
    fieldDefaults: {
        labelAlign: 'top'
    },
    defaults: {
        bodyStyle: 'background:#DFE9F6;',
        border: false
    },

    trackResetOnLoad: true,

    firstIndexField: undefined,

    registertypes: {
        string: 'textfield',
        int: 'numberfield',
        float: 'numberfield',
        date: 'datefield',
        boolean: 'customtoggleslide'//,
        //boolean: 'checkbox'
    },
    registerxtypes: [
        'textfield',
        'numberfield',
        'datefield',
        'textarea',
        'selectfield',
        'customhtmleditor',
        'hiddenfield',
        'customtoggleslide'
    ],
    notColumnXtypes: [
        'textarea',
        'textareafield'
    ],
    initComponent: function () {
        this.callParent();

        this.add(
            {
                xtype: 'hiddenfield',
                name: 'modelName',
                value: this.modelName
            }
        );
    },
    addItem: function (item) {
        if (item.hidden || item.xtype == 'hiddenfield' || item.xtype == 'hidden') {
            this.add(item);
        } else {
            var width = item.columnwidth ? item.columnwidth / 100 : 1;
            if (item.inColumn && !item.columnwidth) {
                width = .5
            }

            var column = {
                columnWidth: width,
                layout: 'anchor',
                items: item
            };

            this.add(column);
        }


        if (!item.hidden && item.xtype != 'hiddenfield' && item.xtype != 'hidden' && !this.firstIndexField) {
            this.firstIndexField = item.tabIndex;
        }

    },
    createCmp: function (config) {

        switch (config.xtype) {
            case 'numberfield':
                return this.createNumberField(config);
                break;
            case 'datefield':
                return this.createDateField(config);
                break;
            case 'textarea':
                return this.createTextArea(config);
                break;
            case 'customtoggleslide':
                return this.createToggleslide(config);
                break;
            case 'checkbox':
                return this.createCheckbox(config);
                break;
            case 'customhtmleditor':
                return this.createHtmlEditor(config);
                break;
            case 'htmleditor':
                return this.createHtmlEditor(config);
                break;
            case 'selectfield':
                return this.createSelectField(config);
                break;
            case 'hiddenfield':
                return this.createHiddenField(config);
                break;
            case 'fieldset':
                return this.createFieldset(config);
                break;
            case 'textfield':
                return this.createTextField(config);
                break;
            case 'cmbselectfield':
                return this.createCmbSelectField(config);
                break;
            default:
                var className = Ext.ClassManager.getNameByAlias('widget.' + config.xtype);
                console.log('className:', className, config)
                if (className) {
                    return Ext.create(className, config);
                }
        }
    },
    createFieldset: function (config) {
        var config = Ext.Object.merge(
            {
                collapsible: true,
                labelAlign: 'top',
                layout: 'column',
                autoScroll: true,
                defaults: {
                    bodyStyle: 'background:#DFE9F6; padding:5px;'
                }
            }, config);

        return Ext.create('Ext.form.FieldSet', config);
    },
    createHiddenField: function (config) {
        return Ext.create('Ext.form.field.Hidden', config);
    },
    createTextField: function (config) {
        var config = Ext.Object.merge(
            {
                vtype: 'descripcion'
            }, config);
        return Ext.create('Ext.form.field.Text', config);
    },
    createNumberField: function (config) {
        return Ext.create('Ext.form.field.Number', config);
    },
    createDateField: function (config) {
        var config = Ext.Object.merge(
            {
                pickerAutoEight: true
            }, config);
        return Ext.create('Ext.form.field.Date', config);
    },
    createTextArea: function (config) {
        var config = Ext.Object.merge(
            {
                vtype: 'descripcion'
            }, config);
        return Ext.create('Ext.form.field.TextArea', config);
    },
    createToggleslide: function (config) {
        var config = Ext.Object.merge(
            {
                onText: 'Si',
                offText: 'No',
                getValue: function () {
                    return this.value ? 1 : 0
                },
                getSubmitValue: function () {
                    return this.getValue();
                }
            }, config);

        return Ext.create('Ext.ux.form.field.ToggleSlide', config);
    },
    createHtmlEditor: function (config) {
        return Ext.create('Ext.ux.CustomHtmlEditor', config);
    },
    createSelectField: function (config) {
        return Ext.create('Ext.ux.SelectField', config);
    },
    createCmbSelectField: function (config) {
        return Ext.create('Ext.ux.CmbSelectField', config);
    },
    createCheckbox: function (config) {
        return Ext.create('Ext.form.field.Checkbox', config);
    }
});