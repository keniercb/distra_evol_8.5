Ext.define('Nomencladores.view.PanelPersonas', {
    extend: 'Ext.form.field.Base',
    alias: 'widget.panelpersonas',
    errors: new Array(),

    preventMark: false,

    border: false,
    width: 572,
    hideLabel: true,
    fieldSubTpl: ['<div id="{id}" class="{fieldCls}"></div>', {}],
    require:['Ext.ux.SearchField'],
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

        this.store = Ext.create('Ext.data.Store',{
            autoLoad: true,
            pageSize: 20,
            fields: [
                {name: 'idpersona'},
                {name: 'numid'},
                {name: 'nombreapellidos'}
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getListadoPersonas'}, ModuleMgr.get('GestionContrato')),
                reader: {
                    idProperty: 'idpersona',
                    type: 'json',
                    root: 'data',
                    totalProperty: 'count'
                }
            },
            listeners:{
                beforeload: function(){
                    _this.grid.maskload = new Ext.LoadMask(_this.grid.getEl(), {msg: 'Cargando...'});
                    _this.grid.maskload.show();
                },
                load: function(){
                    if(_this.grid.maskload)_this.grid.maskload.hide();
                }
            }
        });

        this.grid = Ext.create('Ext.grid.Panel', {
            title: 'Personas' + '<span style="color:red;font-weight:bold" data-qtip="Obligatorio">*</span>',
            name: 'nombre',
            store: this.store,
            autoScroll: true,
            selType: 'checkboxmodel',
            flex: 1,
            columns: [
                {
                    text: 'Nombre',
                    flex: 1,
                    dataIndex: 'nombreapellidos'
                }
            ],
            tbar: [
                '->',
                Ext.create('Ext.ux.SearchField', {
                    itemId: 'searchfield',
                    width: 250,
                    maxWidth: 250,
                    minWidth: 150,
                    searchTooltip: 'Buscar persona',
                    keyMap: [
                        {
                            key: 'l',
                            alt: true,
                            ctrl: false,
                            event: 'onclick1'
                        },
                        {
                            key: 'b',
                            alt: true,
                            ctrl: false,
                            event: 'onclick2'
                        }
                    ],
                    listeners:{
                        search: function(){
                            _this.store.proxy.extraParams.nombreapellidos=_this.grid.down('#searchfield').getValue();
                            _this.store.load();
                        },
                        clear: function(){
                            _this.store.proxy.extraParams.nombreapellidos='';
                            _this.store.load();
                        }
                    }
                })
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: this.store,
                pageNumb: true,
                displayInfo: true
            },
            plugins: [
                Ext.create('CRM.plugins.ResaltarFiltrosPlugin', {
                    // extraParams: true,
                    //columnFilters: true,
                    campos: [{
                        'itemId': 'searchfield',
                        'dataIndex': ['nombreapellidos'],
                        // 'color': '#e6d083'
                        //'extraParams': 'filtrogeneral[0][field]'
                    }]
                })
            ]
        });

        this.bodyContainer = Ext.create('Ext.container.Container', {
            flex: 1,
            height: 300,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [this.grid]
        });

    },
    defineEvents: function () {

        this.grid.on({
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
        var sm = this.grid.getSelectionModel(),
            records = sm.getSelection(),
            cant = sm.getCount();

        if (cant) {
            var value = new Array();

            Ext.each(records, function (record) {
                value.push(record.get('idpersona'));
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
        // this.tree.collapseAll();
        _this.grid.getSelectionModel().deselectAll();
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
});
