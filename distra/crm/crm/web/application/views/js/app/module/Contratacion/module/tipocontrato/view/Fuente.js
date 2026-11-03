Ext.define('TipoContrato.view.Fuente', {
    extend: 'Ext.window.Window',
    alias: 'widget.fuente',
    layout: 'border',
    maskOnDisable: false,
    constrain: true,
    modal: true,
    frame: false,
    border: false,
    width: 580,
    minWidth: 580,
    height: 120,
    minHeight: 120,
    maximizable: true,

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        me.title = this.etiquetas.lbConfigFuente;

        me.storeDir = Ext.create('TipoContrato.store.Clase');

        me.dir = Ext.create('TipoContrato.view.TreeCombo', {
            fieldLabel: me.etiquetas.lbClase,
            editable: false,
            treeWidth: 240,
            flex: 0.5,
            allowBlank: false,
            typeAhead: false,
            store: me.storeDir
        });
        me.storeCampo = Ext.create('TipoContrato.store.Campo');

        me.campo = Ext.create('Ext.form.ComboBox', {
            fieldLabel: me.etiquetas.lbCampo,
            store: me.storeCampo,
            queryMode: 'local',
            flex: 0.5,
            displayField: 'denominacion',
            valueField: 'denominacion',
            enableKeyEvents: true,
            forceSelection: true,
            emptyText: me.etiquetas.lbSeleccione,
            disabled: true,
            listeners: {
                'keyup': function () {
                    var m = this;
                    m.store.clearFilter();
                    m.store.filterBy(function (record) {
                        return record.get(m.displayField).toLowerCase().indexOf(m.getRawValue().toLowerCase()) != -1;
                    });
                },
                'expand': function () {
                    this.store.clearFilter();
                },
                'focus': function () {
                    this.expand();
                }
            }
        });
        me.form = Ext.create('Ext.form.Panel', {
            fieldDefaults: {
                labelAlign: 'top',
                margins: 5,
                width: 250
            },
            bodyStyle: 'background:#DFE9F6; padding:5px;',
            labelWidth: 500,
            frame: false,
            border: false,
            region: 'north',
            layout: 'hbox',
            items: [me.dir, me.campo]
        });
        me.btnCancelar = Ext.create('Ext.Button', {
            text: me.etiquetas.cancelar,
            iconCls: 'icondistra-cancelar',
            tooltip: me.etiquetas.tpcancelarV,
            handler: function () {
                me.close();
            }
        });
        me.btnAceptar = Ext.create('Ext.Button', {
            text: me.etiquetas.aceptar,
            disabled: true,
            tooltip: me.etiquetas.tpaceptarV,
            iconCls: 'icondistra-aceptar'
        });
        me.tools = [{
            type: 'help',
            action: 'help',
            refhelp: 'conf_tp_fuente',
            tooltip: this.etiquetas.qtipHistoric

        }];
        me.items = [me.form];
        me.bbar = ['->', me.btnCancelar, me.btnAceptar];

        me.callParent();
    }
});