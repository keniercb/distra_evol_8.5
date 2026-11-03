Ext.ns('LOG.lb.plugin');
LOG.lb.plugin.Extensionproducto = Ext.extend(LOG.lb.plugin.Extensionesbase, {

    constructor: function(config) {
        config.idioma = LOG.lb.extensionproducto.Idioma;

        LOG.lb.plugin.Extensionproducto.superclass.constructor.call(this, config);
        this.campoDescripcion = 'denominacion';
         this.idGridPrincipal= 'idindicador';
         this.getVistaPrincipal().title = this.idioma.tlVentana;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.lbDenominacion,
            width: 120,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: this.idioma.lbCodigo,
            width: 80,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
        });
        this.addGridColumn({
            dataIndex: 'codigoauxiliar',
        });
    }
});