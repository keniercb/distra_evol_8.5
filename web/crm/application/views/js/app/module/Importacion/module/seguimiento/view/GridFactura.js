Ext.define('Seguimiento.view.GridFactura' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.s_gridfactura',
    itemId:'gridfactura',
    layout: 'fit',
    // title: 'Facturas',
    // height :220,
    // width: 550,
    // frame:true,
    initComponent: function(){
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

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
            }}
        ];
        var fields=[
            {name: 'idfacturaarribo'},
            {name:'archivoNombre'},
            {name: 'archivo'},
            {name: 'idnodoarchivo'},
            {name: 'numero'},
            {name: 'idespaciotrabajo'},
            {name: 'archivoid'},
            {name: 'numerofacturaproveedor'},
            {name: 'numerocontenedor'},
            {name: 'tipoentrega'},
            {name: 'idtipoentrega'},
            {name: 'fecha'},
            {name: 'numerobl'},
        ];
        if(me.extrafields){
            me.extrafields.forEach(function(obj){
                columnas.push({
                    // text: me.etiquetas.lbImporte+' '+obj['codigoiso'],
                    text: obj['codigoiso'],
                    align: 'right',
                    dataIndex:'importe_'+obj['codigoiso'].toLowerCase(),
                    minWidth: 100, renderer: formatoDinero
                });
                fields.push({name:'importe_'+obj['codigoiso'].toLowerCase()});
            })
        }
        me.columns= columnas;
        var myStore = Ext.create('Ext.data.Store', {
            storeId:'s_st_facturas',
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'cargarFacturas'}, ModuleMgr.get('Seguimiento')),
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
                    itemId: 'addfactura',
                    handler: function () {
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
                },
                '->',
                // {
                //     text: 'Volver a seleccionar los pedidos',
                //     itemId: 'volverpedidos',
                //     hidden: this.detalles || me.caso=='mod',
                //     iconCls: 'anterior',
                //     tooltip: 'Volver a seleccionar los pedidos',
                //     // disabled: true,
                //     action: 'volverpedidos',
                // }
            ];
        }

        this.callParent(arguments);
    }
});