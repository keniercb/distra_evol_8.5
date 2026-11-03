Ext.define('Penalizaciones.view.WinDetallesPenalizacion', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallespenalizacion',
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
    bodyCls: 'detallespenalizacion',
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

        me.title = me.etiquetas.titleWinDetallesPenalizacion;

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
            cls: 'detallespenalizacion-general',
            tpl: me.getTemplateGeneral(),
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

        me.items = [me.containerGeneral, me.fsAnexos];

        me.callParent();
    },
    show: function (record) {
        var me = this,
            data = record.getData();
        console.log('data:', data)
        Ext.Object.each(data, function (key, value) {
            console.log('key:', key, 'value:', value)
            if (['nombre', 'numcontrato', 'idtipopenalidad', 'tipopenalidad', 'contrato', 'porciento'
            ].indexOf(key) != -1 && (value == '' || value == undefined)) {
                data[key] = '<span style="color: grey">No definido</span>'
            }
        });
        me.containerGeneral.update(data);
        me.callParent();

    if(!me.fsAnexos.hidden) {
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getPenalidadesDocs'}, ModuleMgr.get('Penalizaciones')),
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
}

        me.doLayout();
        me.center();
    },
    getTemplateGeneral: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div>',
            '<div class="reclamaciones-block reclamaciones-allrow">',
            // '<div class="reclamaciones-item">',
            // '<label>' + me.etiquetas.lbFieldNombre + ':</label><span>{nombre}</span>',
            // '</div>',

            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbNumeroC + ':</label><span>{numero}</span>',
            '</div>',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas. lbFieldNombreC+ ':</label><span>{contrato}</span>',
            '</div>',
           '</div>',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbFieldNombreArribo + ':</label><span>{arribo}</span>',
            '</div>',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbFieldTipoPenalizacion + ':</label><span>{tipopenalidad}</span>',
            '</div>',
            '<div class="reclamaciones-item">',
            '<label>' + me.etiquetas.lbFieldPorciento + ':</label><span>{porciento}</span>',
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
});
