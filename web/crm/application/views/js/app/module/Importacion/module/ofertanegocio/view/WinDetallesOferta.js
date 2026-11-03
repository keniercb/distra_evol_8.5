Ext.define('OfertaNegocioImportacion.view.WinDetallesOferta', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallesofertaimportacion',
    margin: false,
    width: 800,
    maxHeight: 500,
    closable: true,
    closeAction: 'destroy',
    modal: true,
    resizable: true,
    bodyStyle: {
        padding: '10px',
        background: 'white'
    },
    bodyCls: 'detallesoferta',
    autoScroll: true,
    constrain: true,
    requires: [
        'Ext.ux.grid.FiltersFeature'
    ],
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.maxHeight = window.innerHeight;
        me.title = me.etiquetas.titleWinDetallesOferta;

        me.buttons = [{
            text: me.etiquetas.lbBtnCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.qtipCerrar,
            action: 'cerrar',
            handler: function () {
                me.close();
            }
        }];

        me.containerGeneral = Ext.create('Ext.container.Container', {
            cls: 'detallesoferta-general',
            tpl: me.getTemplateGeneral(),
            data: []
        });

        me.fsDescripcion = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbTitleTabDDescripcion,
            tpl: me.getTemplateDescripcion(),
            data: []
        });

        me.fsObjeto = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbObjeto,
            tpl: me.getTemplateObjeto(),
            data: []
        });

        me.fsDocAdicionales = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.titleDocumentosAdicionales,
            tpl: me.getTemplatDocAdicionales(),
            data: []
        });

        this.createGridHitos();
        this.createGridProductos();

        me.tabCobroPago = Ext.create('Ext.tab.Panel', {
            minHeight: 80,
            maxHeight: 300,
            margin: '0 0 10 0',
            activeTab: 0,
            // autoLayout: true,
            items: [this.gridHitos, this.gridProductos]
        });

        me.items = [me.containerGeneral, me.fsDescripcion, me.fsObjeto,
            me.fsDocAdicionales, me.tabCobroPago];
        me.callParent();
    },
    show: function (record) {
        var me = this,
            data = record.getData();
        console.log(data);
        me.containerGeneral.update(data);
        me.fsDescripcion.update(data);
        me.fsObjeto.update(data);

        me.callParent();
        var mask = new Ext.LoadMask(me.tabCobroPago.el, {msg: me.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, ModuleMgr.get('OfertaNegocioImportacion')),
            params: {idoferta: record.get('idoferta')},
            callback: function (options, success, response) {
                mask.hide();
                var info = Ext.decode(response.responseText);
                if (info.indicadores) {
                    if (info.indicadores.length > 0) {
                        me.tabCobroPago.setActiveTab(1);
                        me.gridProductos.getStore().loadData(info.indicadores);
                        me.gridProductos.getStore().fireEvent('loaddata', me.gridProductos.getStore());
                    }
                    if (info.hitos.length > 0) {
                        me.tabCobroPago.setActiveTab(0);
                        me.gridHitos.getStore().loadData(info.hitos);
                    }
                    if (info.indicadores.length > 0 || info.hitos.length > 0)
                        setTimeout(function () {
                            me.setHeight();
                        }, 200);
                }

                if (info.anexos) {
                    me.fsDocAdicionales.update(info);
                }
            }
        });
        me.center();
    },
    createGridProductos: function () {
        var me = this;
        this.gridProductos=Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
            title: me.etiquetas.lbProdServ,
            autoScroll: true,
            // autoLayout: true,
            editGrid: false,
            totales: true,
            sinAcciones: true,
            sinToolbar: true,
            monedasentidad: this.extrafields,
            visibleColumns:['codigo', 'denominacion', 'cantidad',
                 'total','importe', 'tipo', 'monedas'],
        })
    },
    createGridProductos1: function () {
        var me = this;
        store = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'idindicadorcontrato'},
                {name: 'idindicador'},
                {name: 'denominacion'},
                {name: 'cantidad', type: 'float'},
                {name: 'unidadmedida'},
                {name: 'precio', type: 'float'},
                {name: 'total', type: 'float'},
                {name: 'monto', type: 'float'},
                {name: 'importe', type: 'float'},
                {name: 'tipo'},
            ],
            listeners: {
                datachanged: function () {
                    console.log(me.gridProductos.down('#aa'))
                    me.gridProductos.down('#aa').setWidth(me.gridProductos.down('#aa').width - 20)
                }
            }
        }),
            me.columns = [
                {
                    text: this.etiquetas.lbDescripcion || 'Descripcion',
                    dataIndex: 'denominacion',
                    minWidth: 35,
                    flex: 1,
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return (value !== 0 ? '<b>Totales:</b>' : '');
                    }
                }, {
                    text: 'Cantidad',
                    minWidth: 50,
                    width: 100,
                    // flex: 0.1,
                    dataIndex: 'cantidad',
                    align: 'right',
                    summaryType: function (records, dataindex, b) {
                        console.log('dataindex', dataindex)
                        var cant = 0;
                        records.forEach(function (x) {
                            if (x.get(dataindex))
                                cant += parseFloat(x.get(dataindex));
                        });
                        return cant;
                    }
                },
                // {
                //     text: 'Unidad de medida',
                //     flex: 0.1,
                //     dataIndex: 'unidadmedida'
                // },
                {
                    text: 'Total',
                    // flex: 0.1,
                    width: 100,
                    dataIndex: 'total',
                    align: 'right',
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
                        value = Ext.util.Format.number(suma, '0.000,00/i');
                        meta.tdAttr = 'data-qtip="'+value+'"';
                        return value;
                    },
                    summaryType: function (records, dataindex, b) {
                        // console.log('dataindex', dataindex)
                        var precio = 0;
                        records.forEach(function (x) {
                            if (x.get(dataindex))
                                precio += parseFloat(x.get(dataindex));
                        });
                        return precio;
                    }
                }, {
                    text: 'Importe',
                    minWidth: 70,
                    width: 100,
                    // flex: 0.1,
                    dataIndex: 'importe',
                    align: 'right',
                    renderer: function (value, meta, record) {
                        var importe=0;
                        if (!Ext.isEmpty(record.get('precio'))) {
                            importe += parseFloat(record.get('precio'))*parseFloat(record.get('cantidad'));
                        }
                        if (!Ext.isEmpty(record.get('preciodivisa'))) {
                            importe += parseFloat(record.get('preciodivisa'))*parseFloat(record.get('cantidad'));
                        }
                        // meta.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(suma)+ '<br>' +
                        //     '<b>Importe</b>:'+me.formatNumber(parseFloat(importe))+'"';
                        meta.tdAttr = 'data-qtip="'+Ext.util.Format.number(importe, '0.000,00/i')+'"';
                        return Ext.util.Format.number(importe, '0.000,00/i');
                    },
                    summaryType: function (records, dataindex, b) {
                        console.log('dataindex', dataindex)
                        var monto = 0;
                        records.forEach(function (x) {
                            if (x.get(dataindex))
                                monto += parseFloat(x.get(dataindex));
                        });
                        return monto;
                    }
                }
            ];

        this.gridProductos = Ext.create('Ext.grid.Panel', {
            title: me.etiquetas.lbProdServ,
            autoScroll: true,
            autoLayout: true,
            // border: false,
            // frame: false,
            columns: [
                {
                    text: this.etiquetas.lbDescripcion || 'Descripcion',
                    dataIndex: 'denominacion',
                    // width: 100,
                    itemId: 'aa',
                    // minWidth: 35,
                    flex: 0.5,
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return (value !== 0 ? '<b>Totales:</b>' : '');
                    }
                }, {
                    text: 'Cantidad',
                    // minWidth: 50,
                    width: 100,
                    flex: 0.5,
                    dataIndex: 'cantidad',
                    align: 'right',
                    summaryType: function (records, dataindex, b) {
                        console.log('dataindex', dataindex)
                        var cant = 0;
                        records.forEach(function (x) {
                            if (x.get(dataindex))
                                cant += parseFloat(x.get(dataindex));
                        });
                        return cant;
                    }
                },

                {
                    text: me.etiquetas.lbTotal,
                    flex: 0.5,
                    // width: 100,
                    dataIndex: 'total',
                    align: 'right',
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
                        value = Ext.util.Format.number(suma, '0.000,00/i');
                        meta.tdAttr = 'data-qtip="'+suma+'"';
                        return suma;
                    },
                    summaryType: function (records, dataindex, b) {
                        // console.log('dataindex', dataindex)
                        var precio = 0;
                        records.forEach(function (x) {
                            if (x.get(dataindex))
                                precio += parseFloat(x.get(dataindex));
                        });
                        return precio;
                    }
                }, {
                    text: me.etiquetas.lbImporte,
                    // minWidth: 70,
                    // width: 100,
                    flex: 0.5,
                    dataIndex: 'importe',
                    align: 'right',
                    renderer: function (value, meta, record) {
                        var importe=0;
                        if (!Ext.isEmpty(record.get('precio'))) {
                            importe += parseFloat(record.get('precio'))*parseFloat(record.get('cantidad'));
                        }
                        if (!Ext.isEmpty(record.get('preciodivisa'))) {
                            importe += parseFloat(record.get('preciodivisa'))*parseFloat(record.get('cantidad'));
                        }
                        // meta.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(suma)+ '<br>' +
                        //     '<b>Importe</b>:'+me.formatNumber(parseFloat(importe))+'"';
                        meta.tdAttr = 'data-qtip="'+Ext.util.Format.number(importe, '0.000,00/i')+'"';
                        return Ext.util.Format.number(importe, '0.000,00/i');
                    },
                    summaryType: function (records, dataindex, b) {
                        console.log('dataindex', dataindex)
                        var monto = 0;
                        records.forEach(function (x) {
                            if (x.get(dataindex))
                                monto += parseFloat(x.get(dataindex));
                        });
                        return monto;
                    }
                },
                {
                    text: me.etiquetas.lbTipo,
                    dataIndex: 'tipo',
                    width:42,
                    renderer: function (value, metadata, record) {
                        console.log('value', value)
                        var icono = '',
                        // var icono = 'icondistra-',
                        //     tipo = this.etiquetas.lbProd;
                            tipo = '';
                        console.log('value', value=1)
                        if (value == 1) {
                            console.log('prod')
                            tipo= me.etiquetas.lbProd;
                            console.log('tipo',tipo)
                            icono = 'icondistra-producto';
                            console.log('icono',icono)
                        } else {
                            console.log('servicio')
                            icono = 'icondistra-servicio';
                            tipo = me.etiquetas.lbServ;
                        }
                        metadata.innerCls = icono;
                        metadata.tdAttr = 'data-qtip="' + tipo + '"';
                    }
                }
            ],
            store: store,
            emptyText: me.etiquetas.msgNoDataLoaded,
            features: [{
                ftype: 'filters',
                local: false,
            },
                {
                    ftype: 'summary',
                    dock: 'top'
                }
            ]
        });
        this.gridProductos.doLayout();
        // console.log(this.gridProductos.down('#aa'))
        // this.gridProductos.down('#aa').setWidth(this.gridProductos.down('#aa').width-20)
    },
    createGridHitos: function () {
        var me = this,
            store = Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'numero'},
                    {name: 'descripcion'},
                    {name: 'moneda'},
                    {name: 'monto'},
                    {name: 'fechafin'},
                    {name: 'meses'},
                    {name: 'pago'},
                    {name: 'icono'},
                    {name: 'estado'}
                ],
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, ModuleMgr.get('GestionContratoImportacion')),
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        root: 'data.hitos',
                        totalProperty: 'cant',
                        successProperty: 'success'
                    }
                }
            });

        function mostrarTooltip(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }

        var columns = [
            {
                text: me.etiquetas.lbNumber,
                xtype: 'templatecolumn',
                minWidth: 48,
                width: 48,
                dataIndex: 'numero',
                renderer: mostrarTooltip(),
                tpl: new Ext.XTemplate('<div>{numero}</div>')
            }, {
                text: me.etiquetas.lbDescripcion,
                minWidth: 35,
                flex: 1,
                dataIndex: 'descripcion',
                renderer: mostrarTooltip
            }, {
                text: me.etiquetas.lbFechaFin,
                align: 'center',
                width: 80,
                xtype: 'templatecolumn',
                dataIndex: 'fechafin',
                renderer: mostrarTooltip(),
                tpl: new Ext.XTemplate('<div>{fechafin}</div>')
            }, {
                text: me.etiquetas.lbTotalAmount,
                width: 100,
                xtype: 'templatecolumn',
                align: 'center',
                tpl: new Ext.XTemplate('<div>{monto:this.formatChange}</div>', {
                    formatChange: function (v) {
                        return Ext.util.Format.currency(v);
                    }
                })
            }, {
                text: me.etiquetas.lbMontos,
                width: 120,
                xtype: 'templatecolumn',
                align: 'center',
                tpl: new Ext.XTemplate('<div><tpl for="pago">',
                    '<div style = "float:left;text-align: right">',
                    '<b>{moneda}:</b><span>{monto:this.formatChange}</span>',
                    '</div><br>',
                    '</tpl></div>', {
                        formatChange: function (v) {
                            return Ext.util.Format.currency(v);
                        }
                    })
            },
            {
                text: me.etiquetas.lbEstado,
                align: 'center',
                dataIndex: 'estado',
                renderer: function (value, meta, record) {
                    if (value) {
                        meta.innerCls = "icondistra-" + record.data.icono;
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
            }
        ];

        this.gridHitos = Ext.create('Ext.grid.Panel', {
            title: me.etiquetas.lbHitosPago,
            emptyText: me.etiquetas.msgNoDataLoaded,
            autoScroll: true,
            border: false,
            frame: false,
            columns: columns,
            store: store,
            viewConfig: {
                loadMask: false
            }
        });
    },
    setHeight: function () {
        var actual = this.tabCobroPago;
        this.tabCobroPago.setHeight(actual.getHeight());
    },
    getTemplateGeneral: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div>',
            '<div class="ofertanegocio-block ofertanegocio-allrow">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbNombre + ':</label><span>{nombre}</span>',
            '</div>',
            '</div>',
            '<div class="ofertanegocio-block ofertanegocio-allrow">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbSolicitud + ':</label><span>{idsolicitud} {solicitud}</span>',
            '</div>',
            '</div>',
            '<tpl if="cliente==1">',
            '<div class="ofertanegocio-block ofertanegocio-allrow">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbCliente + ':</label><span>{clienteproveedor}</span>',
            '</div>',
            '</div>',
            '</tpl>',
            '<tpl if="cliente==3">',
            '<div class="ofertanegocio-block ofertanegocio-allrow">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbProveedor + ':</label><span>{clienteproveedor}</span>',
            '</div>',
            '</div>',
            '</tpl>',
            '<tpl if="cliente==1 || cliente==2">',
            '<div class="ofertanegocio-block ofertanegocio-allrow">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbAreaResponsable + ':</label><span>{arearesponsable}</span>',
            '</div>',
            '</div>',
            '</tpl>',
            '<tpl if="cliente==1 || cliente==2">',
            '<div class="ofertanegocio-block ofertanegocio-allrow">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbSector + ':</label><span>{sector}</span>',
            '</div>',
            '</div>',
            '</tpl>',
            '<tpl if="cliente==1 || cliente==2">',
            '<div class="ofertanegocio-block ofertanegocio-allrow">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbResponsable + ':</label><span>{nombreresponsable}</span>',
            '</div>',
            '</div>',
            '</tpl>',
            '<div class="ofertanegocio-block ofertanegocio-block5">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbFechaInicio + ':</label><span>{fechainicio}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbMedioPago + ':</label><span>{mediopago}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbCondicionPago + ':</label><span>{condicionpago}</span>',
            '</div>',
            '</div>',

            '<div class="ofertanegocio-block ofertanegocio-block5">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbFechaFirma + ':</label><span>{fechafirma}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbVigencia + ':</label><span>{vigencia} <tpl if="unidadtiempo == 1">' + me.etiquetas.lbUTDay + '<tpl else>' + me.etiquetas.lbUTMonth + '</tpl></span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbMontoTotal + ':</label><span>{montototal}</span>',
            '</div>',
            '</div>',
            '<tpl if="cliente==3">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbLinea + ':</label><span>{linea}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbTipoLinea + ':</label><span>{tipolinea}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbIncoterms + ':</label><span>{incoterms}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbPuertoOrigen + ':</label><span>{puertoorigen}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbPuertoEmbarque + ':</label><span>{puertodestino}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbPeriodoGarantia + ':</label><span>{garantia} <tpl if="garantiatiempo == 1">' + me.etiquetas.lbUTDay + '<tpl else>' + me.etiquetas.lbUTMonth + '</tpl></span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbTiempoEntrega + ':</label><span>{tiempoentrega}</span>',
            '</div>',
            '</tpl>',
            '</div>'
        );
    },
    getTemplateDescripcion: function () {
        return new Ext.XTemplate('<div>{descripcion}</div>');
    },
    getTemplateObjeto: function () {
        return new Ext.XTemplate('<div>{objeto}</div>');
    },
    getTemplatDocAdicionales: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="detallessolicitud">',
            '<tpl for="anexos">',
            '<div class="ofertanegocio-block">',
            '<div class="ofertanegocio-item">',
            '<tpl if="url">',
            '<a href="{url}" target="_blank">{nombre}</a>',
            '</tpl>',
            '</div>',
            '</div>',
            '</tpl>',
            '</div>', {
                formatChange: function (v) {
                    return Ext.util.Format.currency(v);
                }
            }
        );
    }
});
