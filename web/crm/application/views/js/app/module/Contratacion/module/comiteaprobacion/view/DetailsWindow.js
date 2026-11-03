Ext.define('Comite.view.DetailsWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallessalocitud',
    margin: false,
    width: 700,
    maxHeight: 500,
    closable: true,
    closeAction: 'hide',
    modal: true,
    resizable: false,
    bodyStyle: {
        padding: '10px',
        background: 'white'
    },
    bodyCls: 'detallessolicitud',
    autoScroll: true,
    initComponent: function () {
        var me = this;

        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 5;
        Ext.util.Format.currencySign = ' ';

        me.etiquetas = LangMgr.getLang(me);

        me.createTabCobrosPago();

        me.title = this.etiquetas.lbDetails;

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

        me.ctCobropago = Ext.create('Ext.container.Container', {
            tpl: me.getTemplateCobropago()
        });

        me.fsCobroPago = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: '',
            items: [me.ctCobropago, me.tabCobroPago]
        });

        me.items = [me.containerGeneral, me.fsClienteProveedor, me.fsAnexos, me.fsCobroPago, me.fsObjeto, me.fsDescripcion];
        me.callParent();
    },
    show: function (record) {
        var me = this,
            doc = Ext.decode(record.get('documento')),
            data = record.getData(),
            titulocliente = data.cliente ? me.etiquetas.lbCliente : me.etiquetas.lbProveedor,
            titulocobro = data.cliente ? me.etiquetas.lbCobro : me.etiquetas.lbPago,
            sthitos = me.gridHitos.getStore(),
            stproductos = me.gridProductos.getStore();

        if (doc)
            data['documentoname'] = doc['name'];

        me.fsClienteProveedor.setTitle(titulocliente);
        me.fsCobroPago.setTitle(titulocobro);

        me.containerGeneral.update(data);
        me.fsClienteProveedor.update(data);
        me.ctCobropago.update(data);
        me.fsDescripcion.update(data);
        me.fsObjeto.update(data);
        sthitos.proxy.extraParams.idcontrato = data.idcontrato;

        me.on({
            show: function () {
                var mask = new Ext.LoadMask(me.el, {msg: me.etiquetas.msgLoading});
                mask.show();
                sthitos.load({
                    callback: function () {
                        var extradata = sthitos.proxy.reader.jsonData.data;
                        me.tabCobroPago.setActiveTab(1);
                        stproductos.loadData(extradata.productos);
                        me.tabCobroPago.setActiveTab(0);
                        me.fsAnexos.update(extradata);
                        if (extradata.anexos.length != 0) {
                            me.fsAnexos.show();
                        }
                        me.setHeight();
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
            height: 150,
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
                    text: this.etiquetas.lbDescripcion,
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
                    dataIndex: 'precio'
                }, {
                    text: this.etiquetas.lbMonto,
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
            emptyText: me.etiquetas.msgNoDataLoaded
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
                    {name: 'pago'}
                ],
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, ModuleMgr.get('GestionContrato')),
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        root: 'data.hitos',
                        totalProperty: 'cant',
                        successProperty: 'success'
                    }
                }
            }),
            columns = [
                {
                    text: me.etiquetas.lbNumber,
                    xtype: 'templatecolumn',
                    minWidth: 48,
                    width: 48,
                    tpl: new Ext.XTemplate('<div>{numero}</div>')
                }, {
                    text: me.etiquetas.lbDescripcion,
                    xtype: 'templatecolumn',
                    minWidth: 35,
                    flex: 1,
                    tpl: new Ext.XTemplate('<div style="text-align: justify;white-space: normal">{descripcion}</div>')
                }, {
                    text: me.etiquetas.lbFechaFin,
                    align: 'center',
                    width: 80,
                    xtype: 'templatecolumn',
                    tpl: new Ext.XTemplate('<div>{fechafin}</div>')
                }, {
                    text: me.etiquetas.lbMonto,
                    align: 'right',
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
                    align: 'center',
                    width: 120,
                    xtype: 'templatecolumn',
                    align: 'center',
                    tpl: new Ext.XTemplate('<div><tpl for="pago">',
                        '<div style = "float:left;text-align: right">',
                        '<b>{moneda.codigoiso}:</b><span>{monto:this.formatChange}</span>',
                        '</div>',
                        '</tpl></div>', {
                            formatChange: function (v) {
                                return Ext.util.Format.currency(v);
                            }
                        })
                }
            ];

        this.gridHitos = Ext.create('Ext.grid.Panel', {
            title: this.etiquetas.lbHitosPago,
            emptyText: me.etiquetas.msgNoDataLoaded,
            autoScroll: true,
            border: false,
            frame: false,
            loadMask: true,
            columns: columns,
            store: store
        });
    },
    setHeight: function () {
        var h1 = this.tabCobroPago.initialConfig.height,
            c1 = this.gridHitos.getStore().getCount(),
            c2 = this.gridProductos.getStore().getCount(),
            p1 = c1 * 90,
            p2 = c2 * 21,
            p = p1 > p2 ? p1 : p2;

        this.tabCobroPago.setHeight(h1 + p);
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
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbNumber + ':</label><span>{numero}</span>',
            '</div>',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbTypeContract + ':</label><span>{tipocontrato}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbNumberContrato + ':</label><span>{numerocontrato}</span>',
            '</div>',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbContratoMarco + ':</label><span>{denominacioncontratomarco}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbFechaInicio + ':</label><span>{fechainicio}</span>',
            '</div>',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbFechaFin + ':</label><span>{fechafin}</span>',
            '</div>',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbArea + ':</label><span>{nombrearea}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbVigencia + ':</label><span>{vigencia} <tpl if="unidadtiempo = 1">' + me.etiquetas.lbUTMonth + '<tpl else>' + me.etiquetas.lbUTYear + '</tpl></span>',
            '</div>',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbFechaFirma + ':</label><span>{fechafirma}</span>',
            '</div>',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbResponsableContrato + ':</label><span>{nombrepersona}</span>',
            '</div>',
            '</div>',
            '</div>'
        );
    },
    getTemplateDescripcion: function () {
        return new Ext.XTemplate('<div>{descripcion}</div>');
    },
    getTemplateObjeto: function () {
        return new Ext.XTemplate('<div>{objeto}</div>');
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

        return new Ext.XTemplate(
            '<div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbCondicionPago + ':</label><span>{condicionpago}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbMonto + ':</label><span>{montototal:this.formatChange}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block solicitudneogico-allrow">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbMedioPago + ':</label><span>{mediopago}</span>',
            '</div>',
            '</div>',
            '</div>', {
                formatChange: function (v) {
                    return Ext.util.Format.currency(v);
                }
            }
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
