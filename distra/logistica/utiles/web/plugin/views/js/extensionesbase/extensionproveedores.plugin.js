Ext.ns('LOG.lb.plugin');
LOG.lb.plugin.Extensionproveedores = Ext.extend(LOG.lb.plugin.Extensionesbase, {
    constructor: function (config) {
        config.idioma = LOG.lb.extensionproveedores.Idioma;
        LOG.lb.plugin.Extensionproveedores.superclass.constructor.call(this, config);
        this.campoDescripcion = 'nombre';
        this.idGridPrincipal= 'idclientesproveedores';
        this.getVistaPrincipal().title = this.idioma.tlVentana;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.lbDenominacion,
            width: 320,
            dataIndex: 'nombre',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            dataIndex: 'idclientesproveedores',
        });
        this.addGridColumn({
            dataIndex: 'codigo',
        });
        this.addGridColumn({
            dataIndex: 'abreviatura',
        });
    }
});