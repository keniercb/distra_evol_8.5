Ext.define('OfertaNegocioImportacion.view.TabCobros', {
    extend: 'Ext.ux.CustomForm',
    title: 'Cobro',
    layout: 'border',
    itemId: 'formaPago',
    border: false,
    bodyStyle: 'background:#DFE9F6;border:0px !important;padding:5px;',
    autoScroll: false,
    alias: 'widget.tabCobros',
    initComponent: function(){
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.hfMedioPago = Ext.create('Ext.form.field.Hidden', {
            name: 'idmediodepago'
        });

        me.sfMedioPago = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbMedioPago,
            name: 'mediopago',
            mapping: 'NomMedioPago.nombre',
            localIdMulti: 'idmediodepago',
            module: 'Nomencladores',
            noactions: false,
            allowBlank: true,
            columnWidth: 0.33,
            flex: 3,
            margin: '0 10 10 0',
            context: 'gestioncontratomainwindowmediopago',
            filters: {},
            controller: 'gestioncontratomainwindow',
            multiSelect: true,
            hidden: me.soloMonedas,
            pageSize: null
        });

        me.storeCondicionPago = this.store = Ext.create('Ext.data.Store', {
            pageSize: 10,
            fields: [
                {name: 'idcondicionpago', mapping: 'idterminodepago'},
                {name: 'nombre'}
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getCondicionesPago'}, ModuleMgr.get('GestionContratoImportacion')),
                reader: {
                    idProperty: 'idcondicionpago',
                    type: 'json',
                    root: 'data',
                    totalProperty: 'count'
                }
            }
        });

        me.hfCondicionPago = Ext.create('Ext.form.field.Hidden', {
            name: 'idcondicionpago'
        });

        me.condicionPago = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbCondicionPago,
            autoExpand: false,
            store: me.storeCondicionPago,
            valueField: 'nombre',
            displayField: 'nombre',
            name: 'condicionpago',
            columnWidth: 0.33,
            flex: 2,
            minChars: 0,
            pageSize: 10,
            mode: 'remote',
            queryParam: 'denominacion',
            localId: 'idcondicionpago',
            margin: '0 0 10 0',
            hidden: me.soloMonedas
        });

        me.hfdirtygrids = Ext.create('Ext.form.field.Hidden', {
            name: 'dirtygrids'
        });

        me.formItems = [
            {
                xtype: 'container',
                layout: 'hbox',
                columnWidth: 1,
                items:[
                    {
                        xtype: 'fieldset', title: 'Totales', flex: 1,
                        layout: 'hbox', margin: '0 10 0 0',
                        items: [
                            Ext.create('Ext.ux.MoneyField', {
                                fieldLabel: 'Monto total',
                                itemId: 'montototal',
                                name: 'montototal',
                                value: 0,
                                flex: 1,
                                margin: '0 5 10 0',
                                readOnly: true
                            }),
                            {
                                xtype: 'hiddenfield',
                                name: 'idmoneda'
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: 'Convertir a',
                                valueField: 'codigoiso',
                                displayField: 'codigoiso',
                                itemId: 'moneda',
                                name: 'monedaconversion',
                                localId: 'idmoneda',
                                flex: 1,
                                margin: '0 5 10 0',
                                editable: false,
                                allowBlank: false,
                                listConfig: {
                                    loadingText: me.etiquetas.msgLoading,
                                    emptyText: '<div class="x-grid-empty">' + me.etiquetas.msgNoDataLoaded + '</div>'
                                },
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">' +
                                    '{codigoiso} ({nombremoneda})' +
                                    '</div>',
                                    '</tpl>'
                                ),
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        'codigoiso', 'idmoneda', 'nombremoneda', 'idpais',
                                        'organizacion', 'simbolo', 'factorredondeo'
                                    ],
                                    proxy: {
                                        type: 'ajax',
                                        url: UtilsFn.buildUrl({action: 'getMonedas'}, ModuleMgr.get('OfertaNegocioImportacion')),
                                        reader: {
                                            root: 'data',
                                            totalProperty: 'total',
                                            successProperty: 'success'
                                        }
                                    },
                                })
                            },
                            Ext.create('Ext.ux.MoneyField',{
                                // xtype: 'numberfield',
                                fieldLabel: 'Tasa',
                                itemId: 'tasa',
                                name: 'tasa',
                                width: 100,
                                disabled: true,
                                margin: '0 1 10 0',
                                decimalPrecision: 4,
                                decimalSeparator: '.'
                            }),
                            {
                                xtype: 'button',
                                margin: '18 0 0 0',
                                itemId: 'buttonAplicarTasa',
                                action: 'aplicartasa',
                                tooltip: 'Aplicar tasa de cambio',
                                iconCls: 'gestionartasa',
                                disabled: true
                            },
                            {
                                xtype: 'button',
                                margin: '18 5 0 0',
                                itemId: 'buttonCambiarTasa',
                                action: 'cambiartasa',
                                tooltip: 'Cambiar tasa de cambio',
                                iconCls: 'modificar',
                                disabled: true
                            },
                            Ext.create('Ext.ux.MoneyField', {
                                fieldLabel: 'Monto total Alt.',
                                itemId: 'montototalalternativa',
                                name: 'montototalalternativa',
                                value: 0,
                                flex: 1,
                                margin: '0 0 10 0',
                                readOnly: true
                            })
                        ]
                    },
                    {
                        xtype: 'fieldset', title: 'Pago', columnWidth: 0.34, flex: 1,
                        layout: 'hbox', margin: '0 10 0 0',
                        items: [
                            me.hfMedioPago, me.sfMedioPago, me.hfCondicionPago, me.condicionPago
                        ]
                    },
                    me.hfdirtygrids
                ]
            },
        ];

        me.topForm = Ext.create('Ext.form.Panel', {
            layout: 'column',
            bodyStyle: 'background:#DFE9F6;',
            border: false,
            region: 'north',
            height: 70,
            items: me.formItems
        });

        me.indicadores = Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',
        {
            title: me.etiquetas.lbProdServ,
            _this: me._this,
            context: me.context,
            disabled: false,
            indicadorStoreId: me.indicadorStoreId,
//             mostrarDatosAdicionales: me. mostrarDatosAdicionalesProductos,
//             hidden: me.ocultarIndicadores,
            monedasentidad: me.extrafields,
            visibleColumns: ['numero', 'codigo', 'denominacion', 'cantidad',
                 'total', 'importe', 'monedas'],
            buttonImp: true,
            editGrid: true,
            buttonServ: false,
            // buttonTasaCambio: true
        })

        me.descuentosGastos = Ext.create('Ext.panel.Panel', {
            title: 'Descuentos / Gastos',
            itemId: 'tabdescuentosgastos',
            layout: 'column',
            bodyStyle: 'background:#DFE9F6;',
            defaults: {
                margin: '6 5 0 5'
            },
            items: [
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Importe Productos / Servicios',
                    itemId: 'importeproductos',
                    name: 'importeproductos',
                    columnWidth: 0.34,
                    readOnly: true
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Flete',
                    name: 'flete',
                    columnWidth: 0.33
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Otros gastos',
                    name: 'otrosgastos',
                    columnWidth: 0.33
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Descuentos',
                    name: 'descuentos',
                    minus: true,
                    columnWidth: 0.34
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Costos THC',
                    name: 'costosthc',
                    columnWidth: 0.33
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Seguro crédito',
                    name: 'segurocredito',
                    columnWidth: 0.33
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Puesta FOB',
                    name: 'puestafob',
                    columnWidth: 0.34
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Seguro Mcía',
                    name: 'seguromcia',
                    columnWidth: 0.33
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Interés',
                    name: 'interes',
                    columnWidth: 0.33
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Importe FOB',
                    name: 'importefob',
                    columnWidth: 0.34
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Importe SCC',
                    name: 'importescc',
                    columnWidth: 0.33
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Asistencia',
                    name: 'asistencia',
                    columnWidth: 0.33
                }),
                Ext.create('Ext.ux.MoneyField', {
                    fieldLabel: 'Inspección',
                    name: 'inspeccion',
                    columnWidth: 0.34
                })
            ]
        });

        me.tabpanel = Ext.create('Ext.tab.Panel', {
            region: 'center',
            border: false,
            frame: false,
            margin: '10 0 0 0',
            items: [me.indicadores, me.descuentosGastos]
        });

        me.items = [me.topForm, me.tabpanel];

        me.callParent();
    },
})