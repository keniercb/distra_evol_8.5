Ext.define('GestionContratoImportacion.view.DetailsWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallescontratoimportacion',
    margin: false,
    width: 1000,
    // maxHeight: 700,
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

        me.buttons = [
            {
                text: 'Exportar',
                iconCls: 'icondistra-exportar',
                tooltip: 'Exportar información',
                align: 'left',
                action: 'exportar',
                handler: function () {
                    // console.log('detail exp:', me.dataReceived.idcontrato, me.dataReceived)
                    window.open(window.location.origin +
                        '/crm/importacion/index.php/gestioncontratoimportacion/exportarDetalles?idcontrato=' +
                        me.dataReceived.idcontrato);
                }
            },{
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
            listeners:{
                afterrender: function(){
                    var me=this;
                   me.getEl().query('button').forEach(function(x){
                        x.onclick=function(){
                         window.open('/crm/contratacion/index.php/gestioncontrato/getDocumentos?idnodo='+x.getAttribute('idnodo'));
                            /*Ext.Ajax.request({
                                url: UtilsFn.buildUrl({action: 'getDocumentos'}, ModuleMgr.get('GestionContratoImportacion')),
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
            hidden: true,
            tpl: me.getTemplateAreaImplicada(),
            maxHeight: 180,
            autoScroll: true,
            data: []
        });

        me.fsPedidos = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            padding: '5 5 10 5',
            defaults: {flex: 1},
            title: 'Pedidos',
            hidden: true,
            items:[
                Ext.create('Ext.container.Container', {
                    itemId: 'datosgeneralespedidos',
                    tpl: me.getTemplatePedidos()
                }),
                Ext.create('GestionContratoImportacion.view.GridPedidos',{
                    mostrarToolbar: false,
                    itemId: 'gridpedidosdetalles',
                    selType: 'rowmodel',
                    minHeight: 42,
                    maxHeight: 112,
                    // height: 92
                })
            ]
            // tpl: me.getTemplatePedidos(),
            // data: []
        });

        me.fsClientesAsociados = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            padding: '5 5 10 5',
            defaults: {flex: 1},
            hidden:true,
            title: me.etiquetas.lbClientesAsociados,
            tpl: me.getTemplateClientesAsociados(),
            maxHeight: 180,
            autoScroll: true,
            data: []
        });

        me.fsPenalizaciones = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            padding: '5 5 10 5',
            defaults: {flex: 1},
            title: 'Penalizaciones',
            hidden: true,
            tpl: me.getTemplatePenalizaciones(),
            maxHeight: 180,
            autoScroll: true,
            data: []
        });

        me.items = [me.containerGeneral, me.fsClienteProveedor, me.fsAnexos,
            me.fsCobroPago, me.fsObjeto, me.fsObjetoSuplemento, me.fsDescripcion,
            me.fsAreaImplicadas, me.fsClientesAsociados, me.fsPedidos, me.fsPenalizaciones];
        me.callParent();
    },
    show: function (record) {
        console.log('DETAIL RECORD:', record)
        var me = this,
            doc = Ext.decode(record.get('documento')),
            data = record.getData(),
            titulocliente = data.cliente ? me.etiquetas.lbCliente : me.etiquetas.lbProveedor,
            titulocobro = data.cliente ? me.etiquetas.lbCobro : me.etiquetas.lbPago,
            sthitos = me.gridHitos.getStore(),
            stproductos = me.gridProductos.getStore();
        data['noEjecutado'] = '0';
        data['ejecutado'] = '0';
        if(Ext.isEmpty(data['montototal']))data['montototal'] = '0';
        // console.log('dataReceived:',  me.dataReceived)
        var cloneRecord = Ext.clone(data);
        cloneRecord['firmado']=!Ext.isEmpty(cloneRecord['fechafin']);
        Ext.Object.each(cloneRecord, function (key, value) {
            // console.log('key:', key, 'value:',value)
            if (Ext.isEmpty(value)) {
                cloneRecord[key] = '<i style="color: grey">No definido</i>'
            }
        });
        if (doc) {
            cloneRecord['documentoname'] = doc['name'];
        }
        var arrayContextos = ['Proveedor', 'Cliente', 'Importación'];
        cloneRecord['tipo_de_contrato']='Contrato '+(cloneRecord['contratomarco']==1?'Marco ':'')+arrayContextos[cloneRecord['cliente']];
        if(!cloneRecord['montototal'])cloneRecord['montototal']='0';
        cloneRecord.monedas.forEach(function(x){
            x['anterior']=x['monto']-(x['incremento']);
        })
        console.log('cloneRecord:', cloneRecord)
        me.dataReceived = cloneRecord;

        me.fsClienteProveedor.setTitle(titulocliente);
        me.fsCobroPago.setTitle(titulocobro);

        me.containerGeneral.update(cloneRecord);
        me.fsClienteProveedor.update(cloneRecord);
        me.ctCobropago.update(cloneRecord);
        me.fsDescripcion.update(cloneRecord);
        me.fsObjeto.update(cloneRecord);
        me.fsObjetoSuplemento.update(cloneRecord);
        me.fsAreaImplicadas.update(cloneRecord);
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
                        me.fsAnexos.fireEvent('afterrender', me.fsAnexos)
                        console.log('extradata:', extradata)
                        var impli = extradata.implicadas;
                        me.fsAreaImplicadas.update(impli);
                        if(impli.length>0)me.fsAreaImplicadas.show();
                        if(extradata.clientesasociados.length>0) {
                            me.fsClientesAsociados.setTitle(cloneRecord['cliente']==1?me.etiquetas.lbClientesAsociados : me.etiquetas.lbProveedoresAsociados);
                            me.fsClientesAsociados.setVisible(true);
                            me.fsClientesAsociados.update(extradata.clientesasociados);
                        }
                        if ((extradata.productos.length > 0 && extradata.hitos.length == 0) ||
                            (extradata.productos.length > 0 && extradata.hitos.length > 0 &&
                                extradata.productos.length > extradata.hitos.length))
                            me.tabCobroPago.setActiveTab(1);
                        if (extradata.anexos && extradata.anexos.length != 0)
                            me.fsAnexos.show();
                        if (extradata.productos.length > 0 || extradata.hitos.length > 0)
                            setTimeout(function () {
                                me.setHeight();
                            }, 200);
                        if(extradata.pedidos && extradata.pedidos.length>0){
                            var ejecutado=0, noEjecutado=0, cantEjecutado=0, cantNoEjecutado=0;
                            extradata['pedidos'].forEach(function (x) {
                                var productos=Ext.decode(x['productos']),
                                    montototal=0, canttotal=0;
                                x['cantprod'] = productos.length;
                                productos.forEach(function(y){
                                    montototal+=parseFloat(y['precio'])*y['cantidad'];
                                    canttotal+=y['cantidad'];
                                })
                                x['montototal'] = montototal;
                                x['canttotalprod'] = canttotal;
                                if(x['inicial']=='1'){
                                    noEjecutado+=montototal;
                                    cantNoEjecutado+=x['canttotalprod'];
                                }else{
                                    ejecutado+=montototal;
                                    cantEjecutado+=x['canttotalprod'];
                                }
                            });
                            me.fsPedidos.setVisible(true);
                            me.fsPedidos.down('grid').getStore().loadData(extradata.pedidos);
                            me.fsPedidos.down('#datosgeneralespedidos').update({
                                'ejecutado': ejecutado, 'noejecutado': noEjecutado,
                                'cantejecutado': cantEjecutado, 'cantnoejecutado': cantNoEjecutado,
                            });

                            // me.fsPedidos.update(extradata.pedidos);
                        }
                        if(extradata['penalidadesgeneral'] && extradata['penalidadesgeneral'].length>0){
                            me.fsPenalizaciones.update(extradata['penalidadesgeneral']);
                            // if(result.length==0)
                            me.fsPenalizaciones.setVisible(true);
                        }

                        // if(extradata['datospedidosgeneral'] && extradata['datospedidosgeneral'].length>0){
                        //     var contproductos=0;
                        //     extradata['datospedidosgeneral'].forEach(function(x){
                        //         if(x['productos']){
                        //             Ext.decode(x['productos']).forEach(function(y){
                        //                 contproductos+=parseInt(y['cantidad']);
                        //             })
                        //         }
                        //     })
                        // }

                        // if(me.fsAreaImplicadas){
                        //
                        // }
                        // if(extradata.productos.length>0)
                        //     me.tabCobroPago.setActiveTab(1);
                        mask.hide();
                        if(extradata.hitos.length == 0){
                            Ext.Ajax.request({
                                url: UtilsFn.buildUrl({action: 'getFacturasContratos'}, ModuleMgr.get('GestionContratoImportacion')),
                                params: {
                                    // idcontrato: 9653,
                                    idcontrato: data.idcontrato,
                                },
                                success: function (response, opts) {
                                    var response = Ext.decode(response.responseText);
                                    let total = 0;
                                    if(response.success){
                                        // importecontable
                                        total = response.data.reduce((a, b)=>a+parseFloat(b.importetotal), 0);
                                        cloneRecord['ejecutado'] = total;
                                        cloneRecord['noEjecutado'] = parseFloat(cloneRecord.montototal) - parseFloat(cloneRecord['ejecutado']);
                                        me.ctCobropago.update(cloneRecord);
                                    }
                                },
                                failure: function (response, opts) {

                                }
                            });
                        }else{
                            Ext.Ajax.request({
                                url: UtilsFn.buildUrl({action: 'getHitosFacturados'}, ModuleMgr.get('GestionContratoImportacion')),
                                params: {
                                    // idhitos: Ext.encode([60009]),
                                    idhitos: Ext.encode(extradata.hitos.map(x=>x.idhito)),
                                },
                                success: function (response, opts) {
                                    var response = Ext.decode(response.responseText);
                                    let total = 0;
                                    if(response.success){
                                        // preciotarifabase
                                        total = response.data.reduce((a, b)=>a+parseFloat(b.preciotarifaoriginal), 0);
                                        cloneRecord['ejecutado'] = total;
                                        cloneRecord['noEjecutado'] = parseFloat(cloneRecord.montototal) - parseFloat(cloneRecord['ejecutado']);
                                        me.ctCobropago.update(cloneRecord);
                                    }
                                },
                                failure: function (response, opts) {

                                }
                            });
                        }
                    }
                });
            }
        });
        // Ext.Ajax.request({
        //     url: UtilsFn.buildUrl({action: 'getPenalidadesGeneral'}, ModuleMgr.get('GestionContratoImportacion')),
        //     params: {
        //         idcontrato: record.data.idcontrato,
        //     },
        //     callback: function (options, success, response) {
        //         var result2 = Ext.decode(response.responseText);
        //         // me.fsPenalizaciones.update(result2);
        //         // if(result.length==0)
        //         //     me.fsPenalizaciones.setVisible(false);
        //     }
        // });

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
                    {name: 'codigo'},
                    {name: 'idindicador'},
                    {name: 'denominacion'},
                    {name: 'cantidad', type: 'float'},
                    {name: 'unidadmedida'},
                    {name: 'precio', type: 'float'},
                    {name: 'monto', type: 'float'}
                ],
                data:[]
            }),
            columns = [
                {
                    text: 'Código',
                    width: 100,
                    dataIndex: 'codigo',
                    renderer: function (value, meta) {
                        if (value)
                            meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: this.etiquetas.lbDescripcion || 'Descripcion',
                    dataIndex: 'denominacion',
                    minWidth: 35,
                    flex: 0.3,
                    renderer: function (value, meta) {
                        if (value)
                            meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: 'Cantidad',
                    minWidth: 50,
                    width: 60,
                    dataIndex: 'cantidad',
                    align: 'right',
                    renderer: function (value, meta) {
                        if (value)
                            meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                // {
                //     text: 'Unidad de medida',
                //     flex: 0.1,
                //     dataIndex: 'unidadmedida'
                // },
                {
                    text: 'Total',
                    minWidth: 70,
                    width: 100,
                    // dataIndex: 'precio',
                    align: 'right',
                    renderer: function (value, meta, record) {
                        // if (value)
                        //     meta.tdAttr = 'data-qtip="' + Ext.util.Format.currency(value) + '"';
                        // return Ext.util.Format.currency(value);
                        var suma = 0;
                        var tipomoneda='montomoneda_';
                        if(record.get('fechaconversion'))tipomoneda='montomonedaconversion_';
                        // if(me.monedasentidad)
                        //     me.monedasentidad.forEach(function(field){
                        //         suma+=parseFloat(record.get(tipomoneda+field.codigoiso.toLowerCase() + '_' + field.idmoneda));
                        //     })
                        Ext.Object.each(record.raw, function(key, val) {
                            // console.log('key', key)
                            if (key.indexOf(tipomoneda) == 0){
                                suma+=parseFloat(val);
                            }
                        })
                        // meta.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(suma)+ '<br>' +
                        //     '<b>Importe</b>:'+me.formatNumber(parseFloat(importe))+'"';
                        value = me.formatNumber(suma);
                        meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: 'Importe',
                    minWidth: 70,
                    width: 100,
                    // flex: 0.1,
                    align: 'right',
                    // dataIndex: 'monto',
                    renderer: function (value, meta, record) {
                        // var suma=0, importe=0;
                        // if (!Ext.isEmpty(record.get('precio'))) {
                        //     suma += parseFloat(record.get('precio'));
                        //     importe += parseFloat(record.get('precio'))*parseFloat(record.get('cantidad'));
                        // }
                        // if (!Ext.isEmpty(record.get('preciodivisa'))) {
                        //     suma += parseFloat(record.get('preciodivisa'));
                        //     importe += parseFloat(record.get('preciodivisa'))*parseFloat(record.get('cantidad'));
                        // }
                        // meta.tdAttr = 'data-qtip="<b>Precio</b>:' + Ext.util.Format.currency(suma)+ '<br>' +
                        //     '<b>Importe</b>:'+Ext.util.Format.currency(parseFloat(importe))+'"';
                        // value = Ext.util.Format.currency(suma);
                        // return value;
                        var suma = 0, importe = 0;
                        var tipomoneda='montomoneda_';
                        if(record.get('fechaconversion'))tipomoneda='montomonedaconversion_';
                        // if(me.monedasentidad)
                        //     me.monedasentidad.forEach(function(field){
                        //         importe+=parseFloat(record.get(tipomoneda+field.codigoiso.toLowerCase() + '_' + field.idmoneda))*parseFloat(record.get('cantidad'));
                        //     })
                        Ext.Object.each(record.raw, function(key, val) {
                            if (key.indexOf(tipomoneda) == 0){
                                importe+=parseFloat(val)*record.get('cantidad');
                            }
                        })
                        // meta.tdAttr = 'data-qtip="<b>Precio</b>:' + me.formatNumber(suma)+ '<br>' +
                        //     '<b>Importe</b>:'+me.formatNumber(parseFloat(importe))+'"';
                        meta.tdAttr = 'data-qtip="' + me.formatNumber(importe) + '"';
                        return me.formatNumber(importe);
                    }
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
                    {name: 'montototal'},
                    {name: 'monto'},
                    {name: 'fechafin'},
                    {name: 'meses'},
                    {name: 'pago'},
                    {name: 'icono'},
                    {name: 'estado'},
                    {name: 'nombrearea'},
                    {name: 'inicial'},
                    {name: 'iconoestado'},
                    {name: 'nombreestado'},
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

                                $noEjecutado += parseFloat(records[i].data.montototal);

                            }

							$montoTotal+= records[i].data.montototal;
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
                xtype: 'templatecolumn',
                minWidth: 35,
                flex: 1,
                dataIndex: 'descripcion',
                renderer: mostrarTooltip,
                tpl: new Ext.XTemplate('<div style="text-align: justify;white-space: normal">{descripcion}</div>')
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
                tpl: new Ext.XTemplate('<div>{montototal:this.formatChange}</div>', {
                    formatChange: function (v) {
                        return Ext.util.Format.currency(v);
                    }
                })
            },
            {
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
            },
            {
                text: me.etiquetas.lbAreaUsuario,
                // align: 'center',
                width: 120,
                dataIndex: 'nombrearea',
                align: 'center'
            },
            {
                text: me.etiquetas.lbEstado,
                align: 'center',
                dataIndex: 'nombreestado',
                renderer: function (value, meta, record) {
                    if (value) {
                        meta.innerCls = "icondistra-" + record.data.iconoestado;
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
                    '<label style="font-weight: bolder; font-size: 14px">{tipo_de_contrato}</label>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block solicitudneogico-allrow">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbName + ':</label><span>{nombre}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block solicitudneogico-allrow">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbContratoMarco + ':</label><span>{denominacioncontratomarco}</span>',
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
                    '<label>' + me.etiquetas.lbCreadoPor + ':</label><span>{nombreareacreado}</span>',
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
                    '<span>' +
                        '<tpl if="cumplimientoobligaciones == 0">{vigencia} ' +
                        '<tpl if="unidadtiempo == 1">' + me.etiquetas.lbUTDay + '</tpl>' +
                        '<tpl if="unidadtiempo == 2">' + me.etiquetas.lbUTMonth + '</tpl>' +
                        '<tpl if="unidadtiempo == 3">' + me.etiquetas.lbUTYear + '</tpl>' +
                        '<tpl if="firmado == true">  ({diasrestantesvigencia} días restantes)<tpl else> a partir de que se firme</tpl></tpl>'+
                        '<tpl if="cumplimientoobligaciones == 1"> ' + me.etiquetas.lbCumplimiento + '</tpl>' +
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
                    '<label>' + me.etiquetas.lbIncoterms + ':</label><span>{incoterm}</span>',
                    '</div>',
                '</div>',
            '</tpl>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + 'Destino comercial' + ':</label><span>{destinocomercial}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.textClienteFinal + ':</label><span>{clientefinal}</span>',
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
            '<label>' + me.etiquetas.lbCondicionPago + ':</label><span>{condicionespago}</span>',
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
            '<label>{codigoiso}:</label><span>{monto:this.formatChange}</span>' +
            '<tpl if="incremento!=null & incremento!=0"> ' +
            '<span style="color:gray">({anterior:this.formatChange} <tpl if="incremento &gt; 0 | incremento==0">+</tpl>{incremento:this.formatChange})</span>' +
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
    },

    getTemplateAreaImplicada: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="solicitudneogico-columnheader">',
            '<div style="width:100%;"><label>' + me.etiquetas.lbName + '</label></div>',
            '</div>',
            '<tpl for=".">',
            '<div class="solicitudnegocio-row">',
            '<div style="width:100%"><span>{ruta}</span></div>',
            '</div>',
            '</tpl>'
        );
    },

    getTemplatePedidos: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="solicitudneogico-block">',
                '<div class="solicitudneogico-item">',
                    '<label>' + me.etiquetas.lbEjecutado + ':</label><span>{ejecutado:this.formatChange}</span>',
                '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbNoejecutado + ':</label><span>{noejecutado:this.formatChange}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + 'Cantidad ejecutada' + ':</label><span>{cantejecutado}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + 'Cantidad no ejecutada' + ':</label><span>{cantnoejecutado}</span>',
            '</div>',
            '</div>', {
                formatChange: function (v) {
                    return Ext.util.Format.currency(v);
                }
            }
        );
    },

    getTemplatePenalizaciones: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="solicitudneogico-columnheader">',
                '<div style="width:78%;"><label>' + 'Arribos' + '</label></div>',
                '<div style="width:10%;"><label>' + 'Cantidad' + '</label></div>',
                '<div style="width:12%;"><label>' + 'Porciento total' + '</label></div>',
            '</div>',
            '<tpl for=".">',
                '<div class="solicitudnegocio-row">',
                    '<div style="width:78%"><span>{descripcion}</span></div>',
                    '<div style="width:10%; text-align: right"><span>{cantpenalizaciones}</span></div>',
                    '<div style="width:12%; text-align: right"><span>{porcientototal}%</span></div>',
                '</div>',
            '</tpl>'
        );
    },

    getTemplateClientesAsociados: function () {
        var me = this;
        return new Ext.XTemplate(
            '<div class="solicitudneogico-columnheader">',
            '<div style="width:100%;"><label>' + me.etiquetas.lbName + '</label></div>',
            '</div>',
            '<tpl for=".">',
            '<div class="solicitudnegocio-row">',
            '<div style="width:100%"><span>{nombre}</span></div>',
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
            '<button class="icondistra-clausulacrm" idnodo="{idnodo}" ' +
            'data-qtip="Ver documento <b>{nombre}</b>" ' +
            'style="border-width: 0px 2px 3px 0px;">{nombre}</button>',
            // '<a href="{url}" target="_blank">{nombre}</a>',
            '</tpl>',
            '<script>',
            'function formatChanges(){alert(\'queseto\')',
            '</script>',
            '</span>',
            '</div>',
            '</div>',
            '</tpl>',
            '</div>',

            {
                formatChange: function () {
                    // console.log('ysysysysys')
                    // alert('wao!!!');
                    // return Ext.util.Format.currency(v);
                },
                getLinkId: function () {
                    // console.log('getLinkId')
                    // alert('wao!!!');
                    var result=Ext.id();
                    this.addListen(resultado);
                    return resultado;
                    // return Ext.util.Format.currency(v);
                },
                addListen: function(id){
                    // alert('addListen')
                    Ext.get(id).on('click', function(){
                        alert('me has dado click')
                    })
                }
            }
        );
    },
    getTemplateAnexos1: function () {
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
    },
    formatNumber: function (value) {
        return Ext.util.Format.number(value, '0.000,00/i')
        // return Ext.util.Format.currency(value);
    },

});
