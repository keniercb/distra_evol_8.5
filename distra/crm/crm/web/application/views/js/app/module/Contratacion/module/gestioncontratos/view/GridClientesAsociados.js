Ext.define('GestionContrato.view.GridClientesAsociados', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridclientesasociados',
    itemId: 'gridclientesasociados',
    datosLoad:[],
    selType: 'checkboxmodel',
    initComponent: function() {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);

        me.store = Ext.create('Ext.data.Store', {
            fields: ['idclienteproveedor', 'nombre', 'idcontratoclienteasociado'],
            originalValue:'[]',
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'cargarClientesAsociados'}, ModuleMgr.get('Contrato')),
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                },
                extraParams:{
                    idcontratos: null
                }
            },
        });

        me.columns = [
            {
                text: me.context == 'cliente' ? me.etiquetas.lbCliente : me.etiquetas.lbProveedor,
                dataIndex: 'nombre',
                flex: 1
            },
        ];

        me.tbar = [
            {
                text:me.etiquetas.lbAdd,
                iconCls: 'adicionar',
                tooltip: me.etiquetas.qtipAddCliente,
                itemId: 'addClienteAsociado',
                action: 'addClienteAsociado',
            },
            {
                text:me.etiquetas.lbDel,
                iconCls: 'eliminar',
                disabled:true,
                tooltip: me.etiquetas.qtipEliminarCliente,
                itemId: 'delClienteAsociado',
                action: 'delClienteAsociado',
            }
        ];

        // me.selModel=Ext.create('Ext.selection.CheckboxModel',{
        //     listeners:{
        //         selectionchange: function(yo, select){
        //             me.down.setDisabled(select.length==0);
        //         }
        //     }
        // });

        me.callParent();
    }
})