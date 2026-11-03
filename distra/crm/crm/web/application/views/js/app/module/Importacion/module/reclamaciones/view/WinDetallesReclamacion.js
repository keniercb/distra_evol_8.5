Ext.define('Reclamaciones.view.WinDetallesReclamacion', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallesreclamacion',
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
    bodyCls: 'detallesreclamacion',
    autoScroll: true,
    y: 0,
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.maxHeight = window.innerHeight;

        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';

        me.title = me.etiquetas.titleWinDetallesReclamacion;
        console.log('ENTRA EN LA VENTANA WIN DETALLES RECLAMACION')
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
            cls: 'detallesreclamacion-general',
            tpl: me.getTemplateGeneral(),
            data: []
        });

        me.fsMotivo = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbTitleTabMotivo,
            tpl: me.getTemplateMotivo(),
            data: []
        });

        me.fsPretension = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbPretension,
            tpl: me.getTemplatePretension(),
            data: []
        });

        me.fsFundamentacionlegal = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbFL,
            tpl: me.getTemplateFundamentacionlegal(),
            data: []
        });

        me.fsAnexos = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.titleDocumentosAdicionales,
            tpl: me.getTemplateAnexos(),
            hidden: true,
            data: []
        });

        me.gridProducto = Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto', {
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

        me.fsProductos = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbProductos,
            padding: '5 5 10 5',
            tpl: me.getTemplateProducto(),
            data: []
        });

        me.items = [me.containerGeneral, me.fsAnexos, me.fsMotivo, me.fsPretension, me.fsFundamentacionlegal, me.fsProductos];

        me.callParent();

        me.gridProducto.dockedItems.items[1].setVisible(false);
        me.gridProducto.columns.forEach(function (x) {
            x.hideable = false;
            if (['unidadmedida', 'precio', 'preciodivisa'].indexOf(x.dataIndex) != -1)
                x.hidden = true;
        });
        me.gridProducto.selModel = null;
    },
    show: function (record) {
        var me = this,
            data = record.getData();
        console.log('data:', data)
        Ext.Object.each(data, function (key, value) {
            console.log('key:', key, 'value:', value)
            if (['nombre', 'numero', 'tiporeclamacion', 'cliente', 'proveedor', 'linea', 'tipolinea', 'fecha', 'contrato',
            ].indexOf(key) != -1 && (value == '' || value == undefined)) {
                data[key] = '<span style="color: grey">No definido</span>'
            }
        });
        me.containerGeneral.update(data);
        me.fsMotivo.update(data);
        me.fsPretension.update(data);
        me.fsFundamentacionlegal.update(data);
        me.callParent();
        var mask = new Ext.LoadMask(me.fsProductos, {msg: me.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'cargarProductosReclamaciones'}, ModuleMgr.get('Reclamaciones')),
            params: {idreclamacion: data['idreclamacion']},
            callback: function (options, success, response) {
                console.log(options)
                console.log(response)
                mask.hide();
                if (success) {
                    var info = Ext.decode(response.responseText);
                    console.log('info:', info)
                    if (info.productos.length > 0) {
                        me.fsProductos.update(info.productos);
                    }
                    me.doLayout();
                }
            }
        });
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getReclamacionDocs'}, ModuleMgr.get('Reclamaciones')),
            params: {idespaciotrabajo: data['idespaciotrabajo']},
            callback: function (options, success, response) {
                if (success) {
                    var info = Ext.decode(response.responseText);
                    console.log('info:', info)
                    if (info.length > 0) {
                        me.fsAnexos.update(info);
                        console.log('me.fsAnexos', me.fsAnexos);
                        me.fsAnexos.show();
                    }

                    me.doLayout();

                } else {
                    me.fsAnexos.setVisible(false);
                }
            }
        });

        me.doLayout();
        var mask2 = new Ext.LoadMask(me.fsProveedores, {msg: me.etiquetas.msgLoading});
        mask2.show();
        me.doLayout();
        me.center();
    },
    getTemplateGeneral: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div>',
            '<div class="reclamaciones-block reclamaciones-allrow">',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbFieldNombre + ':</label><span>{nombre}</span>',
            '</div>',

            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbFieldNumero + ':</label><span>{numero}</span>',
            '</div>',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbFieldTipoReclamacion + ':</label><span>{tiporeclamacion}</span>',
            '</div>',
            '</div>',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbFieldCliente + ':</label><span>{cliente}</span>',
            '</div>',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbFieldProveedor + ':</label><span>{proveedor}</span>',
            '</div>',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbBtnLinea + ':</label><span>{linea}</span>',
            '</div>',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbBtnTipoLinea + ':</label><span>{tipolinea}</span>',
            '</div>',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbFieldFecha + ':</label><span>{fecha}</span>',
            '</div>',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbFieldContrato + ':</label><span>{contrato}</span>',
            '</div>',
            '</div>'
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

    getTemplateProducto: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="solicitudneogico-columnheader">',
            '<div style="width:90%;"><label>' + me.etiquetas.lbDescripcion + '</label></div>',
            '<div style="width:10%;"><label>' + me.etiquetas.lbCantidad + '</label></div>',
            '</div>',
            '<tpl for=".">',
            '<div class="solicitudnegocio-row">',
            '<div style="width:90%"><span>{denominacion}</span></div>',
            '<div style="width:10%"><span>{cantidad}</span></div>',
            '</div>',
            '</tpl>'
        );
    },

    getTemplateMotivo: function () {
        return new Ext.XTemplate('<div>{motivo}</div>');
    },
    getTemplatePretension: function () {
        return new Ext.XTemplate('<div>{pretension}</div>');
    },
    getTemplateFundamentacionlegal: function () {
        return new Ext.XTemplate('<div>{fundamentacionlegal}</div>');
    },
});
