Ext.define('Comite.view.WinDetallesOferta', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallesoferta',
    margin: false,
    width: 670,
    maxHeight: 500,
    closable: true,
    closeAction: 'hide',
    modal: true,
    resizable: true,
    bodyStyle: {
        padding: '10px',
        background: 'white'
    },
    bodyCls: 'detallesoferta',
    autoScroll: true,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.title = me.etiquetas.titleDetailsOffer;

        me.buttons = [{
            text: me.etiquetas.lbTabClose,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.qtipClose,
            action: 'close',
            handler: function () {
                me.close();
            }
        }];

        me.containerGeneral = Ext.create('Ext.container.Container', {
            cls: 'detallesoferta-general',
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

        me.items = [me.containerGeneral, me.fsDescripcion];
        me.callParent();
    },
    show: function (record) {
        var me = this,
            data = record.getData();

        me.containerGeneral.update(data);
        me.fsDescripcion.update(data);

        me.callParent();

        me.center();
    },
    getTemplateGeneral: function () {
        var me = this;
        return new Ext.XTemplate(
            '<div>',
            '<div class="ofertanegocio-block ofertanegocio-allrow">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbnombre + ':</label><span>{nombre}</span>',
            '</div>',
            '</div>',
            '<div class="ofertanegocio-block ofertanegocio-allrow">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbnumero + ':</label><span>{numero}</span>',
            '</div>',
            '</div>',
            '<div class="ofertanegocio-block ofertanegocio-allrow">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbSolicitud + ':</label><span>#{idsolicitud} {solicitud}</span>',
            '</div>',
            '</div>',
            '<div class="ofertanegocio-block ofertanegocio-block6">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbclienteproveedor + ':</label><span>{clienteproveedor}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbArea + ':</label><span>{arearesponsable}</span>',
            '</div>',
            '</div>',
            '<div class="ofertanegocio-block ofertanegocio-block4">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbSector + ':</label><span>{sector}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label></label><span></span>',//'<label>'+me.etiquetas.lbResponsable+':</label><span>{responsable}</span>',
            '</div>',
            '</div>',

            '<div class="ofertanegocio-block ofertanegocio-block4">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbFechaInicio + ':</label><span>{fechainicio}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbMedioPago + ':</label><span>{mediopago}</span>',
            '</div>',
            '</div>',

            '<div class="ofertanegocio-block ofertanegocio-block4">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbFechaFirma + ':</label><span>{fechafirma}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbCondicionPago + ':</label><span>{condicionpago}</span>',
            '</div>',
            '</div>',

            '<div class="ofertanegocio-block ofertanegocio-block2">',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbVigencia + ':</label><span>{vigencia} <tpl if="unidadtiempo = 1">' + me.etiquetas.lbUTMonth + '<tpl else>' + me.etiquetas.lbUTYear + '</tpl></span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>' + me.etiquetas.lbMonto + ':</label><span>{montototal}</span>',
            '</div>',
            '</div>',

            '</div>'
        );
    },
    getTemplateAreaImplicada: function () {
        var me = this;

        return new Ext.XTemplate(
            '<div class="ofertanegocio-columnheader">',
            '<div style="width:100%;"><label>' + me.etiquetas.lbnombre + '</label></div>',
            '</div>',
            '<tpl for=".">',
            '<div class="ofertanegocio-row">',
            '<div style="width:100%"><span>{area}</span></div>',
            '</div>',
            '</tpl>'
        );
    },
    getTemplateDescripcion: function () {
        return new Ext.XTemplate('<div>{descripcion}</div>');
    }
});
