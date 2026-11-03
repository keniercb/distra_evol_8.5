Ext.define('SolicitudNegocio.view.WinDetallesSolicitud', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallessalocitud',
    margin: false,
    width: 600,
    maxHeight: 600,
    closable: true,
    closeAction: 'destroy',
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
        me.etiquetas = LangMgr.getLang(me);
        me.maxHeight = window.innerHeight;

        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';

        me.title = me.etiquetas.titleWinDetallesSolicitud;

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
            cls: 'detallessolicitud-general',
            tpl: me.getTemplateGeneral(),
            data: []
        });

        me.fsProveedores = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            padding: '5 5 10 5',
            defaults: {flex: 1},
            title: me.etiquetas.lbFieldProveedores,
            hidden: true,
            tpl: me.getTemplateProveedores(),
            data: []
        });

        me.fsAreaImplicadas = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            padding: '5 5 10 5',
            defaults: {flex: 1},
            title: me.etiquetas.lbAreasImplicadas,
            tpl: me.getTemplateAreaImplicada(),
            data: []
        });

        me.fsDescripcion = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbTitleTabDDescripcion,
            tpl: me.getTemplateDescripcion(),
            data: []
        });

        me.fsDocAdicionales = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.titleDocumentosAdicionales,
            tpl: me.getTemplatDocAdicionales(),
            data: [],
            hidden: true,
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

        me.gridProductoServicios = Ext.create('GestionContrato.view.FormaPago.Producto.GridProducto', {
            border: 0.1,
            style: {
                borderColor: '#99BCE8',
                borderStyle: 'solid'
            },
            margin: '5 0 10 0',
            layout: 'fit',
            emptyText: me.etiquetas.msgNoDataLoaded,
            maxHeight: 300,
            minHeight: 80
        });

        me.fsProductosServicios = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbProductoServicio,
            padding: '5 5 10 5',
            tpl: me.getTemplateProductoServicio(),
            data: []
        });

        me.items = [me.containerGeneral, me.fsProveedores, me.fsAreaImplicadas, me.fsDescripcion,
            me.fsDocAdicionales, me.fsDocAdicionales, me.fsProductosServicios];

        me.callParent();

        me.gridProductoServicios.dockedItems.items[1].setVisible(false);
        me.gridProductoServicios.columns.forEach(function (x) {
            x.hideable = false;
            if (['unidadmedida', 'precio', 'preciodivisa'].indexOf(x.dataIndex) != -1)
                x.hidden = true;
        });
        me.gridProductoServicios.selModel = null;
    },
    show: function (record) {
        var me = this,
            data = record.getData();
        
        console.log('data:', data)
        me.containerGeneral.update(data);
        me.fsDescripcion.update(data);
        me.callParent();
        var mask = new Ext.LoadMask(me.fsProductosServicios, {msg: me.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerProductoServicio'}, ModuleMgr.get('SolicitudNegocio')),
            params: {idsolicitud: data['idsolicitud']},
            callback: function (options, success, response) {
                mask.hide();
                if (success) {
                    var info = Ext.decode(response.responseText);
                    console.log('info:', info)
                    me.fsProductosServicios.update(info.datos);
                    me.doLayout();
                }
            }
        });
        var mask3 = new Ext.LoadMask(me.fsAreaImplicadas, {msg: me.etiquetas.msgLoading});
        mask3.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getAreasImplicadas'}, ModuleMgr.get('SolicitudNegocio')),
            params: {idsolicitud: data['idsolicitud']},
            callback: function (options, success, response) {
                mask3.hide();
                if (success) {
                    var info = Ext.decode(response.responseText);
                    console.log('info:', info)
                    me.fsAreaImplicadas.update(info);
                    me.doLayout();
                }
            }
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getSolicitudDocs'}, ModuleMgr.get('SolicitudNegocio')),
            params: {idespaciotrabajo: data['idespaciotrabajo']},
            callback: function (options, success, response) {
                if (success) {
                    var info = Ext.decode(response.responseText);
                    me.fsDocAdicionales.update({anexos: info});
				   me.fsDocAdicionales.fireEvent('afterrender', me.fsDocAdicionales)
           if(info.length>0)me.fsDocAdicionales.show();
                    me.doLayout();
					
                }
            }
        });
        if (data['cliente'] == 2) {
            me.fsProveedores.setVisible(true);
            me.doLayout();
            var mask2 = new Ext.LoadMask(me.fsProveedores, {msg: me.etiquetas.msgLoading});
            mask2.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'cargarProveedoresSolicitud'}, ModuleMgr.get('SolicitudNegocio')),
                params: {idsolicitud: data['idsolicitud']},
                callback: function (options, success, response) {
                    mask2.hide();
                    if (success) {
                        var info = Ext.decode(response.responseText);
                        me.fsProveedores.update(info.datos);
                        setTimeout(function () {
                            me.doLayout();
                        }, 1000)
                    }
                },
            });
        }
        me.doLayout();
        me.center();
    },
    getTemplateGeneral: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div>',
            '<div class="solicitudneogico-block solicitudneogico-allrow">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbFieldNombre + ':</label><span>{nombre}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbAreaResponsable + ':</label><span>{arearesponsable}</span>',
            '</div>',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbFieldSector + ':</label><span>{sector}</span>',
            '</div>',
            '<tpl if="cliente!=2">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbFieldCliente + ':</label><span>{clienteproveedor}</span>',
            '</div>',
            '</tpl>',
            '</div>'
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
    getTemplateProveedores: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="solicitudneogico-columnheader">',
            '<div style="width:100%;"><label>' + me.etiquetas.lbDenominacion + '</label></div>',
            '</div>',
            '<tpl for=".">',
            '<div class="solicitudnegocio-row">',
            '<div style="width:100%"><span>{nombre}</span></div>',
            '</div>',
            '</tpl>'
        );
    },
    getTemplateProductoServicio: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="solicitudneogico-columnheader">',
            '<div style="width:70%;"><label>' + me.etiquetas.lbDescripcion + '</label></div>',
            '<div style="width:15%;"><label>' + me.etiquetas.lbCantidad + '</label></div>',
            '<div style="width:15%;"><label>' + me.etiquetas.lbTipo + '</label></div>',
            '</div>',
            '<tpl for=".">',
            '<div class="solicitudnegocio-row">',
            '<div style="width:70%"><span>{denominacion}</span></div>',
            '<div style="width:15%"><span>{cantidad}</span></div>',
            '<div style="width:15%">' +
            '<tpl if="tipo==1"><span class="icondistra-producto icon-small">Producto' +
            '<tpl else><span class="icondistra-servicio icon-small">Servicio</tplelse></tpl>' +
            '</span></div>',
            '</div>',
            '</tpl>'
        );
    },

    getTemplateDescripcion: function () {
        return new Ext.XTemplate('<div>{descripcion}</div>');
    },
    getTemplatDocAdicionales: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div>',
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
