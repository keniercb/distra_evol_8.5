Ext.define('CRM.module.Contratacion', {
    extend: 'Ext.app.BundledApplication',
    name: 'Contratacion',
    modules: ['TipoContrato', 'SolicitudNegocio', 'OfertaNegocio', 'Proformas','GestionContrato',
        'Facturacion', 'SolicitudPago', 'Comite', 'Recuperaciones', 'RecupClientesProveedores', 'ConfigFormatoNumContrato',
        'ReporteContratacion', 'DesgloseContrato', 'RecuperacionDesglose', 'RecuperacionContrato'
    ],
    autoLoadLang: true,
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    }
});