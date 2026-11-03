Ext.define('Seguimiento.view.WindowSeguimiento', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.s_seguimientowindow',
    layout: 'fit',
    height: 460,
    width: 1000,
    modal: true,
    constrain: true,
    detalles: false,
    defaultFocus: 'codigo',
    resizable: false,
    btnApply: true,
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        var required = '<span style="color:red;font-weight:bold" data-qtip="Obligatorio">*</span>';

        var medio_pago = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'cargarMediosPago'}, ModuleMgr.get('Seguimiento')),
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                },
                extraParams: {idcontrato: me.idcontrato}
            },
            fields: ['idmediodepago', 'nombre', 'denominacion']
        });

        me.items = [
            {
                xtype: 'form',
                trackResetOnLoad: true,
                items: [
                    {
                        xtype: 'tabpanel',
                        itemId: 'tabpanel',
                        layout: 'fit',
                        items: [
                            {
                                title: me.etiquetas.lbInformacionGeneral,
                                frame: true,
                                defaults: {
                                    labelAlign: 'top',
                                    flex: 1,
                                    margin: '5 5 5 5'
                                },
                                items: [
                                    {
                                        xtype: 'container',
                                        layout: 'hbox',
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: me.etiquetas.lbContrato,
                                                labelAlign: 'top',
                                                labelWidth: 60,
                                                itemId: 'contrato',
                                                name: 'contrato',
                                                readOnly: true,
                                                flex: 1,
                                                margin: '5 0 0 3'
                                            },
                                            {
                                                xtype: 'button',
                                                iconCls: 'seleccion',
                                                action: 'seleccioncontrato',
                                                hidden: true,
                                                tooltip: me.etiquetas.lbSeleccionarContrato,
                                                margin: '22 0 0 0',
                                            },
                                            {
                                                xtype: 'button',
                                                iconCls: 'detalles',
                                                action: 'detallescontrato',
                                                tooltip: me.etiquetas.qtipDetailContrato,
                                                margin: '22 3 0 0',
                                            },
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: 'hbox',
                                        defaults: {
                                            labelAlign: 'top',
                                            flex: 1,
                                            margin: '5 3 0 3'
                                        },
                                        items: [
                                            Ext.create('GestionContratoImportacion.view.CmbArea', {
                                                localId: 'idarea',
                                                itemId: 'nombrearea',
                                                name: 'nombrearea',
                                                fieldLabel: me.etiquetas.lbAreaResponsable,
                                                emptyText: 'Seleccione el área responsable...',
                                                // listLoadingText: 'Cargando...',
                                                labelAlign: 'top',
                                                flex: 1,
                                                allowBlank: false,
                                                editable: false
                                            }),
                                            Ext.create('Ext.form.field.Hidden', {
                                                itemId: 'idarea',
                                                name: 'idarea'
                                            }),
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: me.etiquetas.lbCodigo,
                                                name: 'codigo',
                                                maxLength: 30,
                                                readOnly: true,
                                                emptyText: me.etiquetas.lbBlankCodigo,
                                                maxLengthText: me.etiquetas.msgMaximoValorPermitido,
                                                itemId: 'codigo',
                                                allowBlank: false,
                                            },

                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: 'column',
                                        defaults: {
                                            labelAlign: 'top',
                                            flex: 1,
                                            margin: '5 3 0 3'
                                        },
                                        items: [
                                            {
                                                xtype: 'combo',
                                                fieldLabel: me.etiquetas.lbFormaPago,
                                                store: medio_pago,
                                                afterLabelTextTpl: me.detalles ? '' : required,
                                                itemId: 'mediopago',
                                                name: 'mediopago',
                                                displayField: 'nombre',
                                                valueField: 'idmediodepago',
                                                emptyText: 'Seleccione…',
                                                validateOnBlur: true,
                                                enableKeyEvents: true,
                                                pickerrender: false,
                                                multiSelect: false,
                                                queryMode: 'remote',
                                                queryDelay: 400,
                                                minChars: 1,
                                                pageSize: 10,
                                                autoExpand: false,
                                                listLoadingText: 'Cargando...',
                                                listEmptyText: 'No existen datos que mostrar.',
                                                listQtipBtnAdd: 'Adicionar',
                                                listQtipBtnSearch: 'Buscar',
                                                navigateKeys: [9, 27, 35, 36, 36, 37, 38, 39, 40],
                                                columnWidth: .50,
                                                listConfig: {
                                                    loadingText: me.etiquetas.msgLoading,
                                                    emptyText: '<div class="x-grid-empty">' + me.etiquetas.msgVacio + '</div>'
                                                },
                                                validator: function () {
                                                    if (this.findRecord('nombre', this.getRawValue())) {
                                                        return true;
                                                    }
                                                    return me.etiquetas.msgValorInvalidoFormaPago;
                                                }
                                            },
                                            {
                                                xtype: 'textfield',
                                                itemId: 'idformapago',
                                                name: 'idformapago',
                                                allowBlank: false,
                                                hidden: true,
                                            },
                                            {

                                                xtype: 'datefield',
                                                allowBlank: false,
                                                fieldLabel: me.etiquetas.lbFechaRecibo,
                                                itemId: 'fecharecibo',
                                                afterLabelTextTpl: me.detalles ? '' : required,
                                                name: 'fecharecibo',
                                                format: 'd/m/Y',
                                                readOnly: true,
                                                value: me.caso == 'add' ? new Date() : null,
                                                columnWidth: .50,
                                            },
                                            // {
                                            //
                                            //     xtype: 'datefield',
                                            //     allowBlank: false,
                                            //     fieldLabel: 'Fecha estimada',
                                            //     itemId: 'fechaestimada',
                                            //     afterLabelTextTpl: me.detalles ? '' : required,
                                            //     name: 'fecharecibo',
                                            //     format: 'd/m/Y',
                                            //     columnWidth: .25,
                                            //     // value: me.caso == 'add' ? new Date() : null
                                            // },
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'vbox',
                                            align: 'stretch'
                                        },
                                        defaults: {
                                            labelAlign: 'top',
                                            margin: '5 3 0 3'
                                        },
                                        items: [
                                            {
                                                xtype: 'textareafield',
                                                labelAlign: 'top',
                                                afterLabelTextTpl: me.detalles ? '' : required,
                                                allowBlank: false,
                                                height: 196,
                                                maxLength: 255,
                                                lengthText: me.etiquetas.msgMaximoValorPermitido,
                                                name: 'descripcion',
                                                itemId: 'descripcion',
                                                fieldLabel: me.etiquetas.lbDescripcion,
                                                readOnly: me.detalles,
                                            },

                                        ]
                                    },
                                ]
                            },
                            {
                                title: 'Pedidos',
                                itemId: 'tabpedido',
                                dockedItems:[{
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        {
                                            text: 'Ver detalles',
                                            tooltip: 'Ves detalle del pedido',
                                            itemId: 'detallepedidoseguimiento',
                                            action: 'detallepedidoseguimiento',
                                            iconCls: 'detalles',
                                            disabled: true,

                                        },
                                        {
                                            text: 'Generar facturas',
                                            tooltip: 'Generar facturas',
                                            itemId: 'generarfacturas',
                                            action: 'generarfacturas',
                                            iconCls: 'gestionarfacturas',
                                            disabled: true,
                                            hidden: me.action=='mod',
                                        },
                                        {
                                            text: 'Comparar',
                                            tooltip: 'Comparar',
                                            itemId: 'comparar',
                                            iconCls: 'comparar',
                                            menu: [
                                                {
                                                    text: 'Con contrato',
                                                    tooltip: 'Comparar con los productos del contrato',
                                                    itemId: 'compararcontrato',
                                                    action: 'compararcontrato',
                                                    iconCls: 'comparar',
                                                    disabled: true,
                                                    // hidden: me.action=='mod',
                                                },
                                                {
                                                    text: 'Con pedidos',
                                                    tooltip: 'Comparar con los pedidos seleccionados',
                                                    itemId: 'compararpedido',
                                                    action: 'compararpedido',
                                                    iconCls: 'comparar',
                                                    disabled: true,
                                                    // hidden: me.action=='mod',
                                                }
                                            ]
                                        },

                                    // {
                                    //     text: 'Generar facturas por separado',
                                    //     tooltip: 'Generar facturas por separado de cada producto',
                                    //     itemId: 'generarfacturasseparado',
                                    //     action: 'generarfacturasseparado',
                                    //     iconCls: 'gestionarfacturas',
                                    //     disabled: true
                                    // }
                                ]}],
                                items: [
                                    Ext.create('GestionContratoImportacion.view.GridPedidos',{
                                        itemId: 'gridpedidosseguimiento',
                                        mostrarToolbar: false,
                                        height: 343,
                                        listeners:{
                                            selectionchange: function(yo, records){
                                                me.down('#compararpedido').setDisabled(records.length==0);
                                            }
                                        }
                                        // height: 310,
                                    })
                                ]
                            },
                            {
                                title: 'Productos',
                                itemId: 'tabproductos',
                                disabled: true,
                                layout: 'fit',
                                items: [
                                    Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
                                        itemId: 'gridproductos',
                                        flex: 1,
                                        editGrid: false,
                                        sinAcciones: true,
                                        monedasentidad: me.extrafields,
                                        // comprobarProductos: false,
                                        visibleColumns: ['numero', 'codigo', 'denominacion', 'cantidad',
                                            'total', 'importe', 'tipo', 'monedas'],
                                    })
                                ]
                            },
                            {
                                title: me.etiquetas.lbFacturas + (me.detalles ? '' : ' '
                                    + '<span style="color:red;font-weight:bold" data-qtip="' +
                                    me.etiquetas.lbFacturasObligatorio + '">*</span>'),
                                itemId: 'tabfacturas',
                                layout: {type: 'vbox', align: 'stretch'},
                                // disabled: me.action=='add',
                                items: [
                                    Ext.create('Seguimiento.view.GridFactura', {
                                        selType: me.detalles ? 'rowmodel' : 'checkboxmodel',
                                        detalles: me.detalles,
                                        extrafields: me.extrafields,
                                        monedas_contrato: me.monedas_contrato,
                                        montos: me.montos, caso: me.caso,
                                        flex: 1, height: 220
                                    }),
                                    {
                                        xtype: 'panel',
                                        frame: true,
                                        items: [
                                            {
                                                xtype: 'fieldset',
                                                title: me.etiquetas.lbImportesAPagar,
                                                itemId: 'totalesAPagar',
                                                anchor: '100%',
                                                layout: 'hbox',
                                                defaults: {
                                                    labelAlign: 'top',
                                                    readOnly: true,
                                                    flex: 1,
                                                    xtype: 'textfield',
                                                    margin: '0 2 5 2',
                                                    value: 0,
                                                    thousandSeparator: '.',
                                                    decimalSeparator: ',',
                                                    decimalPrecision: 2,
                                                    allowExponential: true
                                                }
                                            },
                                            {
                                                xtype: 'fieldset',
                                                title: me.etiquetas.lbImportesContrato,
                                                itemId: 'totalesContratos',
                                                anchor: '100%',
                                                layout: 'hbox',
                                                defaults: {
                                                    labelAlign: 'top',
                                                    readOnly: true,
                                                    flex: 1,
                                                    xtype: 'textfield',
                                                    margin: '0 2 5 2',
                                                    value: 0,
                                                    thousandSeparator: '.',
                                                    decimalSeparator: ',',
                                                    decimalPrecision: 2,
                                                    allowExponential: true
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        itemId: 'documentos_adjuntados',
                                        hidden: true
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'idarribo',
                        name: 'idarribo',
                        hidden: true
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'idcontrato',
                        name: 'idcontrato',
                        hidden: true
                    },
                    {
                        xtype: 'textfield',
                        hidden: true,
                        itemId: 'facturasvalido',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        hidden: true,
                        itemId: 'facturasdirty'
                    },
                    // {
                    //     xtype: 'textfield',
                    //     hidden: true,
                    //     itemId: 'objetivosvalido',
                    //     allowBlank: false
                    // },
                    // {
                    //     xtype: 'textfield',
                    //     itemId: 'hitos',
                    //     name: 'hitos',
                    //     hidden: true,
                    //     value: '[]'
                    // },
                    {
                        xtype: 'textfield',
                        itemId: 'indicadores',
                        name: 'indicadores',
                        hidden: true,
                        value: '[]'
                    },
                ]
            }
        ];
        me.configurarMontos = function () {
            if (me.extrafields) {
                me.extrafields.forEach(function (obj) {
                    var contrato = 0, montorestante = 0, montoseguimiento = 0, textfieldimporte = null;
                    if (me.monedas_contrato)
                        me.monedas_contrato.forEach(function (x) {
                            if (obj['idmonedaentidad'] == x['idmonedaentidad']) {
                                contrato = x['monto'];
                                montorestante = x['montorestante'];
                            }
                        });
                    if (me.down('#totalesContratos').down('#montocontrato' + obj['codigoiso'].toLowerCase())) {
                        me.down('#totalesContratos').down('#montocontrato' + obj['codigoiso'].toLowerCase()).setValue(Ext.util.Format.currency(contrato));
                    } else {
                        me.down('#totalesContratos').add({
                            fieldLabel: obj['codigoiso'],
                            fieldStyle: 'text-align: right;',
                            itemId: 'montocontrato' + obj['codigoiso'].toLowerCase(),
                            name: 'montocontrato' + obj['codigoiso'].toLowerCase(),
                            value: Ext.util.Format.currency(contrato),
                        });
                    }
                    var textfieldimporte = me.down('#totalesAPagar').down('#importepagar' + obj['codigoiso'].toLowerCase());
                    if (!textfieldimporte)
                        me.down('#totalesAPagar').add({
                            fieldLabel: obj['codigoiso'],
                            fieldStyle: 'text-align: right;',
                            itemId: 'importepagar' + obj['codigoiso'].toLowerCase(),
                            name: 'importepagar' + obj['codigoiso'].toLowerCase(),
                            value: Ext.util.Format.currency(montoseguimiento),
                            maxValue: montorestante,
                            maxText: montorestante ? me.etiquetas.msgValorContratoExcedido + ' (' + Ext.util.Format.currency(moneda) + ')' : ''
                        });
                    textfieldimporte = me.down('#totalesAPagar').down('#importepagar' + obj['codigoiso'].toLowerCase());
                    if (montorestante < parseFloat(textfieldimporte.getValue()))
                        textfieldimporte.markInvalid(me.etiquetas.msgValorContratoExcedido + ' (' + Ext.util.Format.currency(moneda) + ')');
                });
            }
        }
        me.buttons = [me.btnCancelar, me.btnAplicar, me.btnAceptar];
        me.callParent();
        me.down('#gridfactura').getStore().on('datachanged', function (store) {
            if (me.down('#facturasvalido'))
                me.down('#facturasvalido').setRawValue(store.getCount() == 0 ? '' : 'validos');
            me.down('form').fireEvent('validitychange', me.down('form'), !me.down('form').hasInvalidField());
        });
        // me.down('#gridpedidosseguimiento').getStore().on('datachanged', function(yo){
        //     me.down('#compararpedido').setDisabled
        // })
        me.configurarMontos();


    }
});