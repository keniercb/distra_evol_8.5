Ext.ns('LOG.lb.plugin');
LOG.lb.plugin.Extensioncentrocosto = Ext.extend(LOG.lb.plugin.Extensionesbase, {
    constructor: function (config) {
        config.idioma = LOG.lb.extensioncentrocosto.Idioma;
        LOG.lb.plugin.Extensioncentrocosto.superclass.constructor.call(this, config);
        this.campoDescripcion = 'descripcioncentrogrupo';
        this.idGridPrincipal= 'idcentrogrupo';
        this.getVistaPrincipal().title = this.idioma.tlVentana;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.lbDenominacion,
            width: 120,
            dataIndex: 'descripcioncentrogrupo',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            dataIndex: 'idcentrogrupo'
        });
        this.addGridColumn({
            dataIndex: 'text'
        });
    }
});