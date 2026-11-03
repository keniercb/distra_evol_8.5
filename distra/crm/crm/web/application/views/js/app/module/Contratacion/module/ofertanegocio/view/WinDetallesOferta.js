Ext.define('OfertaNegocio.view.WinDetallesOferta', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallesoferta',
    margin: false,
    width: 800,
    maxHeight: 500,
    closable : true,
    closeAction: 'destroy',
    modal: true,
    resizable : true,
    bodyStyle: {
        padding: '10px',
        background: 'white'
    },
    bodyCls: 'detallesoferta',
    autoScroll: true,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.maxHeight=window.innerHeight;
        me.title = me.etiquetas.titleWinDetallesOferta;

        me.buttons = [{
            text: me.etiquetas.lbBtnCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.qtipCerrar,
            action: 'cerrar',
            handler:function(){
                me.close();
            }
        }];

        me.containerGeneral = Ext.create('Ext.container.Container',{
            cls: 'detallesoferta-general',
            tpl: me.getTemplateGeneral(),
            data: []
        });
        
        me.fsDescripcion = Ext.create('Ext.form.FieldSet',{
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbTitleTabDDescripcion,
            tpl: me.getTemplateDescripcion(),
            data: []
        });

        me.fsObjeto = Ext.create('Ext.form.FieldSet',{
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbObjeto,
            tpl: me.getTemplateObjeto(),
            data: []
        });

        me.fsDocAdicionales = Ext.create('Ext.form.FieldSet',{
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.titleDocumentosAdicionales,
            tpl: me.getTemplatDocAdicionales(),
            data: [],
            hidden: true,
            listeners:{
                afterrender: function(){
                    var me=this;
                    console.log('afterrender', me.getEl().query('button'))
                    me.getEl().query('button').forEach(function(x){
                        x.onclick=function(){
                            window.open('/crm/contratacion/index.php/gestioncontrato/getDocumentos?idnodo='+x.getAttribute('idnodo'));
                            // Ext.Ajax.request({
                            //     url: UtilsFn.buildUrl({action: 'getDocumento'}, ModuleMgr.get('OfertaNegocio')),
                            //     params: {
                            //         idnodo: Ext.encode(x.getAttribute('idnodo'))
                            //     },
                            //     success: function (response, opts) {
                            //         var response = Ext.decode(response.responseText);
                            //     },
                            //     failure: function (response, opts) {
                            //
                            //     }
                            // })
                        }
                    })
                },
            },
        });

        this.createGridHitos();
        this.createGridProductos();

        me.tabCobroPago = Ext.create('Ext.tab.Panel', {
            minHeight: 80,
            maxHeight:300,
            margin: '0 0 10 0',
            activeTab: 0,
            items: [this.gridHitos, this.gridProductos]
        });

        me.items = [me.containerGeneral, me.fsDescripcion, me.fsObjeto,
            me.fsDocAdicionales, me.tabCobroPago];
        me.callParent();
    },
    show:function(record){
        var me = this,
            data = record.getData();
        console.log('Datos detalle', data);
        data['monedas']=[];
        Ext.Object.each(data, function(key, value){
            if(key.indexOf('montomoneda_')==0){
                data['monedas'].push({codigoiso:key.split('_')[1].toUpperCase(), monto: value});
            }
        })

        me.containerGeneral.update(data);
        me.fsDescripcion.update(data);
        me.fsObjeto.update(data);

        me.callParent();
        var mask = new Ext.LoadMask(me.tabCobroPago.el, {msg: me.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, ModuleMgr.get('OfertaNegocio')),
            params:{idoferta: record.get('idoferta')},
            callback: function (options, success, response) {
                mask.hide();
                var info = Ext.decode(response.responseText);
                if(info.indicadores){
                    if(info.indicadores.length>0){
                        me.tabCobroPago.setActiveTab(1);
                        me.gridProductos.getStore().loadData(info.indicadores);
                    }
                    if(info.hitos.length>0){
                        me.tabCobroPago.setActiveTab(0);
                        me.gridHitos.getStore().loadData(info.hitos);
                    }
                    if(info.indicadores.length>0 || info.hitos.length>0)
                        setTimeout(function(){
                            me.setHeight();
                        }, 200);
                }

                if(info.anexos && info.anexos.length>0){
                    me.fsDocAdicionales.update(info);
                    me.fsDocAdicionales.show();
                    me.fsDocAdicionales.fireEvent('afterrender', me.fsDocAdicionales);
                }
            }
        });
        me.center();
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
                    renderer:function(value,meta, record){
                        var valor=Ext.util.Format.number(value, '0.000,00/i');
                        if (!Ext.isEmpty(value)) {
                            meta.tdAttr = 'data-qtip="<b>Base</b>: ' + Ext.util.Format.number(value, '0.000,00/i') + '<br>' +
                                '<b>Total</b>: '+Ext.util.Format.number(parseFloat(value)*parseFloat(record.get('cantidad')),'0.000,00/i')+'"';
                        }
                        return valor;
                    }
                }, {
                    text: this.etiquetas.lbMonto || 'Monto',
                    minWidth: 70,
                    flex: 0.1,
                    dataIndex: 'monto'
                }
            ];

        this.gridProductos = Ext.create('Ext.grid.Panel', {
            title: me.etiquetas.lbProdServ,
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
                    {name: 'estado'}
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
            });
        function mostrarTooltip(value, meta){
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
                dataIndex:'numero',
                renderer:mostrarTooltip(),
                tpl: new Ext.XTemplate('<div>{numero}</div>')
            }, {
                text: me.etiquetas.lbDescripcion,
                minWidth: 35,
                flex: 1,
                dataIndex:'descripcion',
                renderer:mostrarTooltip
            }, {
                text: me.etiquetas.lbFechaFin,
                align: 'center',
                width: 80,
                xtype: 'templatecolumn',
                dataIndex:'fechafin',
                renderer:mostrarTooltip(),
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
                dataIndex:'estado',
                renderer:function(value, meta, record){
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
            viewConfig:{
                loadMask:false
            }
        });
    },
    setHeight: function () {
        var actual=this.tabCobroPago;
        this.tabCobroPago.setHeight(actual.getHeight());
    },
    getTemplateGeneral: function(){
        var me = this;

        return new Ext.XTemplate(
            '<div>',
                '<div class="ofertanegocio-block ofertanegocio-allrow">',
                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbNombre+':</label><span>{nombre}</span>',
                    '</div>',
                '</div>',
                '<div class="ofertanegocio-block ofertanegocio-allrow">',
                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbSolicitud+':</label><span>#{numerosolicitud} - {solicitud}</span>',
                    '</div>',
                '</div>',
                '<div class="ofertanegocio-block ofertanegocio-allrow">',
                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbCliente+':</label><span>{clienteproveedor}</span>',
                    '</div>',
                '</div>',
                '<div class="ofertanegocio-block ofertanegocio-allrow">',
                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbAreaResponsable+':</label><span>{arearesponsable}</span>',
                    '</div>',
                '</div>',
                '<div class="ofertanegocio-block ofertanegocio-block5">',
                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbSector+':</label><span>{sector}</span>',
                    '</div>',
                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbResponsable+':</label><span>{nombreresponsable}</span>',
                    '</div>',
                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbFechaFirma+':</label><span>{fechafirma}</span>',
                    '</div>',
                '</div>',

                '<div class="ofertanegocio-block ofertanegocio-block5">',
                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbFechaInicio+':</label><span>{fechainicio}</span>',
                    '</div>',
                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbMedioPago+':</label><span>{mediopago}</span>',
                    '</div>',
                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbCondicionPago+':</label><span>{condicionpago}</span>',
                    '</div>',
                '</div>',

                '<div class="ofertanegocio-block ofertanegocio-block5">',

                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbVigencia+':</label><span>{vigencia} <tpl if="unidadtiempo == 1">'+me.etiquetas.lbUTDay+'<tpl else>'+me.etiquetas.lbUTMonth+'</tpl></span>',
                    '</div>',
                    '<tpl for="monedas">',
                        '<div class="solicitudneogico-item">',
                            '<label>{codigoiso}:</label><span>{monto:this.formatChange}</span>' +
                        '</div>',
                    '</tpl>',
                    '<div class="ofertanegocio-item">',
                        '<label>'+me.etiquetas.lbMontoTotal+':</label><span>{montototal:this.formatChange}</span>',
                    '</div>',
                '</div>',
            '</div>', {
                formatChange: function (v) {
                    return Ext.util.Format.currency(v);
                }
            }
        );
    },
    getTemplateDescripcion: function(){
        return new Ext.XTemplate('<div>{descripcion}</div>');
    },
    getTemplateObjeto: function(){
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
 '<button class="icondistra-clausulacrm" idnodo="{idnodo}" ' +
                        'data-qtip="Ver documento <b>{nombre}</b>" ' +
                        'style="border-width: 0px 2px 3px 0px;">{nombre}</button>',
                        
                        // '<a href="{url}" target="_blank">{nombre}</a>',

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
