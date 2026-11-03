Ext.define('TipoContrato.view.ConfigElemento', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.configElemento',
    layout: 'fit',
    region: 'center',
    disabled: true,
    border: false,
    storeTreeElemento: this.storeTreeElemento,
    bodyStyle: 'background:#DFE9F6; padding:5px;',
    fieldDefaults: {
        labelAlign: 'top',
        msgTarget: 'side'
    },

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        me.btnLimpiarEditor = Ext.create('Ext.Button', {
            text: me.etiquetas['lbLimpiar'],
            tooltip: me.etiquetas['tpLimpiar'],
            iconCls: 'icondistra-limpiar'
        });

        me.buscarEditor = Ext.create('Ext.ux.SearchField', {
            clearTooltip: me.etiquetas['lbLimpiarFiltro'],
            searchTooltip: me.etiquetas['lbBuscar'],
            emptyText: me.etiquetas['lbCriterioBusqueda']
        });

        me.gdEditor = Ext.create('Ext.grid.property.Grid', {
            layout: 'fit',
            title: me.etiquetas['lbPropiedades'],
            nameColumnWidth: 150,
            tbar: [
                me.btnLimpiarEditor,
                '->',
                me.buscarEditor
            ]
        });

        me.btnLimpiarPropiedades = Ext.create('Ext.Button', {
            text: me.etiquetas.lbLimpiar,
            tooltip: me.etiquetas.tpLimpiarCfg,
            iconCls: 'icondistra-limpiar',
            disabled: true,
            context: 'cfg',
            keyMap: {
                key: 'l',
                alt: true,
                ctrl: false,
                shift: true,
                event: 'click'
            }
        });

        me.cmbPropiedades = Ext.create('Ext.form.field.ComboBox', {
            width: 200,
            displayField: 'cfg',
            valueField: 'cfg',
            typeAhead: false,
            queryMode: 'local',
            enableKeyEvents: true,
            emptyText: me.etiquetas.lbSeleccionePropiedad,
            context: 'cfg',
            listeners: {
                'keyup': function () {
                    var me = this;
                    var source = me.up().up().getSource();
                    this.store.clearFilter();
                    this.store.filterBy(function (record) {
                        return !(source[record.data.cfg] || source[record.data.cfg] == '') && record.get(me.displayField).toLowerCase().indexOf(me.getRawValue().toLowerCase()) != -1;
                    });
                },
                'expand': function () {
                    var me = this;
                    var source = me.up().up().getSource();
                    this.store.clearFilter();
                    this.store.filterBy(function (record) {
                        return !(source[record.data.cfg] || source[record.data.cfg] == '');
                    });
                }
            }
        });

        me.gdPropiedades = Ext.create('Ext.ux.property.Grid', {
            layout: 'fit',
            title: me.etiquetas.lbPropiedades,
            nameColumnWidth: 150,
            valueText: me.etiquetas.lbValor,
            nameText: me.etiquetas.lbPropiedad,
            tbar: [
                me.btnLimpiarPropiedades,
                '->',
                me.cmbPropiedades
            ]
        });

        me.items = [
            me.gdPropiedades
        ];

        me.callParent();
    }
});