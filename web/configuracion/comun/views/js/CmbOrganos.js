Ext.CmbOrganos = Ext.extend(Ext.form.FormPanel, {
    id: 'cmborgano',
    hidden: false,
    width: 290,
    url: 'listarOrganosInternos',
    idioma: {},
    gridStore: undefined,
    height: 20,
    bodyStyle: 'margin:0;paddin:0;border:0;background:none repeat scroll 0% 0% transparent;',
    border: false,
    labelWidth: 40,
    layout: 'column',
    idestructura: window.parent.perfil.idestructuracomun,
    onSelectFn:Ext.emptyFn,
    onCheckFn:Ext.emptyFn,
    scope:undefined,
    constructor: function (params) {
        Ext.apply(this, params);
        this.fieldLabel = this.idioma.lbOrgano || '\xD3rgano';
        this.emptyText = this.idioma.emptyText || 'Seleccione...';
        this.loadingText = this.idioma.lbMsgCargando || 'Cargando...';

        this.store = new Ext.data.Store({
            url: this.url,
            reader: new Ext.data.JsonReader({
                totalProperty: 'count',
                root: 'data',
                id: 'id'
            }, [
                {
                    name: 'id'
                },
                {
                    name: 'text'
                }
            ])
        });

        this.combo = new Ext.form.ComboBox({
            disabled: true,
            fieldLabel: this.fieldLabel,
            emptyText: this.emptyText,
            loadingText: this.loadingText,
            store: this.store,
            typeAhead: false,
            pageSize: 10,
            displayField: 'text',
            valueField: 'id',
            queryParam: 'text',
            allowBlank: true,
            triggerAction: 'all',
            enableKeyEvents: true,
            anchor: '100%'
        });

        this.checkbox = new Ext.form.Checkbox({
            hideLabel: true,
            checked: false
        });

        this.items = [
            {
                layout: 'form',
                bodyStyle: this.bodyStyle + 'margin-top:1px;',
                columnWidth: .06,
                items: this.checkbox
            }, {
                layout: 'form',
                bodyStyle: this.bodyStyle,
                columnWidth: .94,
                items: this.combo
            }];
        Ext.CmbOrganos.superclass.constructor.call(this);
        this.initializeEvents();
    },
    initializeEvents: function () {
        if(!this.combo.eventdefined){

            this.checkbox.on({
                scope: this,
                check: function (field, value) {
                    if (value) {
                        this.combo.enable();
                    } else {
                        var value = this.combo.getValue();
                        this.combo.disable();
                        this.idestructura = window.parent.perfil.idestructuracomun;
                        this.combo.setValue();
                        if(!Ext.isEmpty(this.onSelectFn) && typeof this.onSelectFn == 'function' && value){
                            this.onSelectFn.call(this.scope || this);
                        }

                        if (this.gridStore && value) {
                            this.gridStore.load();
                        }
                    }
                }
            });

            this.combo.on({
                scope: this,
                select: function (combo, record) {
                    this.idestructura = record.data.id;
                    if(!Ext.isEmpty(this.onSelectFn) && typeof this.onSelectFn == 'function'){
                        this.onSelectFn.call(this.scope || this);
                    }
                    if (this.gridStore) {
                        this.gridStore.load();
                    }
                }
            });
            this.combo.eventdefined = true;
        }

        if (this.gridStore) {
            this.gridStore.on({
                scope: this,
                loadexception: function (store) {
                    this.gridStore.removeAll();
                }
            });
        }

        Ext.Ajax.on({
            scope: this,
            beforerequest: function (conn, options) {
                if (!options.params) {
                    options.params = {};
                }
                if (typeof options.params != 'object') {
                    options.params += "&idestructura=" + this.idestructura;
                } else {
                    options.params.idestructura = this.idestructura;
                }
            }
        });
    },
    setStore:function(store){
        this.gridStore = store;
        this.initializeEvents();
    }
});
