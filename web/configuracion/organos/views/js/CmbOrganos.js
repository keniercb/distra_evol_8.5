Ext.CmbOrganos = Ext.extend(/*Ext.form.FormPanel*/Ext.Toolbar, {
    id: 'cmborgano',
    url: '/configuracion/organos/index.php/organos/',
    idioma: {},
    //gridStore: {},
    style: 'margin:0;paddin:0;border:0;background:none repeat scroll 0% 0% transparent;',
    idestructura: window.parent.perfil.idestructuracomun,
    idestructuraeconomica: '',
    constructor: function (params) {
        Ext.apply(this, params);
        this.hidden = typeof params.cargaInicial != 'undefined' ? params.cargaInicial : true;
        this.fieldLabel = this.idioma.lbOrgano || '\xD3rgano:';
        this.emptyText = this.idioma.emptyText || 'Seleccione...';
        this.loadingText = this.idioma.lbMsgCargando || 'Cargando...';
        this.store = new Ext.data.Store({
            url: this.url + 'listarOrganosInternos',
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
            emptyText: this.emptyText,
            loadingText: this.loadingText,
            store: this.store,
            margin: '10 10 10 10',
            typeAhead: false,
            pageSize: 10,
            width: 223,
            displayField: 'text',
            valueField: 'id',
            queryParam: 'text',
            allowBlank: true,
            triggerAction: 'all',
            enableKeyEvents: true,
            labelAlign: 'left',
            anchor: '100%',
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>'
        });

        this.checkbox = new Ext.form.Checkbox({
            hideLabel: true,
            checked: false
        });

        this.items = ['->', this.checkbox, '->', {xtype: 'label', text: this.fieldLabel}, '->', this.combo];
        Ext.CmbOrganos.superclass.constructor.call(this);
        this.initializeEvents();
    },
    initializeEvents: function () {
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
                    this.combo.fireEvent('change',this.combo,'',value);
                    if (this.gridStore && value) {
                        this.gridStore.load();
                    } else if (this.tabsubsistemas) {
                        this.tabsubsistemas.createItems();
                    }
                }
            }
        });

        this.combo.on({
            scope: this,
            select: function (combo, record) {
                this.idestructura = record.data.id;
                if (this.gridStore) {
                    this.gridStore.load();
                } else if (this.tabsubsistemas) {
                    this.tabsubsistemas.createItems();
                }
            }
        });

        if (this.gridStore) {
            this.gridStore.on({
                scope: this,
                loadexception: function (store) {
                    if (this.gridStore) {
                        this.gridStore.removeAll();
                    } else if (this.tabsubsistemas) {
                        this.tabsubsistemas.createItems();
                    }
                }
            })
        }

        Ext.Ajax.on({
            scope: this,
            beforerequest: function (conn, options) {
                var me = this;
                if (!options.params) {
                    options.params = {};
                }
                if (typeof options.params != 'object') {
                    options.params += "&idestructura=" + this.idestructura + "&otherorgan=" + (me.checkbox.getValue() ? 1 : 0);
                } else {
                    options.params.idestructura = this.idestructura;
                    options.params.otherorgan = me.checkbox.getValue() ? 1 : 0;
                }
            }
        });
    }
});
