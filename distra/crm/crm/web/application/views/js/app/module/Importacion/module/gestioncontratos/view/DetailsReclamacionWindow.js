Ext.define('GestionContratoImportacion.view.DetailsReclamacionWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallesreclamacionimportacion',
    margin: false,
    width: 950,
    maxHeight: 700,
    closable: true,
    closeAction: 'hide',
    modal: true,
    // resizable: false,
    // draggable: true,
    constrain: true,
    bodyStyle: {
        padding: '10px',
        background: 'white'
    },
    bodyCls: 'detallessolicitud',
    autoScroll: true,
    suplemento: false,
    y:0,
    initComponent: function () {
        var me = this;

        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';

        me.etiquetas = LangMgr.getLang(me);
        me.maxHeight = window.innerHeight;
        me.createTabCobrosPago();

        me.title = me.etiquetas.titleDetalles;

        me.buttons = [{
            text: me.etiquetas.lbCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.lbCerrar,
            action: 'cerrar',
            handler: function () {
                me.close();
            }
        }];

        me.containerGeneral = Ext.create('Ext.container.Container', {
            cls: 'detallessolicitud-general',
            tpl: me.getTemplateGeneral(),
            data: []
        });

        me.fsClienteProveedor = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: '',
            tpl: me.getTemplateClienteProveedor(),
            data: []
        });

        me.fsDescripcion = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbDescripcion,
            tpl: me.getTemplateDescripcion(),
            data: []
        });

        me.fsAnexos = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.titleAnexos,
            tpl: me.getTemplateAnexos(),
            hidden: true,
            data: []
        });

        me.fsObjeto = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbObjeto,
            tpl: me.getTemplateObjeto(),
            data: []
        });

        me.fsObjetoSuplemento = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbObjetoSuplemento,
            tpl: me.getTemplateObjetoSuplemento(),
            data: [],
            hidden: !me.suplemento,

        });

        me.ctCobropago = Ext.create('Ext.container.Container', {
            tpl: me.getTemplateCobropago()
        });

        me.fsCobroPago = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: '',
            items: [me.ctCobropago, me.tabCobroPago]
        });

        me.fsAreaImplicadas = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            padding: '5 5 10 5',
            defaults: {flex: 1},
            title: me.etiquetas.lbAreasImplicadas,
            tpl: me.getTemplateAreaImplicada(),
            data: []
        });

        me.items = [me.containerGeneral, me.fsClienteProveedor, me.fsAnexos,
            me.fsCobroPago, me.fsObjeto, me.fsObjetoSuplemento, me.fsDescripcion, me.fsAreaImplicadas];
        me.callParent();
    },
    show: function (record) {
        // console.log('record:', record)
        var me = this,
            doc = Ext.decode(record.get('documento')),
            data = record.getData(),
            titulocliente = data.cliente ? me.etiquetas.lbCliente : me.etiquetas.lbProveedor,
            titulocobro = data.cliente ? me.etiquetas.lbCobro : me.etiquetas.lbPago,
            sthitos = me.gridHitos.getStore(),
            stproductos = me.gridProductos.getStore();
        data['noEjecutado'] = '0';
        data['ejecutado'] = '0';
        // console.log('dataReceived:',  me.dataReceived)
        var cloneRecord = Ext.clone(data);
        Ext.Object.each(cloneRecord, function (key, value) {
            // console.log('key:', key, 'value:',value)
            if (
                // ['fechafirma', 'fechainicio','fechafin', 'mediopago', 'condicionpago',// , 'descripcion', 'objeto'
                //     'denominacioncontratomarco'].indexOf(key) != -1 &&
                Ext.isEmpty(value)) {
                cloneRecord[key] = '<span style="color: grey">No definido</span>'
            }
        });
        if (doc) {
            cloneRecord['documentoname'] = doc['name'];
        }
        me.dataReceived = cloneRecord;

        me.fsClienteProveedor.setTitle(titulocliente);
        me.fsCobroPago.setTitle(titulocobro);

        me.containerGeneral.update(cloneRecord);
        me.fsClienteProveedor.update(cloneRecord);
        me.ctCobropago.update(cloneRecord);
        me.fsDescripcion.update(cloneRecord);
        me.fsObjeto.update(cloneRecord);
        me.fsObjetoSuplemento.update(cloneRecord);
        sthitos.proxy.extraParams.idcontrato = data.idcontrato;
        // console.log('data:', data)
        me.on({
            show: function () {
                // var mask = new Ext.LoadMask(me.el, {msg: me.etiquetas.msgLoading});
                var mask = new Ext.LoadMask(me.tabCobroPago.el, {msg: me.etiquetas.msgLoading});
                mask.show();
                sthitos.load({
                    callback: function () {
                        var extradata = sthitos.proxy.reader.jsonData.data;
                        stproductos.loadData(extradata.productos);
                        me.fsAnexos.update(extradata);
                        console.log('extradata:', extradata)

                        if ((extradata.productos.length > 0 && extradata.hitos.length == 0) ||
                            (extradata.productos.length > 0 && extradata.hitos.length > 0 &&
                                extradata.productos.length > extradata.hitos.length))
                            me.tabCobroPago.setActiveTab(1);
                        if (extradata.anexos.length != 0)
                            me.fsAnexos.show();
                        if (extradata.productos.length > 0 || extradata.hitos.length > 0)
                            setTimeout(function () {
                                me.setHeight();
                            }, 200);

                        // if(extradata.productos.length>0)
                        //     me.tabCobroPago.setActiveTab(1);
                        mask.hide();
                    }
                });
            }
        });


        me.callParent();

        me.center();
    },
    createTabCobrosPago: function () {
        this.createGridHitos();
        this.createGridProductos();
        this.tabCobroPago = Ext.create('Ext.tab.Panel', {
            minHeight: 80,
            maxHeight: 260,
            // height: 150,
            margin: '0 0 10 0',
            activeTab: 0,
            items: [this.gridHitos, this.gridProductos]
        });
    },
    createGridProductos: function () {
        var me = this,
            store = Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'idindicadorcontrato'},
                    {name: 'idindicador'},
                    {name: 'denominacion'},
                    {name: 'cantidad', type: 'float'},
                    {name: 'unidadmedida'},
                    {name: 'precio', type: 'float'},
                    {name: 'monto', type: 'float'}
                ]
            }),
            columns = [
                {
                    text: this.etiquetas.lbDescripcion || 'Descripcion',
                    dataIndex: 'denominacion',
                    minWidth: 35,
                    flex: 0.3
                }, {
                    text: 'Cantidad',
                    minWidth: 50,
                    flex: 0.1,
                    dataIndex: 'cantidad'
                }, {
                    text: 'Unidad de medida',
                    flex: 0.1,
                    dataIndex: 'unidadmedida'
                }, {
                    text: 'Precio unitario',
                    flex: 0.1,
                    dataIndex: 'precio',
                    renderer: function (v) {
                        return Ext.util.Format.currency(v);
                    }
                }, {
                    text: this.etiquetas.lbMonto || 'Monto',
                    minWidth: 70,
                    flex: 0.1,
                    dataIndex: 'monto'
                }
            ];

        this.gridProductos = Ext.create('Ext.grid.Panel', {
            title: this.etiquetas.lbProdServ,
            autoScroll: true,
            border: false,
            frame: false,
            columns: columns,
            store: store,
            emptyText: me.etiquetas.msgNoDataLoaded,
        });
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
                    {name: 'estado'},
                    {name: 'nombrearea'},
                    {name: 'inicial'},
                    {name: 'fechainicio'}
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
                },
                listeners: {
                    load: function (st, records, successful, eOpts) {
                        $montoTotal = store.sum('monto', false);
                        $noEjecutado = 0
                        $ejecutado = 0
                        for (var i = 0; i < records.length; i++) {
                            if (records[i].data.inicial == 1) {
                                $noEjecutado += records[i].data.monto;
                            }
                        }
                        $ejecutado = $montoTotal - $noEjecutado;
                        me.dataReceived['noEjecutado'] = $noEjecutado;
                        me.dataReceived['ejecutado'] = $ejecutado;
                        me.ctCobropago.update(me.dataReceived);
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
            },
            {
                text: me.etiquetas.lbDescripcion,
                // xtype: 'templatecolumn',
                minWidth: 35,
                flex: 1,
                dataIndex: 'descripcion',
                renderer: mostrarTooltip
                // tpl: new Ext.XTemplate('<div style="text-align: justify;white-space: normal">{descripcion}</div>')
            },
            {
                text: me.etiquetas.lbFechaFin,
                align: 'center',
                width: 80,
                xtype: 'templatecolumn',
                dataIndex: 'fechafin',
                renderer: mostrarTooltip(),
                tpl: new Ext.XTemplate('<div>{fechafin}</div>')
            }, {
                text: me.etiquetas.lbTotalAmount,
                // align: 'right',
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
                // align: 'center',
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
            }, {
                text: me.etiquetas.lbArea,
                // align: 'center',
                width: 120,
                dataIndex: 'nombrearea',
                align: 'center'
            },
            {
                text: me.etiquetas.lbEstado,
                align: 'center',
                dataIndex: 'estado',
                renderer: function (value, meta, record) {
                    if (value) {
                        meta.innerCls = "icondistra-" + record.data.icono;
                        meta.tdAttr = 'data-qtip="' + value + ' <br> <b>Fecha</b>: ' + record.data.fechainicio + '"';
                    }
                    return value;
                },
            }
        ];

        this.gridHitos = Ext.create('Ext.grid.Panel', {
            title: this.etiquetas.lbHitosPago,
            emptyText: me.etiquetas.msgNoDataLoaded,
            autoScroll: true,
            border: false,
            frame: false,
            // loadMask: false,
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
            '<div class="solicitudneogico-block solicitudneogico-allrow">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbName + ':</label><span>{nombre}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block  solicitudneogico-allrow">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbTypeContract + ':</label><span>{tipocontrato}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbNumber + ':</label><span>{numero}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbNumberContrato + ':</label><span>{numerocontrato}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbFechaRegistro + ':</label><span>{fechainicio}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbContratoMarco + ':</label><span>{denominacioncontratomarco}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbFechaFirma + ':</label><span>{fechafirma}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="ofertanegocio-item">',
                '<label>' + me.etiquetas.lbVigencia + ':</label>' +
                    '<span>{vigencia} ' +
                        '<tpl if="unidadtiempo == 1">' + me.etiquetas.lbUTDay + '</tpl>' +
                        '<tpl if="unidadtiempo == 2">' + me.etiquetas.lbUTMonth + '</tpl>' +
                        '<tpl if="unidadtiempo == 3">' + me.etiquetas.lbUTYear + '</tpl>' +
                        '<tpl if="cumplimientoobligaciones == 1"> - (' + me.etiquetas.lbCumplimiento + ')</tpl>' +
                    '</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbFechaFin + ':</label><span>{fechafin}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbArea + ':</label><span>{nombrearea}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbResponsableContrato + ':</label><span>{nombrepersona}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbEstado + ':</label><span class="icondistra-{iconoestadoinicial}">{estadoinicial}</span>',
                '</div>',
            '</div>',
            '<tpl if="cliente==2">',
                '<div class="solicitudneogico-block">',
                    '<div class="solicitudneogico-item">',
                        '<label>' + me.etiquetas.lbLinea + ':</label><span>{linea}</span>',
                    '</div>',
                '</div>',
            '</tpl>',
            '<tpl if="cliente==2">',
                '<div class="solicitudneogico-block">',
                    '<div class="solicitudneogico-item">',
                        '<label>' + me.etiquetas.lbTipoLinea + ':</label><span>{tipolinea}</span>',
                    '</div>',
                '</div>',
            '</tpl>',
            '<tpl if="cliente==2">',
                '<div class="solicitudneogico-block">',
                    '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbPuertoOrigen + ':</label><span>{puertoorigen}</span>',
                    '</div>',
                '</div>',
            '</tpl>',
            '<tpl if="cliente==2">',
                '<div class="solicitudneogico-block">',
                    '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbPuertoEmbarque + ':</label><span>{puertodestino}</span>',
                    '</div>',
                '</div>',
            '</tpl>',
            '<tpl if="cliente==2">',
                '<div class="solicitudneogico-block">',
                    '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbIncoterms + ':</label><span>{incoterms}</span>',
                    '</div>',
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
    getTemplateObjetoSuplemento: function () {
        return new Ext.XTemplate('<div>{objetosuplemento}</div>');
    },
    getTemplateClienteProveedor: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div>',
            '<div class="solicitudneogico-block solicitudneogico-allrow">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbName + ':</label><span>{clienteproveedor}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block solicitudneogico-allrow">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbSector + ':</label><span>{sector}</span>',
            '</div>',
            '</div>',
            '</div>'
        );
    },
    getTemplateCobropago: function () {
        var me = this;
        //<tpl if="unidadtiempo == 1">' + me.etiquetas.lbUTMonth + '<tpl else>' + me.etiquetas.lbUTYear + '</tpl>
        return new Ext.XTemplate(
            '<div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbCondicionPago + ':</label><span>{condicionpago}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbMedioPago + ':</label><span>{mediopago}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbEjecutado + ':</label><span>{ejecutado:this.formatChange}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbNoejecutado + ':</label><span>{noEjecutado:this.formatChange}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbTotalAmount + ':</label><span>{montototal:this.formatChange}</span>',
            '</div>',
            '</div>',
            '<tpl for="monedas">',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>{codigoiso}:</label><span>{monto:this.formatChange}</span>',
            '</div>',
            '</div>',
            '</tpl>',
            '</div>', {
                formatChange: function (v) {
                    return Ext.util.Format.currency(v);
                }
            }
        );
    },

    getTemplateAreaImplicada: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="solicitudneogico-columnheader">',
            '<div style="width:100%;"><label>' + me.etiquetas.lbDenominacion + '</label></div>',
            '</div>',
            '<tpl for=".">',
            '<div class="solicitudnegocio-row">',
            '<div style="width:100%"><span>{area}</span></div>',
            '</div>',
            '</tpl>'
        );
    },

    getTemplateHitosPago: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="detallessolicitud">',
            '<div class="solicitudneogico-block solicitudneogico-allrow">',
            '<div class="solicitudneogico-item">',
            '<label>Hito:</label><span>{numero} {descripcion}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block solicitudneogico-allrow">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbMonto + ':</label><span>{monto:this.formatChange} CUP </span>',
            '</div>',
            '</div>',
            '<tpl for="pago">',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>{moneda.codigoiso}:</label><span>{monto:this.formatChange}</span>',
            '</div>',
            '</div>',
            '</tpl>',
            '</div>', {
                formatChange: function (v) {
                    return Ext.util.Format.currency(v);
                }
            }
        );
    },
    getTemplateAnexos: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="detallessolicitud">',
            '<tpl for="anexos">',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<tpl if="url">',
            '<a href="{url}" target="_blank">{nombre}</a>',
            '</tpl>',
            '</span>',
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
