Ext.define('Facturacion.view.DetailsWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetalleshito',
    margin: false,
    width: 800,
    maxHeight: 700,
    closable: true,
    // closeAction: 'hide',
    modal: true,
    resizable: false,
    bodyStyle: {
        padding: '10px',
        background: 'white'
    },
    bodyCls: 'detallessolicitud',
    autoScroll: true,
    overflowX: 'scroll',
    constrain:true,
    initComponent: function () {
        var me = this;

        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';

        me.maxHeight = window.innerHeight;

        me.etiquetas = LangMgr.getLang(me);

        me.createGridProductos();

        me.title = me.etiquetas.titleDetalle;

        me.buttons = [{
            text: me.etiquetas.lbCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.lbCerrar,
            action: 'cerrar',
            handler: function () {
                me.close();
            }
        }];

        me.containerContrato = Ext.create('Ext.form.FieldSet', {
            cls: 'detallessolicitud-general',
            // tpl: me.getTemplateGeneral(),
            // data: []
            title: me.etiquetas.lbContrato,
            // frame:true,
            layout: 'hbox',
            // layout:{
            //     type: 'hbox',
            //     pack: 'end',
            //     // align: 'stretch'
            // },
            items:[
                {
                    xtype: 'displayfield',
                    fieldLabel: me.etiquetas.lbNumberContrato,
                    labelWidth: 110,
                    allowBlank: true,
                    itemId:'numerocontrato',
                    name:'numerocontrato',
                },
                { xtype: 'tbspacer', flex:1},
                // '->',
                {
                    xtype: 'button',
                    text: 'Ver detalles del contrato',
                    tooltip: 'Ver detalles del contrato',
                    action: 'contractdetail',
                    iconCls: 'detalles'
                }
            ]
        });

        me.containerGeneral = Ext.create('Ext.container.Container', {
            cls: 'detallessolicitud-general',
            title: me.etiquetas.lbDatosGenerales,
            tpl: me.getTemplateGeneral(),
            data: []
        });

        me.fsDescripcion = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            padding:'5 0 10 10',
            title: me.etiquetas.lbDescripcion,
            tpl: me.getTemplateDescripcion(),
            data: []
        });

        me.ctCobropago = Ext.create('Ext.container.Container', {
            tpl: me.getTemplateCobropago()
        });

        me.fsCobroPago = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.titlePago,
            items: [me.ctCobropago, me.gridProductos]
        });

        me.fsAnexos = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.titleAnexos,
            tpl: me.getTemplateAnexos(),
            hidden: true,
            data: [],
            listeners:{
                afterrender: function(){
                    var me=this;
                    //console.log('afterrender', me.getEl().query('button'))
                    me.getEl().query('button').forEach(function(x){
                        x.onclick=function(){
                            window.open('/crm/contratacion/index.php/gestioncontrato/getDocumentos?idnodo='+x.getAttribute('idnodo'));
                            /*Ext.Ajax.request({
                                url: UtilsFn.buildUrl({action: 'getDocumento'}, ModuleMgr.get('GestionContrato')),
                                params: {
                                    idnodo: Ext.encode(x.getAttribute('idnodo'))
                                },
                                success: function (response, opts) {
                                    var response = Ext.decode(response.responseText);
                                },
                                failure: function (response, opts) {

                                }
                            })*/
                        }
                    })
                },
            },
        });



        me.fsFactura = Ext.create('Ext.form.FieldSet', {
            // layout: 'fit',
            // height: 200,
            title: 'Factura',
            layout: 'anchor',
            defaults: {flex: 1},
            hidden: true,
            tpl: me.getFactura(),
        });
        var itemsDetails = [
            me.containerContrato, me.fsDescripcion,
            me.containerGeneral, me.fsCobroPago,
            me.fsAnexos,  me.fsFactura];

        if(me.showDesgloses){
            me.fsAreasImplicadas = Ext.create('Ext.form.FieldSet', {
                // layout: 'fit',
                // height: 200,
                title: me.etiquetas.titleAreasImplicadas,
                layout: 'anchor',
                defaults: {flex: 1},
                // hidden: true,
                items: [
                    Ext.create('DesgloseContrato.view.TabHitosAreas',{extrafields: me.extrafields})
                ]
            });
            itemsDetails.push(me.fsAreasImplicadas)
        }

        me.items = itemsDetails;
        me.callParent();
    },
   show: function (record) {
        var me = this,
            data1 = record.getData(),
            data = me.groupCoins(data1),
            stproductos = me.gridProductos.getStore();

        var cloneRecord = Ext.clone(data);
        Ext.Object.each(cloneRecord, function (key, value) {
            if (Ext.isEmpty(value)) {
                cloneRecord[key] = '<span style="color: grey">No definido</span>'
            }
        });
        console.log('record original:', data)
        console.log('record detalles:', cloneRecord)
        me.containerContrato.down('#numerocontrato').setValue(data.numerocontrato);
        // me.down('#gridhitosareas').montototal=data.montototal;
        // me.down('#gridhitosareasmonedas').montototal=data.montototal;
        me.containerGeneral.update(cloneRecord);
        me.ctCobropago.update(cloneRecord);
        me.fsDescripcion.update(cloneRecord);
        stproductos.proxy.extraParams.idhito = data.idhito;
        stproductos.load({
           callback: function () {
               // me.setHeight();
               //me.fsAnexos.update(extradata);
               me.fsAnexos.update(cloneRecord);
               me.fsAnexos.fireEvent('afterrender', me.fsAnexos);
               setTimeout(function(){
                   me.doLayout();
               }, 2000)
           }
        });
        me.getDocuments(data.idhito);

       if(me.down('#tabpanelhitos')){
           me.down('#tabpanelhitos').establecerMontoTotal(data.montototal);
           me.down('#tabpanelhitos').configurarMonedasHito(record);
           me.down('#tabpanelhitos').cargarGrids(data.idhito);
       }
       Ext.Ajax.request({
           url: UtilsFn.buildUrl({action: 'getFacturaHito'}, ModuleMgr.get('Facturacion')),
           params: {idhito: data.idhito},
           success: function (response) {
               // cargandoDatosAdicionales = false;
               // if (win.gridProductoServicios.maskL) win.gridProductoServicios.maskL.hide();
               var datos = Ext.decode(response.responseText);
               console.log(datos)
               console.log(datos.data)
               if(datos && datos.data){
                   me.fsFactura.setVisible(true);
                   datos.data.montototal=parseFloat(datos.data.importecontable)+parseFloat(datos.data.importealt);
                   me.fsFactura.update(datos.data);
                   setTimeout(function(){
                       me.doLayout();
                   }, 2000)
               }
           },
           failure: function (response) {
               // cargandoDatosAdicionales = false;
               // if (win.gridProductoServicios.maskL) win.gridProductoServicios.maskL.hide();
           }
       });
       // var storehitoarea=me.down('#gridhitosareas').getStore(),
        //     storehitoareamonedas=me.down('#gridhitosareasmonedas').getStore();
        // storehitoarea.filters.removeAtKey('idhito');
        // storehitoareamonedas.filters.removeAtKey('idhito');
        // storehitoarea.filter({
        //     id: 'idhito',
        //     property: 'idhito',
        //     value: data.idhito
        // });
        // storehitoareamonedas.filter({
        //     id: 'idhito',
        //     property: 'idhito',
        //     value: data.idhito
        // });
        // // if(!storehitoarea.remoteFilter) {
        //     storehitoarea.load({
        //         callback: function (records, operation, success) {
        //             if (success) {
        //                 console.log('records', records)
        //                 if (records.length > 0) me.fsAreasImplicadas.setVisible(true);
        //                 if (records.length == 0) me.fsAreasImplicadas.setVisible(false);
        //                 me.down('#tabpanelareas').down('#gridhitosareasmonedas').setDisabled(false);
        //                 if (records.length > 0) {
        //                     if (!records[0].raw.disribucionmonedas) {
        //                         me.down('#tabpanelareas').setActiveTab('gridhitosareas');
        //                         me.down('#tabpanelareas').down('#gridhitosareasmonedas').setDisabled(true);
        //                     } else {
        //                         me.down('#tabpanelareas').setActiveTab('gridhitosareasmonedas');
        //
        //                     }
        //                 }
        //             }
        //         }
        //     });
            // storehitoareamonedas.load();
        // }

        // me.on({
        //     show: function () {
        //         stproductos.load({
        //             callback: function () {
        //                 me.setHeight();
        //                 //me.fsAnexos.update(extradata);
        //                 me.fsAnexos.update(cloneRecord);
        //                 me.fsAnexos.fireEvent('afterrender', me.fsAnexos)
        //             }
        //         });
        //         me.getDocuments(data.idhito);
        //     }
        // });


        me.callParent();

        me.center();
    },
    createGridProductos: function () {
        var me = this,
            store = Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'cantidad'},
                    {name: 'denominacion'},
                    {name: 'idactividad'},
                    {name: 'idindicador'},
                    {name: 'idindicadorcontrato'},
                    {name: 'unidadmedida'},
                    {name: 'precio'},
                    {name: 'preciodivisa'},
                    {name: 'unidadmedida'},
                    {name: 'tipo'}
                ],
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'cargarProductosServicios'}, ModuleMgr.get('Facturacion')),
                    reader: {
                        root: 'data',
                        totalProperty: 'cant',
                        successProperty: 'success'
                    }
                }
            }),
            columns = [
                {
                    text: me.etiquetas.lbDescripcion,
                    dataIndex: 'denominacion',
                    minWidth: 35,
                    flex: 0.3,
                    filter: {
                        type: 'string'
                    }
                }, {
                    text: me.etiquetas.lbCantidad,
                    minWidth: 50,
                    flex: 0.1,
                    dataIndex: 'cantidad'
                }, {
                    text: me.etiquetas.lbUnidadMedida,
                    flex: 0.1,
                    dataIndex: 'unidadmedida'
                }, {
                    text: 'CUP',
                    flex: 0.1,
                    dataIndex: 'precio',
                    renderer: function (value) {
                        return Ext.util.Format.currency(value);
                    }
                }, {
                    text: 'CUC',
                    flex: 0.1,
                    dataIndex: 'preciodivisa',
                    renderer: function (value) {
                        return Ext.util.Format.currency(value);
                    }
                }, {
                    text: 'Tipo',
                    dataIndex: 'tipo',
                    width: 50,
                    renderer: me.rendererClasificacion
                }
            ];

        this.gridProductos = Ext.create('Ext.grid.Panel', {
            title: this.etiquetas.lbTitleProdServ,
            autoScroll: true,
            border: false,
            frame: false,
            // height: 150,
            maxHeight: 150,
            margin: '0 0 10 0',
            columns: columns,
            store: store,
            emptyText: me.etiquetas.msgNoDataLoaded
        });
    },
    setHeight: function () {
        var h = this.gridProductos.initialConfig.height,
            c = this.gridProductos.getStore().getCount(),
            p = c * 21;

        this.gridProductos.setHeight(h + p);
    },
    getTemplateGeneral: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div>',
                '<div class="solicitudneogico-block solicitudneogico-allrow">',
                    '<div class="solicitudneogico-item">',
                        '<label>' + me.etiquetas.lbArea + ':</label><span>{nombrearea}</span>',
                    '</div>',
                '</div>',
                '<div class="solicitudneogico-block">',
                    '<div class="solicitudneogico-item">',
                        '<label>' + me.etiquetas.lbNumber + ':</label><span>{numero}</span>',
                    '</div>',
                    '<div class="oferta-item">',
                        '<label>' + me.etiquetas.lbVigencia + ':</label><span>{vigencia} {unidadtiempo:this.getUnidadTiempo}</span>',
                    '</div>',
                    '<div class="solicitudneogico-item">',
                        '<label>' + me.etiquetas.lbEstado + ':</label><span class="icondistra-{iconoestado}">{nombreestado}</span>',
                    '</div>',
                '</div>',
                '<div class="solicitudneogico-block">',
                    '<div class="solicitudneogico-item">',
                        '<label>' + me.etiquetas.lbFechaEstimada + ':</label><span>{fechaestimada:this.applyFormat}</span>',
                    '</div>',
                    '<div class="solicitudneogico-item">',
                        '<label>' + me.etiquetas.lbFechaReplanificada + ':</label><span>{fechareplanificada:this.applyFormat}</span>',
                    '</div>',
                    '<div class="solicitudneogico-item">',
                        '<label>' + me.etiquetas.lbFechaFin + ':</label><span>{fechafin:this.applyFormat}</span>',
                    '</div>',

                '</div>',
            '</div>', {
                getUnidadTiempo: function (v) {
                    switch (v) {
                        case '1':
                            return me.etiquetas.lbUTDay;
                        case '2':
                            return me.etiquetas.lbUTWeek;
                        case '3':
                            return me.etiquetas.lbUTMonth;
                    }
                },
                applyFormat: function (v) {
                    if(typeof v == 'string')
                        return v;
                    return Ext.Date.format(v, 'd/m/Y');
                }
            }
        );
    },
    getTemplateDescripcion: function () {
        return new Ext.XTemplate('<div>{descripcion}</div>');
    },
    getTemplateCobropago: function () {
        var me = this;
        return new Ext.XTemplate(
            '<div>',
            '<tpl for="pago">',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
                '<label>{moneda}:</label><span>{monto:this.formatChange}</span>',
            '</div>',
            '</div>',
            '</tpl>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbTotalAmount + ':</label><span>{montototal:this.formatChange}</span>',
            '</div>',
            '</div>',
            '</div>', {
                formatChange: function (v) {
                    return Ext.util.Format.currency(v);
                }
            }
        );
    },
    getFactura: function(){
        var me = this;

        return new Ext.XTemplate(
            '<div>',
            // '<div class="solicitudneogico-block solicitudneogico-allrow">',
            // '<div class="solicitudneogico-item">',
            // '<label>' + me.etiquetas.lbArea + ':</label><span>{nombrearea}</span>',
            // '</div>',
            // '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                '<label>' + me.etiquetas.lbNumber + ':</label><span>{nrofactura}</span>',
                '</div>',
                '<div class="oferta-item">',
                '<label>' + 'Importe' + ':</label><span>{montototal:this.formatChange}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                '<label>' + 'Fecha de vencimiento' + ':</label><span>{fechavencimiento:this.applyFormat}</span>',
                '</div>',
                '<div class="solicitudneogico-item">',
                '<label>' + 'Condición de pago' + ':</label><span>{condicionpago}</span>',
                '</div>',
            // '<div class="solicitudneogico-item">',
            // '<label>' + me.etiquetas.lbFechaReplanificada + ':</label><span>{fechareplanificada:this.applyFormat}</span>',
            // '</div>',
            // '<div class="solicitudneogico-item">',
            // '<label>' + me.etiquetas.lbFechaFin + ':</label><span>{fechafin:this.applyFormat}</span>',
            // '</div>',

            '</div>',
            '</div>',
            {
                formatChange: function (v) {
                    if(v)
                        return Ext.util.Format.currency(v);
                    return '';
                },
                applyFormat: function (v) {
                    if(typeof v == 'string')
                        return v;
                    return Ext.Date.format(v, 'd/m/Y');
                }
            }
        );
    },
     getTemplateAnexos: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="detallessolicitud">',
            '<tpl for=".">',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<tpl if="url">',
           '<button class="icondistra-clausulacrm" idnodo="{idnodo}" ' +
            'data-qtip="Ver documento <b>{nombre}</b>" ' +
            'style="border-width: 0px 2px 3px 0px;">{nombre}</button>',
            // '<a href="{url}" target="_blank">{nombre}</a>',
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
    },
    groupCoins: function (data) {
        data.monedas = new Array();
        for (k in data) {
            if (k != 'monedas' && k.indexOf('montomoneda') != -1) {
                var iso = k.split('_')[1];
                data.monedas.push({'codigoiso': iso.toUpperCase(), 'monto': data[k]});
            }
        }
        return data;
    },
    getDocuments: function (idhito) {
        var me = this;
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerDocumentos'}, ModuleMgr.get('Facturacion')),
            params: {
                idhito: idhito
            },
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);

                me.fsAnexos.update(response);
                if (response.length != 0) {
                    me.fsAnexos.show();
                    me.fsAnexos.fireEvent('afterrender', me.fsAnexos)
                }
            }
        });
    },
    rendererClasificacion: function (value, metadata, record) {
        var icono = 'icondistra-',
            tipo = 'Producto';
        if (value == 1) {
            icono += 'producto';
        } else {
            icono += 'servicio';
            tipo = 'Servicio';
        }
        metadata.innerCls = icono;
        metadata.tdAttr = 'data-qtip="' + tipo + '"';
    }
});
