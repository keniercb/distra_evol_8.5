Ext.define('GestionContratoImportacion.view.EstadosCuentaWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.estadoscuentawindowimportacion',
    autoScroll: true,
    autoHeight: true,
    width: 1000,
    minWidth: 500,
    height: 470,
    resizable: true,
    maximizable: false,
    layout: 'fit',
    constrain: true,
    modal: true,
    idclienteproveedor: -1,
    initComponent: function () {
        var me = this;
        me.title='Estado de la cuenta';
        // console.log('aquiii:')
        me.store=Ext.create('GestionContratoImportacion.store.EstadosCuenta',{
            // params: {'idclienteproveedor': '['+me.idclienteproveedor+']'}
            // filters:[{property:'idclienteproveedores', value: me.idclienteproveedor}]
        });

        function mostrarTooltip(value, meta, record){
            if (value) {
                meta.tdAttr = 'data-qtip="' + value + '"';
            }
            return value;
        }

        var grid=Ext.create('Ext.grid.Panel',{
            store: me.store,
            columns:[
                {text:'Denominacion', tooltip:'Denominacion', dataIndex:'denominacion', flex:2, minWidth:100, renderer: mostrarTooltip},
                {text:'Numero', tooltip:'Numero', dataIndex:'numero', width:80},
                {text:'Fecha emision', tooltip:'Fecha emision', dataIndex:'fechaemision', width:90},
                {text:'Fecha entrega', tooltip:'Fecha entrega', dataIndex:'fechaentrega', width:90},
                {text:'Cliente', tooltip:'Cliente', dataIndex:'nombrecliente', flex:2, minWidth:100, renderer: mostrarTooltip},
                {text:'Moneda', tooltip:'Moneda', dataIndex:'codigoiso', width:60},
                {text:'Codigo', tooltip:'Codigo', dataIndex:'codigo', flex:1, minWidth:80},
                {text:'Importe', tooltip:'Importe', dataIndex:'importemb', flex:1, minWidth:80},
                {text:'Liquidado', tooltip:'Liquidado', dataIndex:'liquidadomb', flex:1, minWidth:80},
                {text:'Pendiente liquidez', tooltip:'Pendiente liquidez', dataIndex:'pendienteliq', flex:1, minWidth:80},
                {text:'Numero comprobante', tooltip:'Numero comprobante', dataIndex:'numcomprobante', flex:1, minWidth:80},
                {text:'N&uacute;mero de cuenta', tooltip:'N&uacute;mero de cuenta', dataIndex:'concatcta', flex:1, minWidth:80},
            ]
        });

        me.items=[
            grid
        ];

        me.store.load({
            params: {
                'idclienteproveedor':'[' + me.idclienteproveedor + ']'
            }
        });

        me.buttons=[
            {
                text:'Cerrar',
                tooltip:'Cerrar la ventana',
                iconCls:'cerrar',
                handler: function(){
                    me.close();
                }
            }
        ];

        me.callParent();
    }
});