Ext.define('CRM.module.ComponenteReporte', {
    extend: 'Ext.app.BundledApplication',
    name: 'ComponenteReporte',
    controllers: ['Main', 'ReporteData'],
    autoLoadLang: true,
    disabled: true,
    appFolder:'ComponenteReporte',
    launch: function () {

    }
});