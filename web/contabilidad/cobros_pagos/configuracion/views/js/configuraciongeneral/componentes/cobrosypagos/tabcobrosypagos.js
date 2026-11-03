Ext.ns('Ext.Copa.Configuracion');

Ext.Copa.Configuracion.tabcopa = Ext.extend(Ext.TabPanel, {
    region: 'center',
    frame: true,
    minTabWidth: 135,
    tabWidth: 210,
    enableTabScroll: true,
    layoutOnTabChange: true,
    textnomenclador: 'cobrospagos',
    idnomenclador: 'lolnoido',
    title: 'Columnas',
    closable: true,
    constructor: function (config) {
        this.id = config.id;
        Ext.Copa.Configuracion.tabcopa.superclass.constructor.call(this);
        this.crearFunciones();
        this.adicionarConfiguraciones();
    },
    adicionarItem: function (item) {
        this.selectTab(item);
    },
    crearFunciones: function () {
        var _this = this;

        this.addTab = function (item) {
            _this.add(item);
            // _this.doLayout();
        };

        this.adicionarConfiguraciones = function () {
            this.addTab(new Ext.Copa.Configuracion.ColumnaCopa());
        };

    },
});