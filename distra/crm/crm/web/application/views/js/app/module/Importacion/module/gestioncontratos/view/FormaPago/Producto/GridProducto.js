// !!!!!!!!!!!  COMPONENTE GENERICO CONSULTAR PARA CAMBIAR  !!!!!!!!!!!!!!
Ext.define('GestionContratoImportacion.view.FormaPago.Producto.GridProducto', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridproductoimportacion',
    region: 'center',
    // selType: 'checkboxmodel',
    layout: 'column',
    itemId: 'gridindicadores',
    selType: 'rowmodel',
    // autoScroll: true,
    overflowX: 'auto',
    overflowY: 'auto',
    datosLoad: [],
    selModel: {mode: 'MULTI'},
    sinAcciones: false, // true para ocultar los botones
    sinToolbar: false, // true para ocultar el toolbar
    editGrid: true, // true se pueden editar los valores del grid haciendo doble clic
    desdeSeguimiento: false, // true si estas desde seguimiento
    buttonServ: true, // mostrar boton de servicio
    buttonImp: false, // mostrar boton de importar
    buttonExp: false, // mostrar boton de exportar
    buttonTasaCambio: false, // mostrar boton de tasa cambio
    addDatosAdicionales: true, //permite adicionar datos adicionales
    mostrarDatosAdicionales: false, //permite mostrar los datos adicionales
    montosMonedas: true, // para mostrar los montos de las monedas
    totales: false, //solo mostrar totalse
    reordenarItems: true, // para reorganizar los items a un cambio
    comprobarProductos: true,
    ordenInicial: false,
    summaryTotales: {},
    monedasUsadas: [],
    // summaryTotales: {'preciototal': 0, 'preciodivisatotal': 0},
    hiddeableVisibleColumns: true,  // poder mostrar ocultar columnas no visibles
    visibleColumns: ['numero', 'codigo', 'denominacion', 'cantidad',
        , 'precio', 'preciodivisa', 'total', 'importe', 'tipo', 'monedas'], //'unidadmedida'
    plugins: [
        {
            ptype: 'rowexpander',
            expandOnDblClick: false,
            rowBodyTpl: new Ext.XTemplate(
                '<div><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ' +
                '</b> {datos_json_encode}</div>'
            ),
        }
    ],

    features: [
        {
            ftype: 'summary',
            dock: 'top'
        }
    ],
    requires: ['Ext.ux.SearchField'],
    initComponent: function () {
        var me = this;
        if (!me.sinAcciones && me.selType == 'rowmodel')
            me.selType = 'checkboxmodel';
        // me.storeId = 'indicadorStoreImportacion';
        me.etiquetas = LangMgr.getLang(me);
        Ext.require([
            'Ext.grid.*',
        ]);
//         me.selModel = {mode: 'MULTI'};

        // me.frame = false;
        me.border = false;
        me.viewConfig = {
            stripeRows: false,
            getRowClass: function (record) {
                estilo = '';
                if(!Ext.isEmpty(record.get('estilo'))){
                    estilo=record.get('estilo');
                }
                else if (record.get('activo') === true) {
                    estilo
                } else if (record.get('activo') === false) {
                    estilo = 'eliminado';
                } else if (record.get('correcto') === true) {
                    estilo = 'correcto';
                } else if (record.get('correcto') === false) {
                    estilo = 'incorrecto';
                }
                // console.log('->', record.get('codigo'), estilo, record.get('activo'))
                return estilo;
            }
        }
        // me.plugins.push(
        //     {
        //         ptype: 'rowexpander',
        //         rowBodyTpl : new Ext.XTemplate(
        //             '<span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ' +
        //             ':</b> {datos_json_encode}</span>'
        //         ),
        //     }
        // );
        // if(me.totales){
        //     me.features=[
        //         {
        //             ftype: 'summary',
        //             dock: 'top'
        //         }
        //     ];
        // }
        me.store = Ext.create('Ext.data.Store', {
            storeId: me.indicadorStoreId || 'indicadorStoreImportacion',
            grid: me,
            fields: [
                {name: 'idindicadorcontrato'},
                {name: 'idproductoarribo'},
                {name: 'idindicador'},
                {name: 'idactividad', type: 'int'},
                {name: 'codigo', type: 'string'},
                {name: 'codigoproveedor', type: 'string'},
                {name: 'denominacion', type: 'string'},
                {name: 'cantidad', type: 'float'},
                {name: 'cantidad_max', type: 'float'},
                {name: 'unidadmedida'},
                {name: 'monto', type: 'float'},
                {name: 'precio', type: 'float'},
                {name: 'preciodivisa', type: 'float'},
                {name: 'preciototal', type: 'float'},
                {name: 'preciodivisatotal', type: 'float'},
                {name: 'monto', type: 'float'},
                {name: 'tipo', type: 'float'},
                {name: 'numero', type: 'int', persist: false},
                {name: 'numero_' + me.itemId, type: 'int', persist: false},
                'datos_json', 'datos_json_encode', 'detalles',
                'idtasa', 'venta', 'fechaconversion', 'tasas',
                'idmonedaoriginal', 'estilo', 'correcto', 'activo'
            ],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    idProperty: 'idindicadorcontrato'
                }
            },
            originalValue: '[]',
            listeners: {
                update: function (yo) {
                    // console.log('update productos:', me.itemId)
                    if (me.up('window')) {
                        if (me.up('window').extrafields)
                            Ext.each(me.up('window').extrafields, function (value, index) {
                                var win = me.up('window').formaPago ? me.up('window').formaPago : me.up('window'),
                                    actual = win.down('#montomoneda_' + value.codigoiso.toLowerCase());
                                if (actual) {
                                    // if(!actual.introducidoManual)
                                    win.cambiarMontosPorHitosIndicadores()
                                    actual.validate();
                                }
                            });
                        if (me.up('window').formaPago) {
                            if (me.up('window').formaPago.hitopago)
                                if (me.up('window').formaPago.hitopago.getStore().getCount() == 0)
                                    me.up('window').formaPago.hitopago.setDisabled(yo.getCount() > 0);

                        }
                    }
                    // me.reordenarItemsFuncion();

                },
                add: function (yo) {
                    // console.log('add productos:', me.itemId)
                    me.reordenarItemsFuncion();
                },
                remove: function (yo) {
                    // console.log('remove productos:', me.itemId)
                    me.reordenarItemsFuncion();
                },
                datachanged: function (yo) {
                    // console.log('datachasnge productos:', yo.getCount(), yo.getRange())
                    me.reordenarItemsFuncion();



                    // });
                    // if(tienenvalores.length>0)tienenvalores.forEach(function(x){me.hideColumna(x)};
                    //     Ext.each(me.up('window').extrafields, function (value, index) {
                    //         if(me.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase())){
                    //             me.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase()).validate();
                    //         }
                    //     });
                    //     if(me.up('window').formaPago)
                    //         if(me.up('window').formaPago.hitopago)
                    //             if(me.up('window').formaPago.hitopago.getStore().getCount()==0)
                    //                 me.up('window').formaPago.hitopago.setDisabled(yo.getCount()>0);
                },
                loaddata: function(yo){
                    console.log('LOADDATA')
                    var nuevascolumnas=[], nuevasdataindexcolumnas=[], nuevaskey=[],
                        fields = yo.model.getFields();

                    if(yo.getRange().length>0){
                        me.monedasUsadas=[];
                        console.log('Ocultar columnas monedas sin uso->')
                        Ext.Object.each(yo.getAt(0).data, function(key, value) {
                            if (key.indexOf('montomoneda_') == 0) {
                                var todocero = yo.getRange().every(function(x){return x.get(key)==0});
                                // console.log(key, value, value==0, value=='0', todocero)
                                if(todocero && !me.editGrid)me.hideColumna(key);
                                if(!todocero)me.monedasUsadas.push({'codigoiso': key.split('_')[1].toUpperCase(), 'idmoneda': key.split('_')[2]});
                            }
                        })

                        fields.forEach(function(x){
                            nuevaskey.push(x.name);
                        })
                        if(yo.getAt(0).get('fechaconversion')) {
                            Ext.each(yo.getRange(), function (item) {
                                Ext.Object.each(item.raw, function (key, value) {
                                    if (key.indexOf('montomonedaconversion_') == 0) {
                                        me.monedasUsadas = [];
                                        var aux = key.split('_');
                                        // console.log('key:', key)
                                        var findedcolumn = me.findColumna(key);
                                        // console.log('column:', findedcolumn)
                                        if (findedcolumn) me.showColumna(key);
                                        me.monedasUsadas.push({
                                            'codigoiso': key.split('_')[1].toUpperCase(),
                                            'idmoneda': key.split('_')[2]
                                        });
                                        if (nuevaskey.indexOf(key) == -1) {
                                            nuevaskey.push(key);
                                            fields.push({name: key, type: 'float', defaultValue: 0});
                                            if (!findedcolumn)
                                                nuevascolumnas.push(me.crearColumnaConversion(aux[1].toUpperCase(), aux[2]));
                                        }

                                    }
                                })
                            })
                        }
                    }
                    console.log('monedsUsadas:', me.monedasUsadas, 'nuevascolumnas:', nuevascolumnas, 'fields:', fields)
                    yo.model.setFields(fields);
                    if(nuevascolumnas.length>0)me.agregarColumnasConversion(nuevascolumnas);
                }
            }
        });
        if (me.editGrid)
            me.plugins.push(
                new Ext.grid.plugin.CellEditing({
                    clicksToEdit: 1,
                    listeners: {
                        edit: function (yo, obj) {
                            Ext.each(me.up('window').extrafields, function (field, index) {
                                var win = me.up('window').formaPago ? me.up('window').formaPago : me.up('window'),
                                    actual = win.down('#montomoneda_' + field.codigoiso.toLowerCase());
                                if (actual) {
                                    // if(!actual.introducidoManual)
                                    win.cambiarMontosPorHitosIndicadores()
                                }
                            });
                            obj.record.set('preciototal',
                                parseFloat(obj.record.get('precio')) * parseFloat(obj.record.get('cantidad')));
                            obj.record.set('preciodivisatotal',
                                parseFloat(obj.record.get('preciodivisa')) * parseFloat(obj.record.get('cantidad')));
                        }
                    }
                })
            );

        var columnas=[
            {
                text: '#',
                tooltip: 'Item',
                dataIndex: me.reordenarItems ? 'numero' : 'numero_' + me.itemId,
                width: 30,
                align: 'center',
                renderer: function (value, meta) {
                    meta.tdAttr = 'style="background-color: #E0E1E2; font-weight: bold"';
                    return '<b>' + value + '</b>';
                }
                // hidden: me.visibleColumns.indexOf('numero')==-1
            },
        ];

        if(me.visibleColumns.indexOf('codigo')!=-1)
            columnas.push({
                text: me.etiquetas.lbCodigo,
                dataIndex: 'codigo',
                minWidth: 60,
                maxWidth: 110,
                hidden: me.visibleColumns.indexOf('codigo') == -1,
                hideable: false,
                flex: 0.1,
                renderer: function (value, meta, records) {
                    // meta.tdAttr='data-qtip="<b>'+me.etiquetas.lbCodigoProveedor+':</b> ' + (value?value:'No definido')+'<br>'+
                    //     '<b>'+me.etiquetas.lbCodigo+':</b> '+(records.get('codigo')?records.get('codigo'):'No definido')+'"';
                    meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                },
                summaryType: 'count',
                summaryRenderer: function (value, summaryData, dataIndex) {
                    return (value !== 0 ? '<b>Totales:</b> ' + value : '');
                }
            });

        columnas.push({
            text: me.etiquetas.lbDescripcion,
            dataIndex: 'denominacion',
            minWidth: 60,
            flex: 0.3,
            hideable: false,
            renderer: function (value, meta) {
                if (value) {
                    meta.tdAttr = 'data-qtip="' + value + '"';
                }
                return value;
            }
        });

        if(me.visibleColumns.indexOf('cantidad') != -1 || me.hiddeableVisibleColumns)
            columnas.push({
                text: 'Cantidad',
                minWidth: 50,
                width: 65,
                align: 'right',
                dataIndex: 'cantidad',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    maxLength: 19,
                    decimalSeparator: '.',
                    allowDecimals: false,
                    allowExponential: false
                },
                hideable: me.hiddeableVisibleColumns,
                hidden: me.visibleColumns.indexOf('cantidad') == -1,
                renderer: function (value, meta) {
                    if (value) {
                        // value = me.formatNumber(value);
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                summaryType: function (records, dataindex, b) {
                    var total = 0;
                    records.forEach(function (x) {
                        if (x.get(dataindex))
                            total += parseFloat(x.get(dataindex));
                    });
                    return total;
                }
            });

        if(me.visibleColumns.indexOf('cantidad_max') != -1)
            columnas.push({
                text: 'Restante',
                minWidth: 50,
                width: 60,
                align: 'right',
                dataIndex: 'cantidad_max',
                hideable: me.hiddeableVisibleColumns,
                hidden: me.visibleColumns.indexOf('cantidad_max') == -1,
            });

        if(me.visibleColumns.indexOf('unidadmedida') != -1 || me.hiddeableVisibleColumns)
            columnas.push({
                text: 'Unidad de medida',
                minWidth: 70,
                width: 100,
                dataIndex: 'unidadmedida',
                hideable: me.hiddeableVisibleColumns,
                hidden: me.visibleColumns.indexOf('unidadmedida') == -1,
                renderer: function (value, meta) {
                    if (!Ext.isEmpty(value)) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            });

        if(me.monedasentidad){
            me.monedasentidad.forEach(function(field){
                me.summaryTotales['montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda]=0;
                var fields=me.getStore().model.getFields();
                fields.push({name: 'montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda, type: 'float', defaultValue: 0});
                me.getStore().model.setFields(fields);
                columnas.push(me.crearColumnaMoneda(field.codigoiso, field.idmoneda, me.visibleColumns.indexOf('monedas') == -1));

            })
            // console.log('boton tasa', me.buttonTasaCambio);
            // if(me.buttonTasaCambio){
            me.monedasentidad.forEach(function(field){
                var fields=me.getStore().model.getFields();
                fields.push({name: 'montomonedaconversion_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda, type: 'float', defaultValue: 0});
                me.getStore().model.setFields(fields);
                columnas.push(me.crearColumnaConversion(field.codigoiso, field.idmoneda, true));
            })
            // }
        }

        if(me.visibleColumns.indexOf('monto') != -1 || me.hiddeableVisibleColumns)
            columnas.push({
                text: 'Monto',
                dataIndex: 'monto',
                flex: 0.1,
                align: 'right',
                minWidth: 70,
                maxWidth: 110,
                hideable: me.hiddeableVisibleColumns,
                hidden: me.visibleColumns.indexOf('monto') == -1,
                editor: Ext.create('Ext.ux.MoneyField',{
                        // xtype: 'numberfield',
                        allowBlank: false,
                        minValue: 0,
                        decimalPrecision: 2,
                        maxLength: 19,
                        decimalSeparator: ',',
                        allowDecimals: true,
                        allowExponential: false,
                }),
                renderer: function (value, meta, record) {
                    if (!Ext.isEmpty(value)) {
                        value = me.formatNumber(value);
                        meta.tdAttr = 'data-qtip="<b>Monto</b>: ' + value + '"';
                    }
                    return value;
                },
                summaryType: function (records, dataindex) {
                    // console.log('summaryType', records, dataindex)
                    var total = 0, totalImporte = 0;
                    records.forEach(function (x) {
                        if (x.get(dataindex)) {
                            total += parseFloat(x.get(dataindex));
                            totalImporte += parseFloat(x.get('cantidad')) * parseFloat(x.get(dataindex));
                        }
                    });
                    me.summaryTotales[dataindex] = totalImporte;
                    // console.log('summaryType', dataindex, totalImporte, me.summaryTotales)
                    return total;
                },
                summaryRenderer: function (value, summaryData, dataIndex, e) {
                    // console.log('summaryRenderer:', value, summaryData, dataIndex, e)
                    // summaryData.tdAttr = 'data-qtip="<b>Monto</b>:' + me.formatNumber(value) + '<br>' +
                    //     '<b>Importe</b>:' + me.formatNumber(me.summaryTotales[dataindex]) + '"';
                    return me.formatNumber(value);
                }
            })


        if(me.visibleColumns.indexOf('total') != -1 || me.hiddeableVisibleColumns)
            columnas.push({
                text: 'Total',
                flex: 0.1,
                align: 'right',
                minWidth: 70,
                maxWidth: 110,
                hideable: me.hiddeableVisibleColumns,
                hidden: me.visibleColumns.indexOf('total') == -1,
                renderer:
                    function (value, meta, record) {
                        var suma = 0;
                        // if (!Ext.isEmpty(record.get('precio'))) {
                        //     suma += parseFloat(record.get('precio'));
                        //     // importe += parseFloat(record.get('precio'))*parseFloat(record.get('cantidad'));
                        // }
                        // if (!Ext.isEmpty(record.get('preciodivisa'))) {
                        //     suma += parseFloat(record.get('preciodivisa'));
                        //     // importe += parseFloat(record.get('preciodivisa'))*parseFloat(record.get('cantidad'));
                        // }
                        var tipomoneda='montomoneda_';
                        if(record.get('fechaconversion'))tipomoneda='montomonedaconversion_';
                        if(me.monedasentidad)
                            me.monedasentidad.forEach(function(field){
                                suma+=parseFloat(record.get(tipomoneda+field.codigoiso.toLowerCase() + '_' + field.idmoneda));
                            })
                        else
                            suma=parseFloat(record.get('monto'));
                        // meta.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(suma)+ '<br>' +
                        //     '<b>Importe</b>:'+me.formatNumber(parseFloat(importe))+'"';
                        value = me.formatNumber(suma);
                        meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    },
                summaryType: function (records, dataindex, b) {
                    var total = 0;
                    records.forEach(function (x) {
                        var suma=0;
                        if(me.monedasentidad)
                            me.monedasentidad.forEach(function(field){
                                var tipomoneda='montomoneda_';
                                if(x.get('fechaconversion'))tipomoneda='montomonedaconversion_';
                                suma += parseFloat(x.get(tipomoneda + field.codigoiso.toLowerCase() + '_' + field.idmoneda));
                            })
                            else
                                suma=parseFloat(x.get('monto'));
                        total += suma;
                    });
                    // console.log('total:', total)
                    return total;
                },
                summaryRenderer: function (val, summaryData, dataIndex) {
                    // console.log('summaryRenderer:', val, dataIndex, summaryData)
                    // summaryData.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(val) + '<br>' +'"'
                    summaryData.tdAttr = 'data-qtip="' + me.formatNumber(val) + '"';
                    // '<b>Importe</b>:'+me.formatNumber(summaryData.data.preciototal)+'"';
                    return me.formatNumber(val);
                }
            });

        if(me.visibleColumns.indexOf('importe') != -1 || me.hiddeableVisibleColumns)
            columnas.push({
                text: 'Importe',
                // dataIndex:'preciototal',
                flex: 0.1,
                align: 'right',
                minWidth: 70,
                maxWidth: 110,
                hideable: me.hiddeableVisibleColumns,
                hidden: me.visibleColumns.indexOf('importe') == -1,
                // hideable:false,
                // hidden:true,
                renderer: function (value, meta, record) {
                    var suma = 0, importe = 0;
                    // if (!Ext.isEmpty(record.get('precio'))) {
                    //     importe += parseFloat(record.get('precio')) * parseFloat(record.get('cantidad'));
                    // }
                    // if (!Ext.isEmpty(record.get('preciodivisa'))) {
                    //     importe += parseFloat(record.get('preciodivisa')) * parseFloat(record.get('cantidad'));
                    // }
                    var tipomoneda='montomoneda_';
                    if(record.get('fechaconversion'))tipomoneda='montomonedaconversion_';
                    if(me.monedasentidad)
                        me.monedasentidad.forEach(function(field){
                            importe+=parseFloat(record.get(tipomoneda+field.codigoiso.toLowerCase() + '_' + field.idmoneda))*parseFloat(record.get('cantidad'));
                        })
                    else
                        importe=parseFloat(record.get('monto'))*parseFloat(record.get('cantidad'));
                    // meta.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(suma)+ '<br>' +
                    //     '<b>Importe</b>:'+me.formatNumber(parseFloat(importe))+'"';
                    meta.tdAttr = 'data-qtip="' + me.formatNumber(importe) + '"';
                    return me.formatNumber(importe);
                },
                summaryType: function (records, dataindex) {
                    var importe = 0;
                    records.forEach(function (x) {
                        var suma=0;
                        if(me.monedasentidad)
                            me.monedasentidad.forEach(function(field){
                                var tipomoneda='montomoneda_';
                                if(x.get('fechaconversion'))tipomoneda='montomonedaconversion_';
                                suma+=parseFloat(x.get(tipomoneda+field.codigoiso.toLowerCase() + '_' + field.idmoneda))*parseFloat(x.get('cantidad'));
                            })
                        else
                            suma=parseFloat(x.get('monto'))*parseFloat(x.get('cantidad'));
                        importe += suma;
                    });
                    return importe;
                },
                summaryRenderer: function (val, meta) {
                    meta.tdAttr = 'data-qtip="' + me.formatNumber(val) + '"';
                    return me.formatNumber(val);
                }
            });

        if(me.visibleColumns.indexOf('tipo') != -1 || me.hiddeableVisibleColumns)
            columnas.push({
                text: 'Tipo',
                dataIndex: 'tipo',
                width: 42,
                hideable: me.hiddeableVisibleColumns,
                hidden: me.visibleColumns.indexOf('tipo') == -1,
                renderer: this.rendererClasificacion
            });

        if(me.editGrid && me.addDatosAdicionales)
            columnas.push({
                xtype: 'actioncolumn',
                width: 25,
                align: 'center',
                hideable: false,
                hidden: !(me.editGrid && me.addDatosAdicionales),
                items:
                    [{
                        iconCls: 'icondistra-adicionar icon-medium',
                        // cls: 'alert-col',
                        tooltip: 'Adicionar datos',
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            // alert("Edit " + rec.get('denominacion'));
                            var win = Ext.create('Ext.window.Window', {
                                title: 'Datos adicionales',
                                width: 500,
                                height: 200,
                                layout: 'fit',
                                modal: true,
                                resizable: false,
                                draggable: false,
                                constrain: true,
                                defaultFocus: 'datosadicionales',
                                items: [
                                    Ext.create('Ext.form.field.TextArea', {
                                        // maxLength: 255,
                                        // maxLengthText: 'El campo no debe exceder los 255 caracteres.',
                                        itemId: 'datosadicionales'
                                    })
                                ],
                                buttons: [
                                    {
                                        iconCls: 'icondistra-cerrar icon-medium',
                                        text: 'Cerrar',
                                        tooltip: 'Cerrar',
                                        handler: function () {
                                            win.close();
                                        }
                                    },
                                    {
                                        iconCls: 'guardar',
                                        text: 'Guardar',
                                        tooltip: 'Guardar datos adicionales',
                                        handler: function () {
                                            grid.getStore().getAt(rowIndex).set('datos_json', win.items.first().getValue());
                                            grid.getStore().getAt(rowIndex).set('datos_json_encode', win.items.first().getValue());
                                            win.close();
                                        }
                                    }

                                ]
                            }).showAt(window.event.clientX - 500, (window.event.clientY - 200) > 0 ? window.event.clientY - 200 : window.event.clientY, true)
                            win.items.first().setValue(grid.getStore().getAt(rowIndex).get('datos_json_encode'));

                        }
                    }]
            });

        me.columns=columnas;

        me.columns1 = [
            // {xtype: 'rownumberer', text: 'Item', tooltip:'Item', width:30},


            {
                text: 'CUP',
                flex: 0.1,
                align: 'right',
                minWidth: 40,
                maxWidth: 120,
                dataIndex: 'precio',
                hideable: !me.montosMonedas || me.visibleColumns.indexOf('precio') == -1,
                hidden: !me.montosMonedas || me.visibleColumns.indexOf('precio') == -1,
                editor: me.desdeSeguimiento ? '' :
                {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 2,
                    maxLength: 19,
                    decimalSeparator: ',',
                    allowDecimals: true,
                    allowExponential: false,
                },
                renderer: function (value, meta, record) {
                    if (!Ext.isEmpty(value)) {
                        meta.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(value) + '<br>' +
                            '<b>Importe</b>:' + me.formatNumber(parseFloat(value) * parseFloat(record.get('cantidad'))) + '"';
                        value = me.formatNumber(value);
                    }
                    return value;
                },
                summaryType: function (records, dataindex) {
                    // console.log('summaryType', records, dataindex)
                    var total = 0, totalImporte = 0;
                    records.forEach(function (x) {
                        if (x.get(dataindex)) {
                            total += parseFloat(x.get(dataindex));
                            totalImporte += parseFloat(x.get('cantidad')) * parseFloat(x.get(dataindex));
                        }
                    });
                    me.summaryTotales['preciototal'] = totalImporte;
                    return total;
                },
                summaryRenderer: function (value, summaryData, dataIndex) {
                    summaryData.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(value) + '<br>' +
                        '<b>Importe</b>:' + me.formatNumber(me.summaryTotales['preciototal']) + '"';
                    return me.formatNumber(value);
                }
            },
            // {
            //     text: 'CUP total',
            //     dataIndex:'preciototal',
            //     hideable:false,
            //     hidden:true,
            //     summaryType: function(records, dataindex){
            //         console.log('summaryType preciototal',  dataindex)
            //         var total=0;
            //         records.forEach(function(x){
            //             if(x.get(dataindex))
            //                 total+=parseFloat(x.get(dataindex));
            //         });
            //         return total;
            //     }
            // },
            {
                text: 'CUC',
                flex: 0.1,
                align: 'right',
                minWidth: 40,
                maxWidth: 120,
                dataIndex: 'preciodivisa',
                hideable: !me.montosMonedas || me.visibleColumns.indexOf('preciodivisa') == -1,
                hidden: !me.montosMonedas || me.visibleColumns.indexOf('preciodivisa') == -1,
                editor: me.desdeSeguimiento ? '' :
                    {
                        xtype: 'numberfield',
                        allowBlank: false,
                        minValue: 0,
                        decimalPrecision: 2,
                        maxLength: 19,
                        decimalSeparator: ',',
                        allowDecimals: true,
                        allowExponential: false,
                    },
                renderer: function (value, meta, record) {
                        if (!Ext.isEmpty(value)) {
                            meta.tdAttr = 'data-qtip=' +
                                '"<b>Precio</b>: ' + me.formatNumber(value) + '<br>' +
                                '<b>Importe</b>: ' + me.formatNumber(parseFloat(value) * parseFloat(record.get('cantidad'))) + '"';
                            value = me.formatNumber(value);
                        }
                        return value;
                    }

                ,
                summaryType: function (records, dataindex, b) {
                    var total = 0, totalImporte = 0;
                    records.forEach(function (x) {
                        if (x.get(dataindex)) {
                            total += parseFloat(x.get(dataindex));
                            totalImporte += parseFloat(x.get('cantidad')) * parseFloat(x.get(dataindex));
                        }
                    });
                    me.summaryTotales['preciodivisatotal'] = totalImporte;
                    return total;
                }
                ,
                summaryRenderer: function (value, summaryData, dataIndex) {
                    // console.log('summaryRenderer:', value, dataIndex, summaryData)
                    summaryData.tdAttr = 'data-qtip=' +
                        '"<b>Precio</b>: ' + me.formatNumber(value) + '<br>' +
                        '<b>Importe</b>: ' + me.formatNumber(me.summaryTotales['preciodivisatotal']) + '"';
                    return me.formatNumber(value);
                }
            },
            {
                text: 'CUC total',
                dataIndex:'preciodivisatotal',
                hideable:false,
                hidden:true,
                summaryType:function (records, dataindex) {
                        var total = 0;
                        records.forEach(function (x) {
                            if (x.get(dataindex))
                                total += parseFloat(x.get(dataindex));
                        });
                        return total;
                    }
            },

        ];

        if (!me.sinToolbar) {
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
                action: 'addserv',
                hidden: !me.buttonServ,
            });
            me.btnAdd = Ext.create('Ext.Button', {
                iconCls: 'icondistra-adicionar icon-medium',
                text: me.etiquetas.lbAdd,
                hidden: me.sinAcciones,
                tooltip: me.etiquetas.lbAdd + ' ' + me.etiquetas.lbProdServ.toLocaleLowerCase(),
                menu: [me.btnAddProducto, me.btnAddServicio]
            });
            me.btnMod = Ext.create('Ext.Button', {
                iconCls: 'icondistra-modificar icon-medium',
                action: 'modprodserv',
                disabled: true,
                hidden: me.context != 'proveedor' || me.sinAcciones,
                text: me.etiquetas.lbMod,
                tooltip: me.etiquetas.lbMod + ' ' + me.etiquetas.lbProdServSingular.toLocaleLowerCase()
            });
            me.btnDel = Ext.create('Ext.Button', {
                iconCls: 'icondistra-eliminar icon-medium',
                action: 'delprodserv',
                disabled: true,
                hidden: me.sinAcciones,
                text: me.etiquetas.lbDel,
                tooltip: me.etiquetas.lbDel + ' ' + me.etiquetas.lbProdServSingular.toLocaleLowerCase() + ' <b>(DEL)</b>',
                keyMap: {
                    key: 'DEL',
                    alt: false,
                    ctrl: false,
                    shift: false,
                    event: 'click'
                }
            });
            me.btnImp = Ext.create('Ext.Button', {
                iconCls: 'icondistra-importar icon-medium',
                action: 'importarprodserv',
                hidden: !me.buttonImp,
                text: me.etiquetas.lbImp,
                tooltip: me.etiquetas.qtipImp
            });
            me.btnExp = Ext.create('Ext.Button', {
                iconCls: 'icondistra-importar icon-medium',
                action: 'exportarprodserv',
                hidden: !me.buttonExp,
                text: me.etiquetas.lbExp,
                tooltip: me.etiquetas.qtipExp
            });
            me.btnTasaCambio = Ext.create('Ext.Button', {
                iconCls: 'icondistra-importar icon-medium',
                action: 'tasacambio',
                hidden: !me.buttonTasaCambio,
                text: 'Tasa cambio',
                tooltip: 'Realizar cambio'
            });
            me.searchfield = Ext.create('Ext.ux.SearchField', {
                itemId: 'searchfield',
                name: 'searchproductos',
                flex: 1,
                maxWidth: 250,
                minWidth: 150,
                // searchTooltip: me.etiquetas.qtipSearch.get(lbProdServSingular.toLowerCase()),
                listeners: {
                    search: function (yo) {
                        var regExpresion = new RegExp(yo.getValue(), 'gi');
                        me.store.filterBy(function (x) {
                            console.log('->', x.get('denominacion'), regExpresion.test(x.get('denominacion')), regExpresion.test(x.get('codigo')))
                            return regExpresion.test(x.get('denominacion')) || regExpresion.test(x.get('codigo'));
                        });
                    },
                    clear: function () {
                        me.store.clearFilter();
                    }
                },
                keyMap: [
                    {
                        key: 'l',
                        alt: true,
                        ctrl: false,
                        event: 'onclick1'
                    },
                    {
                        key: 'b',
                        alt: true,
                        ctrl: false,
                        event: 'onclick2'
                    }
                ]
            });
            me.tbar = Ext.create('Ext.toolbar.Toolbar', {
                enableOverflow: true,
                hidden: me.sinToolbar,
                items: [me.btnAdd, me.btnMod, me.btnDel, me.btnImp, me.btnExp, me.btnTasaCambio, '->', me.searchfield]
            });
        }

        me.callParent();
    },
    formatNumber: function (value) {
        return Ext.util.Format.number(value, '0.000,00/i')
        // return Ext.util.Format.currency(value);
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
    },
    reordenarItemsFuncion: function () {
        var me = this;
        var cont = 1;
        me.getStore().getRange().forEach(function (x) {
            x.set('numero', cont);
            if (!me.ordenInicial) x.set('numero_' + me.itemId, cont);
            cont++;
        })
        me.ordenInicial = true;
    },
    reordenar: function () {
        var me = this;
        me.getStore().sort('numero', 'DESC');
    },
    crearColumnaMoneda: function(codigoiso, idmoneda, hidden){
        var me=this;
        if(hidden==undefined)hidden=false;
        return {
            dataIndex: 'montomoneda_' + codigoiso.toLowerCase() + '_' + idmoneda,
            text: codigoiso.toUpperCase(),
            width: 80,
            align: 'right',
            hidden: hidden,
            // hideable: !hidden,
            editor: me.desdeSeguimiento ? '' :
                Ext.create('Ext.ux.MoneyField',
                {
                    // xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 2,
                    maxLength: 19,
                    decimalSeparator: ',',
                    allowDecimals: true,
                    allowExponential: false,
                }),
            renderer: function (value, meta, record) {
                if (!Ext.isEmpty(value)) {
                    meta.tdAttr = 'data-qtip="<b>Monto</b>: ' + me.formatNumber(value) + '<br>' +
                        '<b>Importe</b>: ' + me.formatNumber(parseFloat(value) * parseFloat(record.get('cantidad'))) + '"';
                    value = me.formatNumber(value);
                }
                return value;
            },
            summaryType: function (records, dataindex) {
                // console.log('summaryType', records, dataindex)
                var total = 0, totalImporte = 0;
                records.forEach(function (x) {
                    if (x.get(dataindex)) {
                        total += parseFloat(x.get(dataindex));
                        totalImporte += parseFloat(x.get('cantidad')) * parseFloat(x.get(dataindex));
                    }
                });
                me.summaryTotales[dataindex] = totalImporte;
                // console.log('summaryType', dataindex, totalImporte, me.summaryTotales)
                return total;
            },
            summaryRenderer: function (value, summaryData, dataIndex, e) {
                // console.log('summaryRenderer:', value, summaryData, dataIndex, e)
                // summaryData.tdAttr = 'data-qtip="<b>Monto</b>:' + me.formatNumber(value) + '<br>' +
                //     '<b>Importe</b>:' + me.formatNumber(me.summaryTotales[dataindex]) + '"';
                return me.formatNumber(value);
            }
        }
    },
    crearColumnaConversion: function(codigoiso, idmoneda, hidden){
        var me=this;
        if(hidden==undefined)hidden=false;
        return {
            text: 'Conv. ' + codigoiso,
            dataIndex: 'montomonedaconversion_' + codigoiso.toLowerCase()+'_'+idmoneda,
            // flex: 0.1,
            align: 'right',
            minWidth: 40,
            width: 80,
            maxWidth: 120,
            hidden: hidden,
            hideable: !hidden,
            renderer: function (value, meta, record) {
                if (!Ext.isEmpty(value)) {
                    meta.tdAttr = 'data-qtip="<b>Monto</b>:' + me.formatNumber(value) + '<br>' +
                        '<b>Importe</b>:' + me.formatNumber(parseFloat(value) * parseFloat(record.get('cantidad'))) +
                        '<br><b>Conversión</b>:'+record.get('venta')+'"';
                    value = me.formatNumber(value);
                }
                return value;
            },
            summaryType: function (records, dataindex) {
                // console.log('summaryType', records, dataindex)
                var total = 0, totalImporte = 0;
                records.forEach(function (x) {
                    if (x.get(dataindex)) {
                        total += parseFloat(x.get(dataindex));
                        totalImporte += parseFloat(x.get('cantidad')) * parseFloat(x.get(dataindex));
                    }
                });
                // me.summaryTotales[dataindex] = totalImporte;
                return total;
            },
            summaryRenderer: function (value, summaryData, dataIndex) {
                // summaryData.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(value) + '<br>' +
                //     '<b>Importe</b>:' + me.formatNumber(me.summaryTotales[dataindex]) + '"';
                return me.formatNumber(value);
            }
        }
    },
    agregarColumnasConversion: function(nuevascolumnas){
        var me=this, finalColumns=[];
        Ext.each(me.columns,function(x, i){
            if(x.text=='Total')
                finalColumns=finalColumns.concat(nuevascolumnas);
            finalColumns.push(x.initialConfig);
        })
        // console.log('finalColumns:', finalColumns)
        me.reconfigure(null, finalColumns);
    },
    findColumna: function(key){
        var me=this, finded=null;
        Ext.each(me.columns,function(x, i){
            if(x.dataIndex==key){
                finded=x;
                return false;
            }
        });
        return finded;
    },
    showColumna: function(key){
        var me=this, finded=null;
        Ext.each(me.columns, function(x, i){
            if(x.dataIndex==key){
                finded=x;
                x.hideable=true;
                x.show();
                return false;
            }
        });
        console.log('Mostrar columna:', key, finded)
        return finded;
    },
    hideColumna: function(key){
        var me=this, finded=null;
        Ext.each(me.columns, function(x, i){
            if(x.dataIndex==key){
                finded=x;
                x.hideable=true;
                x.hide();
                return false;
            }
        });
        console.log('Ocultar columna:', key, finded)
        return finded;
    }
});
