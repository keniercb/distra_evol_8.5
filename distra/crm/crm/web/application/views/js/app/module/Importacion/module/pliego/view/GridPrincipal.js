Ext.define('Pliego.view.GridPrincipal', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridprincipal',
    region: 'center',
    columnLines:true,
    itemId: 'gridprincipal',
    datos:{},
    // layout: 'border',
    features:[{ftype: 'summary',dock: 'top'}],
    initComponent: function () {
        this.createBody();
        this.callParent();
    },
    createBody: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        me.viewConfig = {
            stripeRows: false,
            markDirty: false,
            getRowClass: function (record) {
                estilo='';
                if(record.get('ensolicitud')==true){
                    estilo= 'correcto';
                }else if(record.get('ensolicitud')==false){
                    estilo= 'eliminado';
                }
                // console.log('->', record.get('codigo'), estilo, record.get('ensolicitud'))
                return estilo;
            }
        }


        me.fieldsFijas = [
            'idindicador', 'codigo', 'denominacion', 'ensolicitud', 'datosmonedas',
            {name:'cant_ultimacompra', type: 'float'},
            {name:'precio_ultimacompra', type: 'float'},
            {name:'importe_ultimacompra', type: 'float'},
            {name:'moneda_ultimacompra'},
            {name:'idmoneda_ultimacompra'},
        ];
        me.columnasFijas= [
            {
                text: '<b>Código</b>',
                dataIndex: 'codigo',
                minWidth: 80,
                maxWidth: 160,
                hideable:false,
                sortable:false,
                draggable:false,
                flex: 0.2,
                locked:true,
                renderer: function (value, meta, records) {
                    meta.tdAttr='data-qtip="<b>'+me.etiquetas.lbCodigo+':</b> ' + (value?value:'No definido')+'<br>'+
                        '<b>'+me.etiquetas.lbCodigoProveedor+':</b> '+(records.get('codigoproveedor')?records.get('codigoproveedor'):'No definido')+'"';
                    return value;
                },
                summaryType: 'count',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return (value !== 0?'<b>Totales:</b> '+value:'');
                }
            },
            {
                text: '<b>Denominacion</b>',
                dataIndex: 'denominacion',
                minWidth: 200,
                flex: 1,
                hideable:false,
                sortable:false,
                draggable:false,
                locked:true,
                renderer: mostrarTooltip
            },
            {text: 'Ultima compra', flex:1,
            columns: me.getColumnasPorDefecto('ultimacompra')},
            // {text: '201', flex:1,
            //     columns: me.getColumnasPorDefecto(210)},
        ];
        me.store= Ext.create('Pliego.store.TodasOfertas',{
            fields: me.fieldsFijas, onlyOneLoad: true,
        });

        function mostrarTooltip (value, meta) {
            if (value) meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }
        me.columns= me.columnasFijas;
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items:[

                    {
                        xtype: 'toggleslidefield',
                        onText: this.etiquetas.lbMostrar0,
                        offText: this.etiquetas.lbNoMostrar0,
                        state: false,
                        itemId: 'mostrar0',
                        boxLabel: 'Mostrar 0',
                        action: 'changemostrar0'
                    },
                    {
                        xtype: 'button',
                        itemId: 'actualizar',
                        iconCls: 'actualizar',
                        tooltip: 'Actualizar vista',
                        disabled: true
                        // action: 'actualizarprincipal'
                    },
                    {
                        text: 'Última compra',
                        tooltip: 'Operaciones última compra',
                        itemId: 'buttonultimacompra',
                        iconCls: 'comprar',
                        disabled: true,
                        menu: [
                            {
                                text: 'Importar datos',
                                itemId: 'importarultimacompra',
                                action: 'importarultimacompra',
                                iconCls: 'importar',
                                tooltip: 'Importar datos de la última compra',
                            },
                            {
                                text: 'Guardar datos',
                                itemId: 'guardarultimacompra',
                                action: 'guardarultimacompra',
                                iconCls: 'guardar',
                                tooltip: 'Guardar los datos de la última compra',
                            }
                        ]
                        // disabled: true
                    },
                    '->',
                    {
                        text: 'Analizar',
                        tooltip: 'Analizar las ofertas',
                        itemId: 'analizar',
                        iconCls: 'icondistra-analisisfinanciero icon-medium',
                        action: 'analizar',
                        disabled: true
                    },
                    {
                        text: 'Generar pliego',
                        tooltip: 'Generar el pliego',
                        itemId: 'exportar',
                        iconCls: 'icondistra-exportar icon-medium',
                        action: 'exportar',
                        disabled: true
                    }
                ]
            },
            // {
            //     xtype: 'pagingtoolbar',
            //     store: me.store,
            //     dock: 'bottom',
            //     pageNumb: true,
            //     displayInfo: true,
            //     comboEntradas:8,
            // }
        ]
    },
    getColumnasPorDefecto: function(atributo){
        var me=this;
        return [
            {text: 'Cant.', tooltip: 'Cantidad', dataIndex: 'cant_'+atributo, width: 45, minWidth: 40, draggable:false, align: 'right',
                //renderer: me.formatoNumero,
                renderer: function(value, meta){
                    // console.log('mostrar0', me.down('#mostrar0').getValue())
                    if (!Ext.isEmpty(value) && !isNaN(value) && (me.down('#mostrar0').getValue()=='true' || value!=0)) {
                        // console.log('entra', value)
                        meta.tdAttr = 'data-qtip="' + parseFloat(value) + '"';
                        return parseFloat(value);
                    }
                },
                summaryType: function(records, dataindex, b){
                    var total=0;
                    records.forEach(function(x){
                        if(x.get(dataindex))
                            total+=parseFloat(x.get(dataindex));
                    });
                    return total;
                }
            },
            {text: 'Precio', tooltip: 'Precio', dataIndex: 'precio_'+atributo,  width: 70, minWidth: 70,draggable:false, align: 'right',
                //renderer: me.formatoMonedas,
                renderer: function(value, meta, record){
                    // console.log('mostrar0', me.down('#mostrar0').getValue())
                    if (!Ext.isEmpty(value) && !isNaN(value) && (me.down('#mostrar0').getValue()=='true' || value!=0)) {
                        // console.log('entra', value)
                        meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(parseFloat(value), '0.000,00/i') + ' <b>'+record.get('moneda_'+atributo)+'</b>"';
                        return Ext.util.Format.number(parseFloat(value), '0.000,00/i');
                    }
                },
                summaryType: function(records, dataindex, b){
                    var total=0;
                    records.forEach(function(x){
                        if(x.get(dataindex))
                            total+=parseFloat(x.get(dataindex));
                    });
                    return total;
                },
                summaryRenderer: function(value, summaryData, dataIndex){
                    // console.log('summaryRenderer:', value, dataIndex, summaryData)
                    // summaryData.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(val) + '<br>' +'"'
                    summaryData.tdAttr = 'data-qtip="' + Ext.util.Format.number(parseFloat(value), '0.000,00/i') +'"';
                    // '<b>Importe</b>:'+me.formatNumber(summaryData.data.preciototal)+'"';
                    return Ext.util.Format.number(parseFloat(value), '0.000,00/i');
                }
            },
            {text: 'Importe', tooltip: 'Importe', dataIndex: 'importe_'+atributo,  width: 70, minWidth: 70,draggable:false, align: 'right',
                // renderer: me.formatoMonedas,
                renderer: function(value, meta, record){
                    // console.log('mostrar0', me.down('#mostrar0').getValue())
                    if (!Ext.isEmpty(value) && !isNaN(value) && (me.down('#mostrar0').getValue()=='true' || value!=0)) {
                        // console.log('entra', value)
                        meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(parseFloat(value), '0.000,00/i') + ' <b>'+record.get('moneda_'+atributo)+'</b>"';
                        return Ext.util.Format.number(parseFloat(value), '0.000,00/i');
                    }
                },
                summaryType: function(records, dataindex){
                    var total=0;
                    records.forEach(function(x){
                        if(x.get(dataindex))
                            total+=parseFloat(x.get(dataindex));
                    });
                    return total;
                },
                summaryRenderer: function(value, summaryData, dataIndex){
                    // console.log('summaryRenderer:', value, dataIndex, summaryData)
                    // summaryData.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(val) + '<br>' +'"'
                    summaryData.tdAttr = 'data-qtip="' + Ext.util.Format.number(parseFloat(value), '0.000,00/i') +'"';
                    // '<b>Importe</b>:'+me.formatNumber(summaryData.data.preciototal)+'"';
                    return Ext.util.Format.number(parseFloat(value), '0.000,00/i');
                }
            },
        ];
    },
    formatoMonedas: function(value, meta){
        // if(isNaN(value) || Ext.isEmpty(value))value=0;
        if (!Ext.isEmpty(value) && !isNaN(value) && value!=0) {
            meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(parseFloat(value), '0.000,00/i') + '"';
            return Ext.util.Format.number(parseFloat(value), '0.000,00/i');
        }
    },
    formatoNumero: function(value, meta){
        // if(isNaN(value) || Ext.isEmpty(value))value=0;
        // var me=this;console.log('mostrar0', me.down('#mostrar0').getValue())
        if (!Ext.isEmpty(value) && !isNaN(value) && ( value!=0)) {
            meta.tdAttr = 'data-qtip="' + parseFloat(value) + '"';
            return parseFloat(value);
        }
    },
});