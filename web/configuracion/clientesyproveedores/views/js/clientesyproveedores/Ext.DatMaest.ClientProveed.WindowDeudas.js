// Ext.define('GestionContrato.view.EstadosCuentaWindow', {
Ext.DatMaest.ClientProveed.WindowDeudas = Ext.extend(Ext.Window, {
    // extend: 'Ext.window.Window',
    // alias: 'widget.estadoscuentawindow',
    autoScroll: true,
    autoHeight: true,
    width: 1000,
    height: 470,
    // resizable: false,
    maximizable: false,
    layout: 'fit',
    constrain: true,
    modal: true,
    idclienteproveedor: -1,
    baseUrl: "/configuracion/clientesyproveedores/index.php/clientesyproveedores/",
    constructor: function (params) {
        var me = this;
        me.idclienteproveedor=params.idclienteproveedor;
        me.etiquetas=params.etiquetas;
        me.title='Deudas';
        console.log('aquiii:')
        // me.store=Ext.create('GestionContrato.store.EstadosCuenta',{
        //     // params: {'idclienteproveedor': '['+me.idclienteproveedor+']'}
        //     // filters:[{property:'idclienteproveedores', value: me.idclienteproveedor}]
        // });
        me.store=new Ext.data.Store({
            // storeId: 'stEstadosCuenta',
            // remoteSort: true,
            // pageSize: 25,
            url: this.baseUrl + 'cargardeudas',
            baseParams: {
                start: 0,
                limit: 20,
                // naturaleza: 1000006 //1000006 //1000257   //cambiar siempre para subir (poner 1000006)
            },
            reader: new Ext.data.JsonReader({
                    root: 'datos',
                    totalProperty: 'cantidad',
                    successProperty: 'success'
                },
                [
                    {name: 'denominacion'},
                    {name: 'numero'},
                    {name: 'fechaemision'},
                    {name: 'fechaentrega'},
                    {name: 'nombrecliente'},
                    {name: 'codigoiso'},
                    {name: 'codigo'},
                    {name: 'importemb'},
                    {name: 'liquidadomb'},
                    {name: 'pendienteliq'},
                    {name: 'numcomprobante'},
                    {name: 'concatcta'},
                ]
            )
        });

        var grid=new Ext.grid.GridPanel({
            store: me.store,
            height:300,
            loadMask: me.etiquetas.lbCargando || 'Cargando...',
            columns:[
                {header:'Denominacion', dataIndex:'denominacion', width:140},
                {header:'Numero', dataIndex:'numero', width:80},
                {header:'Fecha emision', dataIndex:'fechaemision', width:90},
                {header:'Fecha entrega', dataIndex:'fechaentrega', width:90},
                {header:'Cliente', dataIndex:'nombrecliente', flex:2},
                {header:'Moneda', dataIndex:'codigoiso', width:60},
                {header:'Codigo', dataIndex:'codigo', flex:1},
                {header:'Importe', dataIndex:'importemb', flex:1},
                {header:'Liquidado', dataIndex:'liquidadomb', flex:1},
                {header:'Pendiente liquidez', dataIndex:'pendienteliq', flex:1},
                {header:'Numero comprobante', dataIndex:'numcomprobante', width:100},
                {header:'N&uacute;mero de cuenta', dataIndex:'concatcta', flex:1},
            ]
        });
        grid.store.load({
            params: {
                'idclienteproveedor':'[' + me.idclienteproveedor + ']'
            }
        });
        me.items=[
            grid
        ];

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

        Ext.DatMaest.ClientProveed.WindowDeudas.superclass.constructor.call(this, params);
    }
});