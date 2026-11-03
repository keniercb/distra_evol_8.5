Ext.define('GestionContrato.view.FormaPago.Producto.GridProducto', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridproducto',
    region: 'center',
    selType: 'checkboxmodel',
    layout: 'column',
    itemId:'gridindicadores',
    autoScroll: true,
    datosLoad:[],
    sinAcciones:false,
    selModel: {mode: 'MULTI'},
    editGrid:true,
    plugins:[
        {
            ptype: 'rowexpander',
            rowBodyTpl : new Ext.XTemplate(
                '<span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ' +
                'Datos adicionales'+':</b> {datos_json_encode}</span>'
            ),
            listeners:{
                expandbody: function(rowNode, record, expandRow){

                }
            }
        }
    ],
    initComponent: function () {
        var me = this;
        me.storeId = 'indicadorStore';
        me.etiquetas = LangMgr.getLang(me);
//         me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.border = false;
        me.store = Ext.create('Ext.data.Store', {
            storeId: me.indicadorStoreId || 'indicadorStore',
            grid:me,
            fields: [
                {name: 'idindicadorcontrato'},
                {name: 'idindicador'},
                {name: 'idactividad', type: 'int'},
                {name: 'codigo', type: 'string'},
                {name: 'denominacion', type: 'string'},
                {name: 'cantidad', type: 'float'},
                {name: 'unidadmedida'},
                {name: 'precio', type: 'float'},
                {name: 'preciodivisa', type: 'float'},
                {name: 'preciototal', type: 'float'},
                {name: 'preciodivisatotal', type: 'float'},
                {name: 'monto', type: 'float'},
                {name: 'tipo', type: 'float'},
                'datos_json', 'datos_json_encode'
            ],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    idProperty: 'idindicadorcontrato'
                }
            },
            originalValue:'[]',
            listeners:{
                update:function(yo){
                    Ext.each(me.up('window').extrafields, function (value, index) {
                        if(me.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase())){
                                me.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase()).validate();
                        }
                    });
                    if(me.up('window').formaPago)
                        if(me.up('window').formaPago.hitopago)
                            if(me.up('window').formaPago.hitopago.getStore().getCount()==0)
                                me.up('window').formaPago.hitopago.setDisabled(yo.getCount()>0);
                }
            }
        });
        if(me.editGrid)
            me.plugins.push(
                    new Ext.grid.plugin.CellEditing({
                        clicksToEdit: 1,
                        listeners:{
                            edit: function(yo, obj){
                                Ext.each(me.up('window').extrafields,function (field, index) {
                                    var win=me.up('window').formaPago?me.up('window').formaPago:me.up('window'),
                                        actual=win.down('#montomoneda_' + field.codigoiso.toLowerCase());
                                    if (actual) {
                                        if(!actual.introducidoManual)
                                            win.cambiarMontosPorHitosIndicadores()
                                    }
                                });
                                obj.record.set('preciototal',
                                    parseFloat(obj.record.get('precio'))*parseFloat(obj.record.get('cantidad')));
                                obj.record.set('preciodivisatotal',
                                    parseFloat(obj.record.get('preciodivisa'))*parseFloat(obj.record.get('cantidad')));
                            }
                        }
                    })
            );

        me.columns = [
        {
                text: me.etiquetas.lbCodigo,
                dataIndex: 'codigo',
                minWidth: 60,
                maxWidth: 110,
                flex: 0.1,
                renderer: function (value, meta) {
                    if (value)
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                text: me.etiquetas.lbDescripcion,
                dataIndex: 'denominacion',
                minWidth: 40,
                flex: 0.3,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },
            {
                text: 'Cantidad',
                minWidth: 50,
                width:60,
                dataIndex: 'cantidad',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 9,
                    maxLength: 19,
                    decimalSeparator: '.',
                    allowDecimals:false,
                    allowExponential:false
                },
                renderer: function (value, meta) {
                    if (value) {
                        value = me.formatNumber(value);
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },
            {
                text: 'Unidad de medida',
                minWidth: 70,
                width: 100,
                dataIndex: 'unidadmedida',
                renderer: function (value, meta) {
                    if (!Ext.isEmpty(value)) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },
            {
                text: 'CUP',
                flex: 0.1,
                dataIndex: 'precio',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 9,
                    maxLength: 19,
                    decimalSeparator: ',',
                    allowDecimals:true,
                    allowExponential:false,
                },
                renderer: function (value, meta,record) {
                    if (!Ext.isEmpty(value)) {
                        meta.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(value) + '<br>' +
                            '<b>Importe</b>:'+me.formatNumber(parseFloat(value)*parseFloat(record.get('cantidad')))+'"';
                        value = me.formatNumber(value);
                    }
                    return value;
                }
            },
            {
                text: 'CUC',
                flex: 0.1,
                dataIndex: 'preciodivisa',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 9,
                    maxLength: 19,
                    decimalSeparator: ',',
                    allowDecimals:true,
                    allowExponential:false,
                },
                renderer: function (value, meta, record) {
                    if (!Ext.isEmpty(value)) {
                        meta.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(value)+ '<br>' +
                            '<b>Importe</b>:'+me.formatNumber(parseFloat(value)*parseFloat(record.get('cantidad')))+'"';
                        value = me.formatNumber(value);
                    }
                    return value;
                }
            },
            {
                text:'Total',
                flex:0.1,
                renderer: function (value, meta, record) {
                    var suma=0, importe=0;
                    if (!Ext.isEmpty(record.get('precio'))) {
                        suma += parseFloat(record.get('precio'));
                        importe += parseFloat(record.get('precio'))*parseFloat(record.get('cantidad'));
                    }
                    if (!Ext.isEmpty(record.get('preciodivisa'))) {
                        suma += parseFloat(record.get('preciodivisa'));
                        importe += parseFloat(record.get('preciodivisa'))*parseFloat(record.get('cantidad'));
                    }
                    meta.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(suma)+ '<br>' +
                        '<b>Importe</b>:'+me.formatNumber(parseFloat(importe))+'"';
                    value = me.formatNumber(suma);
                    return value;
                }
            },
            // {
            //     text:'Importe',
            //     flex:0.1,
            //     renderer: function (value, meta, record) {
            //         var  importe=0;
            //         if (!Ext.isEmpty(record.get('precio'))) {
            //             importe += parseFloat(record.get('precio'))*parseFloat(record.get('cantidad'));
            //         }
            //         if (!Ext.isEmpty(record.get('preciodivisa'))) {
            //             importe += parseFloat(record.get('preciodivisa'))*parseFloat(record.get('cantidad'));
            //         }
            //         meta.tdAttr = 'data-qtip="'+me.formatNumber(parseFloat(importe))+'"';
            //         value = me.formatNumber(importe);
            //         return value;
            //     }
            // },
            {
                text: 'Tipo',
                dataIndex: 'tipo',
                width:45,
                renderer: this.rendererClasificacion
            }
        ];

        me.btnAddProducto = Ext.create('Ext.menu.Item', {
            iconCls: 'icondistra-producto icon-medium',
            text: 'Producto',
            tooltip: me.etiquetas.lbAdd + ' ' + me.etiquetas.lbProdServ.toLocaleLowerCase(),
            action: 'addprod'
        });

        me.btnAddServicio = Ext.create('Ext.menu.Item', {
            iconCls: 'icondistra-servicio icon-medium',
            text: 'Servicio',
            tooltip: me.etiquetas.lbAdd + ' ' + me.etiquetas.lbProdServ.toLocaleLowerCase(),
            action: 'addserv'
        });

        me.btnAdd = Ext.create('Ext.Button', {
            iconCls: 'icondistra-adicionar icon-medium',
            text: me.etiquetas.lbAdd,
            tooltip: me.etiquetas.lbAdd + ' ' + me.etiquetas.lbProdServ.toLocaleLowerCase(),
            menu: [me.btnAddProducto, me.btnAddServicio]
        });
        me.btnMod = Ext.create('Ext.Button', {
            iconCls: 'icondistra-modificar icon-medium',
            action: 'modprodserv',
            disabled: true,
            hidden:me.context=='cliente',
            text: me.etiquetas.lbMod,
            tooltip: me.etiquetas.lbMod+ ' ' + me.etiquetas.lbProdServSingular.toLocaleLowerCase()
        });
        me.btnDel = Ext.create('Ext.Button', {
            iconCls: 'icondistra-eliminar icon-medium',
            action: 'delprodserv',
            disabled: true,
            text: me.etiquetas.lbDel,
            tooltip: me.etiquetas.lbDel + ' ' + me.etiquetas.lbProdServSingular.toLocaleLowerCase() + ' <b>(DEL)</b>'
        });

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            hidden: me.sinAcciones,
            items: [me.btnAdd, me.btnMod, me.btnDel]
        });
        me.callParent();
    },
    formatNumber: function (value) {
        return Ext.util.Format.currency(value);
    },
    rendererClasificacion: function (value, metadata, record) {
        var icono = 'icondistra-',
            tipo = this.etiquetas.lbProd;
        if (value == 1) {
            icono += 'producto';
        } else {
            icono += 'servicio';
            tipo = this.etiquetas.lbServ;
        }
        metadata.innerCls = icono;
        metadata.tdAttr = 'data-qtip="' + tipo + '"';
    }
});
