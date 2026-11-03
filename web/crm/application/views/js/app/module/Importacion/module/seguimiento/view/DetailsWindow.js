Ext.define('Seguimiento.view.DetailsWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallesseguimiento',
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
    bodyCls: 'detallesseguimiento',
    autoScroll: true,
    initComponent: function () {
        var me = this;

        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';

        me.etiquetas = LangMgr.getLang(me);

        me.title = me.etiquetas.lbDetA;

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
            cls: 'detallesseguimiento-general',
            tpl: me.getTemplateGeneral(),
            data: []
        });

        me.fsDescripcion = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbDescripcion,
            tpl: me.getTemplateDescripcion(),
            data: []
        });

        // me.fsHitos = Ext.create('Ext.form.FieldSet', {
        //     layout: 'anchor',
        //     defaults: {flex: 1},
        //     title: me.etiquetas.lbHitos,
        //     padding: '5 5 10 5',
        //     tpl: me.getTemplateHitos(),
        //     data: []
        // });

        me.fsAnexos = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbObjetivos,
            tpl: me.getTemplateObjetivos(),
            data: []
        });

        me.fsFacturas = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbFacturas,
            padding: '5 5 10 5',
            tpl: me.getTemplateFacturas(),
            data: []
        });

        me.fsObjetivos = Ext.create('Ext.form.FieldSet', {
            layout: 'anchor',
            defaults: {flex: 1},
            title: me.etiquetas.lbObjetivos,
            tpl: me.getTemplateObjetivos(),
            data: []
        });

        me.items = [me.containerGeneral, me.fsObjetivos, me.fsDescripcion, me.fsFacturas, me.fsHitos];
        me.callParent();
    },
    show: function (record) {
        var me = this,
            data = record.getData();
        console.log('data', data)
        me.containerGeneral.update(data);
        data['objetivos'] ? me.fsObjetivos.update(data) : me.fsObjetivos.setVisible(false);
        me.fsDescripcion.update(data);

        me.on({
            show: function () {
                me.getFacturas(data.idarribo);
            }
        });


        me.callParent();

        me.center();
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
            '<label>' + me.etiquetas.lbContrato + ':</label><span>{contrato}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbCodigo + ':</label><span>{codigo}</span>',
            '</div>',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbAreaResponsable + ':</label><span>{nombrearea}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbFormaPago + ':</label><span>{mediopago}</span>',
            '</div>',
            '<div class="solicitudneogico-item">',
            '<label>' + me.etiquetas.lbFechaRecibo + ':</label><span>{fecharecibo}</span>',
            '</div>',

            '</div>',
            '</div>'
        );
    },
    getTemplateDescripcion: function () {
        return new Ext.XTemplate('<div>{descripcion}</div>');
    },
    getTemplateObjetivos: function () {
        return new Ext.XTemplate('<div>{objetivos}</div>');
    },
    getTemplateAnexos: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="detallessolicitud">',
            '<tpl for="data">',
            '<div class="solicitudneogico-block  solicitudneogico-allrow">',
            '<div class="solicitudneogico-item">',
            '<tpl if="archivo">',
            '<label>' + me.etiquetas.lbDocumento + ':</label><a href="{archivo}" target="_blank">{archivoNombre}</a>',
            '</tpl>',
            '</div>',
            '</div>',
            '<tpl for="importe">',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>{iso:this.upperCase}:</label><span>{importe}</span>',
            '</div>',
            '</div>',
            '</tpl>',
            '</tpl>',
            '</div>', {
                formatChange: function (v) {
                    return Ext.util.Format.currency(v);
                },
                upperCase: function (v) {
                    return v.toUpperCase();
                }
            }
        );
    },

    getTemplateFacturas: function () {
        var me = this;
        return new Ext.XTemplate(
            '<div class="solicitudneogico-columnheader">',
                '<div style="width:{num_len}%;"><label>' + me.etiquetas.lbNumFactura + '</label></div>',

                '<tpl for="monedas">',
                    '<div style="width:10%;"><span>{iso}</span></div>',
                '</tpl>',
                '<div style="width:15%;"><label>Monto total</label></div>',
//                 '<div style="width:10%;"><label>aaaaa</label></div>',
            '</div>',
                '<tpl for="data">',
                    '<div class="solicitudnegocio-row">',
                        '<div style="width:{num_len}%"><span>{numero}</span></div>',
                        '<tpl for="importe">',
                            '<div style="width:10%; text-align: right"><span>{importe}</span></div>',
                        '</tpl>',
                        '<div style="width:15%; text-align: right"><span>{monto}</span></div>',
                    '</div>',
                '</tpl>'
        );
    },
    // getTemplateHitos: function (){
    //     var me = this;
    //
    //     return new Ext.XTemplate(
    //         '<div class="solicitudneogico-columnheader">',
    //         '<div style="width:20%;"><label>' + me.etiquetas.lbNumeroHito + '</label></div>',
    //         '<div style="width:55%;"><label>' + me.etiquetas.lbDescripcionHito + '</label></div>',
    //         '<div style="width:25%;"><label>' + me.etiquetas.lbNombreestado + '</label></div>',
    //         '</div>',
    //         '<tpl for="data">',
    //         '<div class="solicitudnegocio-row">',
    //         '<div style="width:20%"><span>{numero}</span></div>',
    //         '<div style="width:55%"><span>{descripcion}</span></div>',
    //         '<div style="width:25%"><span class="icondistra-{icono} icon-small">{nombre}</span></div>',
    //         '</div>',
    //         '</tpl>'
    //     );
    // },

    getFacturas: function (idarribo) {
        var me = this,
            mask = new Ext.LoadMask(me.el, {msg: me.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            params: {
                idarribo: idarribo
            },
            scope: this,
            url: UtilsFn.buildUrl({action: 'cargarFacturas'}, ModuleMgr.get('Seguimiento')),
            success: function (response) {
                var response = Ext.decode(response.responseText);
                response = this.groupCoins(response);
//                 console.log(response)
//                 this.fsAnexos.update(response);
                this.fsFacturas.update(response);
                mask.hide();
            }
        })
    },

    // getHitos: function (idseguimiento) {
    //     var me = this,
    //         mask = new Ext.LoadMask(me.el, {msg: me.etiquetas.msgLoading});
    //     mask.show();
    //     Ext.Ajax.request({
    //         params: {
    //             idseguimiento: idseguimiento
    //         },
    //         scope: this,
    //         url: UtilsFn.buildUrl({action: 'cargarHitos'}, ModuleMgr.get('Seguimiento')),
    //         success: function (response) {
    //             var response = Ext.decode(response.responseText);
    //             console.log(response);
    //             console.log(response.data);
    //             console.log(response.data.length);
    //             if(response.data.length>0){
    //                 this.fsHitos.update(response);
    //             }
    //             else{
    //                 this.fsHitos.setVisible(false);
    //             }
    //             mask.hide();
    //         }
    //     })
    // },

    groupCoins: function (response) {
        var isos = [], isosencontrados = [];
        Ext.each(response.data, function (object, index) {
            object.importe = new Array();
            object.monto=0;
            for (k in object) {
                if (k != 'importe' && k.indexOf('importe_') == 0) {
                    var iso = k.split('importe_')[1];
                    object.monto+=parseFloat(object[k]);
                    object.importe.push({'iso': iso, 'importe': Ext.util.Format.currency(object[k])});
                    if (isosencontrados.indexOf(iso) == -1) {
                        isosencontrados.push(iso);
                        isos.push({'iso': iso.toUpperCase()});
                    }

                }
            }
            object.num_len = 100 - ((isos.length * 10)+15);
            object.monto=Ext.util.Format.currency(object.monto);
            response.data[index] = object;
        });
        response.monedas = isos;
        response.num_len = 100 - ((isos.length * 10)+15);
        return response;
    }

});
