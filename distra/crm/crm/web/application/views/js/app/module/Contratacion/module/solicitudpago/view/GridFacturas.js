Ext.define('SolicitudPago.view.GridFacturas' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.sp_gridfacturas',
    itemId:'gridfacturas',
    layout: 'fit',
    // title: 'Facturas',
    // height :220,
    // width: 550,
    // frame:true,
    initComponent: function(){
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        // var sm = Ext.create('Ext.selection.CheckboxModel', {
        //     listeners:{
        //         'selectionchange':function(em, selected, eOpts){
        //             me.down('#modificar').setDisabled(selected.length == 0 || selected.length > 1)
        //             me.down('#eliminar').setDisabled(!selected.length)
        //             //me.down('#seleccionar').setDisabled(!selected.length)
        //         }
        //     }
        // });
        function mostrarTooltipColumna(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }
        function formatoDinero(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + Ext.util.Format.currency(value) + '"';
            return Ext.util.Format.currency(value);
        }
        var columnas=[
            { text: me.etiquetas.lbNumFactura,  dataIndex: 'numero',flex: 0.3, minWidth:80 ,renderer: mostrarTooltipColumna},
            { text: me.etiquetas.lbDocumento,  dataIndex: 'archivoNombre', flex:1,
            renderer: function(value, meta, records) {
                if(value){meta.tdAttr = 'data-qtip="' + value + '"'}else if(!records.get('idespaciotrabajo')){
                meta.tdAttr = 'data-errorqtip="' + me.etiquetas.msgNoDocumentogestorDoc + '"'}

                return value;
            }},
        ];
        var fields=[
            {name: 'idfactura'},
            {name:'archivoNombre'},
            {name: 'archivo'},
            {name: 'idnodoarchivo'},
            {name: 'numero'},
            {name: 'idespaciotrabajo'},
            {name: 'archivoid'},
        ];
        if(me.extrafields){
            me.extrafields.forEach(function(obj){
                columnas.push({
                    // text: me.etiquetas.lbImporte+' '+obj['codigoiso'],
                    text: obj['codigoiso'],
                    dataIndex:'importe'+obj['codigoiso'].toLowerCase(),
                    flex:1,renderer: formatoDinero
                });
                fields.push({name:'importe'+obj['codigoiso'].toLowerCase()});
            })
        }
        me.columns= columnas;
        var myStore = Ext.create('Ext.data.Store', {
            storeId:'st_facturas',
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'cargarFacturas'}, ModuleMgr.get('SolicitudPago')),
                actionMethods: {
                    read: 'POST'
                },
                reader: {
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success'
                }
            },
            fields:fields,
            model: 'Factura',

        });
        // me.selModel=sm;
        me.store=myStore;

        // Ext.apply(me,{
        if(!me.detalles) {
            me.tbar = [
                {
                    text: me.etiquetas.lbAdicionar,
                    hidden: this.detalles,
                    tooltip: me.etiquetas.lbAdicionarFactura,
                    iconCls: 'adicionar',
                    action: 'addfactura',
                    handler: function () {
                        // Ext.create('SolicitudPago.view.WindowFactura').show();
                    }
                }, {
                    text: me.etiquetas.lbModificar,
                    itemId: 'modificar',
                    hidden: this.detalles,
                    iconCls: 'modificar',
                    tooltip: me.etiquetas.lbModificarFactura,
                    disabled: true,
                    action: 'modfactura'

                }, {
                    text: me.etiquetas.lbEliminar,
                    itemId: 'eliminar',
                    hidden: this.detalles,
                    iconCls: 'eliminar',
                    tooltip: me.etiquetas.lbEliminarFactura,
                    disabled: true,
                    action: 'delfactura'
                }
            ];
        }

            // [
            //     // { text: 'id',  dataIndex: 'id', hidden:true },
            //     { text: 'Nro.factura',  dataIndex: 'numero',flex: 0.6 },
            //     { text: 'Importe CUP', dataIndex: 'importecup',flex: 1 },
            //     { text: 'Importe CUC', dataIndex: 'importecuc',flex: 1 },
            //     { text: 'Documento',  dataIndex: 'archivoNombre', flex:1.2},
            //     // { text: 'Importe a pagar CUP', dataIndex: 'importepagarcup', flex: 0.5 },
            //     // { text: 'Importe a pagar CUC', dataIndex: 'importepagarcuc',flex: 0.5 }
            // ];

        this.callParent(arguments);
    }
});