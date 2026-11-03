Ext.define('Demanda.view.WinDetallesDemanda', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallesdemanda',
    margin: false,
    width: 800,
    maxHeight: 600,
    closable: true,
    closeAction: 'destroy',
    modal: true,
    resizable: false,
    bodyStyle: {
        padding: '10px',
        background: 'white'
    },
    bodyCls: 'detallesdemanda',
    autoScroll: true,
    y: 0,
    x: 0,
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.maxHeight = window.innerHeight;

        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';

        me.title = me.etiquetas.titleWinDetallesDemanda;

        me.buttons = [{
            text: me.etiquetas.lbBtnCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.qtipCerrar,
            handler: function () {
                me.close();
            }
        }];

        me.containerGeneral = Ext.create('Ext.container.Container', {
            cls: 'detallesdemanda-general',
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
            maxHeight: 200,
            autoScroll: true,
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
            hidden:true,
            title: me.etiquetas.titleDocumentosAdicionales,
            tpl: me.getTemplatDocAdicionales(),
            data: []
        });

        me.gridProductoServicios = Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto', {
            border: 0.1,
            style: {
                borderColor: '#99BCE8',
                borderStyle: 'solid'
            },
            margin: '5 0 10 0',
            layout: 'fit',
            emptyText: me.etiquetas.msgNoDataLoaded,
            maxHeight: 200,
            autoScroll: true,
            minHeight: 80
        });

        me.fsProductosServicios = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbProductoServicio,
            padding: '5 5 10 5',
            maxHeight: 200,
            autoScroll: true,
            tpl: me.getTemplateProductoServicio(),
            data: []
        });

        me.items = [me.containerGeneral, me.fsProveedores, me.fsAreaImplicadas, me.fsDescripcion,
            me.fsDocAdicionales, me.fsProductosServicios];

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
        // console.log('data:', data)
        Ext.Object.each(data, function (key, value) {
            if (['linea', 'tipolinea', 'responsable', 'arearesponsable', 'nombrepersona', 'fechacreada',
                'fechafin', 'fechafin','verMotivo',// , 'descripcion', 'objeto'
                'numero'].indexOf(key) != -1 && (value == '' || value == undefined)) {
                data[key] = '<span style="color: grey">No definido</span>'
            }
        });
        me.containerGeneral.update(data);
        me.fsDescripcion.update(data);
        me.callParent();
        var mask = new Ext.LoadMask(me.fsProductosServicios, {msg: me.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerProductoServicio'}, ModuleMgr.get('Demanda')),
            params: {idsolicitud: data['idsolicitud']},
            callback: function (options, success, response) {
                mask.hide();
                if (success) {
                    var info = Ext.decode(response.responseText);
                    // console.log('info:', info)
                    if (info.datos.length > 0) {
                        var canttotal=0, totaltotal=0, importetotal=0;
                        for(var i in info.datos){
                            info.datos[i]['cantidad']=parseInt(info.datos[i]['cantidad']);
                            var total=0, importe=0;
                            // var total=parseFloat(info.datos[i]['precio'])+parseFloat(info.datos[i]['preciodivisa']);
                            // var importe=(parseFloat(info.datos[i]['precio'])+
                            //     parseFloat(info.datos[i]['preciodivisa']))*parseFloat(info.datos[i]['cantidad']);
                            Ext.Object.each(info.datos[i], function(key, value){
                                // if(i==0)
                                //     console.log('Key:', key, 'value:', value, /^montomoneda_/.test(key))
                                if(/^montomoneda_/.test(key)){
                                    total += parseFloat(value);
                                    importe += parseFloat(value)*info.datos[i]['cantidad'];
                                }
                            })
                            canttotal+=info.datos[i]['cantidad'];
                            totaltotal+=total;
                            importetotal+=importe;
                            info.datos[i]['total']=Ext.util.Format.number(total, '0.000,00/i');
                            info.datos[i]['importe']=Ext.util.Format.number(importe, '0.000,00/i');
                        }
                        info.datos.splice(0, 0, {
                            'denominacion': '<b>Totales: '+info.datos.length+'</b>',
                            'cantidad': '<b>'+canttotal+'</b>',
                            'total': '<b>'+Ext.util.Format.number(totaltotal, '0.000,00/i')+'</b>',
                            'importe': '<b>'+Ext.util.Format.number(importetotal, '0.000,00/i')+'</b>'})
                        // console.log(info.datos)
                        me.fsProductosServicios.update(info.datos);
                    }
                    // else{
                    //     me.fsProductosServicios.setVisible(false);
                    // }
                    me.doLayout();
                }
            }
        });
        var mask3 = new Ext.LoadMask(me.fsAreaImplicadas, {msg: me.etiquetas.msgLoading});
        mask3.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getAreasImplicadas'}, ModuleMgr.get('Demanda')),
            params: {idsolicitud: data['idsolicitud']},
            callback: function (options, success, response) {
                mask3.hide();
                if (success) {
                    var info = Ext.decode(response.responseText);
                    if (info.length > 0) {
                        me.fsAreaImplicadas.update(info);
                    }
                    else {
                        me.fsAreaImplicadas.setVisible(false);
                    }
                    me.doLayout();
                }
            }
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getDemandaDocs'}, ModuleMgr.get('Demanda')),
            params: {idespaciotrabajo: data['idespaciotrabajo']},
            callback: function (options, success, response) {
                if (success) {
                    var info = Ext.decode(response.responseText);
                    if(info.length>0){
                        me.fsDocAdicionales.setVisible(true);
                        me.fsDocAdicionales.update({anexos: info});
                        me.doLayout();
                    }
                }
            }
        });
        // if (data['cliente'] == 2 || data['cliente'] == 4) {
        //     me.fsProveedores.setVisible(true);
        //     me.fsAreaImplicadas.setVisible(false);
        //     me.doLayout();
        //     var mask2 = new Ext.LoadMask(me.fsProveedores, {msg: me.etiquetas.msgLoading});
        //     mask2.show();
        //     Ext.Ajax.request({
        //         url: UtilsFn.buildUrl({action: 'cargarProveedoresSolicitud'}, ModuleMgr.get('SolicitudNegocioImportacion')),
        //         params: {idsolicitud: data['idsolicitud']},
        //         callback: function (options, success, response) {
        //             mask2.hide();
        //             if (success) {
        //                 var info = Ext.decode(response.responseText);
        //                 me.fsProveedores.update(info.datos);
        //                 setTimeout(function () {
        //                     me.doLayout();
        //                 }, 1000)
        //             }
        //         },
        //     });
        // }
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
            '<tpl if="objeto !=null ">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbMotivo + ':</label><span>{objeto}</span>',
            '</div>',
            '</tpl>',
            '<tpl if="cliente==3">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbFieldCliente + ':</label><span>{clienteproveedor}</span>',
            '</div>',
            '</tpl>',
            '<tpl if="cliente==3">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbBtnLinea + ':</label><span>{linea}</span>',
            '</div>',
            '</tpl>',
            '<tpl if="cliente==3">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbBtnTipo + ':</label><span>{tipolinea}</span>',
            '</div>',
            '</tpl>',
            '<tpl if="cliente==3">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbFieldResponsable + ':</label><span>{nombrepersona}</span>',
            '</div>',
            '</tpl>',
            '<tpl if="cliente==3">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbFieldSector + ':</label><span>{sector}</span>',
            '</div>',
            '</tpl>',
            // '<tpl if="cliente==4">',
            // '<div class="solicitudneogico-item">',
            // '<label>' + me.etiquetas.lbFieldSolicituDemanda + ':</label><span>{solicituddemanda}</span>',
            // '</div>',
            // '</tpl>',
            // '<tpl if="cliente==4">',
            // '<div class="solicitudneogico-item">',
            // '<label>' + me.etiquetas.lbFieldNumero + ':</label><span>{numero}</span>',
            // '</div>',
            // '</tpl>',
            // '<tpl if="cliente==4">',
            // '<div class="solicitudneogico-item">',
            // '<label>' + me.etiquetas.lbFieldFechaInicio + ':</label><span>{fechacreada}</span>',
            // '</div>',
            // '</tpl>',
            // '<tpl if="cliente==4">',
            // '<div class="solicitudneogico-item">',
            // '<label>' + me.etiquetas.lbFieldFechaFin + ':</label><span>{fechafin}</span>',
            // '</div>',
            // '</tpl>',
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
            '<div class="solicitudneogico-row">',
            '<div style="width:100%"><span>{nombre}</span></div>',
            '</div>',
            '</tpl>'
        );
    },
    getTemplateProductoServicio: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="solicitudneogico-columnheader">',
                '<div style="width:60%;"><label>' + me.etiquetas.lbDescripcion + '</label></div>',
                '<div style="width:10%;"><label>' + me.etiquetas.lbCantidad + '</label></div>',
                '<div style="width:15%;"><label>' + me.etiquetas.lbTotal + '</label></div>',
                '<div style="width:15%;"><label>' + me.etiquetas.lbImporte + '</label></div>',
                // '<div style="width:15%;"><label>' + me.etiquetas.lbTipo + '</label></div>',
            '</div>',
            '<tpl for=".">',
                '<div class="solicitudnegocio-row">',
                    '<div style="width:60%"><span>{denominacion}</span></div>',
                    '<div style="width:10%; text-align: right"><span>{cantidad}</span></div>',
                    '<div style="width:15%; text-align: right"><span>{total}</span></div>',
                    '<div style="width:15%; text-align: right"><span>{importe}</span></div>',
                    // '<div style="width:15%">' +
                    // '<tpl if="tipo==1"><span class="icondistra-producto icon-small">Producto' +
                    // '<tpl else><span class="icondistra-servicio icon-small">Servicio</tplelse></tpl>' +
                    // '</span></div>',
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
