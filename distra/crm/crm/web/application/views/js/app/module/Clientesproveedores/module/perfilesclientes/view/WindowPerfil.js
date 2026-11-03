Ext.define('PerfilesClientes.view.WindowPerfil', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.WindowPerfil',

    autoScroll: true,
    maximizable: true,
    layout: 'column',
    requires: ['Ext.ux.CmbSelectField'],

    initComponent: function () {
        this.createInitialConfig();
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);


        me.height = 550;
        me.width = 710;
        //me.defaultFocus = me.numero;
        me.myDataView = Ext.create('PerfilesClientes.view.DataViewWin', {
            store: Ext.create('Ext.data.Store', {
                model: 'PerfilesClientes.model.DataViewPerfil',
                data: me.dataview
            })
        });
        me.hfclienteproveedor = Ext.create('Ext.form.field.Hidden', {
            name: 'idclienteproveedor'
        });
        me.cmbCliente = Ext.create('Ext.ux.CmbSelectField',{
            //xtype: 'cmbselectfield',
            name: 'clienteproveedor',
            mapping: 'NomClienteproveedor.nombre',//'NomClienteproveedor.nombre',
            localId: 'idclienteproveedor',
            module: 'TipoContrato',
            noactions: true,
            allowBlank: false,
            width: 300,
            forceSelection: true,
            context: 'perfilesclientesmainwindowclienteproveedor',
            filters: {
                idtipo: 1,
                idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun
            },
            controller: 'perfilesclientesmainwindow'
        });
        me.comboFieldSetCliente = Ext.create('Ext.ux.ComboFieldSet', {
            title: me.etiquetas.lbCliente,
            collapsible: true,
            labelAlign: 'top',
            layout: 'column',
            columnWidth: 1,
            margin: '5 0 10 0',
            border: true,
            height: 323,
            autoScroll: true,
            //collapsed: me.action == 'add',
            cls: 'images-view',
            xtypejojo: 'panel',
            otherjojo: true,
            cfgjojo: {
                bodyStyle: 'background:#DFE9F6;',
                border: false,
                margin: '3 0 0 0',
                items: [
                    me.hfclienteproveedor, me.cmbCliente
                ]
            },
            defaults: {
                bodyStyle: 'background:#DFE9F6;',
                margin: '0 5 0 5',
                columnWidth: 0.5,
                layout: 'hbox',
                border: false
            },
            items: [
                me.myDataView
            ]
        });
        me.cmpCuestionario = Ext.create('PerfilesClientes.view.Cuestionario', {index: ''});
        me.customForm = Ext.create('Ext.ux.CustomForm', {
            bodyStyle: 'background:#DFE9F6;',//padding: 5px 20px 5px 5px;
            margin: '5 5 0 5',
            columnWidth: 1,
            trackResetOnLoad: true,
            items: [me.comboFieldSetCliente, me.cmpCuestionario]
        });
        me.items = [me.customForm];

    }
});
