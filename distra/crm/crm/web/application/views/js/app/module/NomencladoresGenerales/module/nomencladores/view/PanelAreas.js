Ext.define('Nomencladores.view.PanelAreas', {
    extend: 'Ext.form.field.Base',
    alias: 'widget.panelareas',
    errors: new Array(),

    preventMark: false,

    border: false,
    width: 572,
    hideLabel: true,
    fieldSubTpl: ['<div id="{id}" class="{fieldCls}"></div>', {}],

    initComponent: function () {
        this.etiquetas = LangMgr.getLang(this);
        this.blankText = this.etiquetas.vBlankText;
        this.createBody();

        this.callParent(arguments);
        this.defineEvents();
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
    },
    createBody: function () {
        var _this = this;

        this.store = Ext.create('Nomencladores.store.Areas');

        this.tree = Ext.create('Ext.tree.Panel', {
            title: this.etiquetas.lbareas + '<span style="color:red;font-weight:bold" data-qtip="Obligatorio">*</span>',
            cls: 'crm-icon-tree',
            name: 'nombre',
            store: this.store,
            rootVisible: false,
            autoScroll: true,
            selType: 'checkboxmodel',
            flex: 1,
            columns: [
                {
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: _this.etiquetas.lbnombre,
                    flex: 1,
                    dataIndex: 'text'
                }
            ]
        });

        this.bodyContainer = Ext.create('Ext.container.Container', {
            flex: 1,
            height: 250,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [this.tree]
        });

    },
    defineEvents: function () {

        this.tree.on({
            scope:this,
            selectionchange:function(){
                this.isValid();
            }
        });
    },
    setValue: function (value) {
        if (value) {
            //this.stRight.loadData(value);
        }
    },
    getValue: function () {
        var sm = this.tree.getSelectionModel(),
            records = sm.getSelection(),
            cant = sm.getCount();

        if (cant) {
            var value = new Array();

            Ext.each(records, function (record) {
                value.push(record.get('id'));
            });
            return value;
        }
    },
    getSubmitValue: function () {
        var value = Ext.encode(this.getValue());
        return value;
    },
    reset: function () {
        var _this = this;
        this.tree.collapseAll();
        this.tree.getSelectionModel().deselectAll();
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

        return isValid;
    },
    search: function () {

    },
    clear: function () {

    }
});
