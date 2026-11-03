Ext.define('CRM.module.Importacion', {
    extend: 'Ext.app.BundledApplication',
    name: 'Importacion',
    modules: ['Demanda',
        'SolicitudNegocioImportacion',
        'OfertaNegocioImportacion', 'Pliego', 'GestionContratoImportacion',
        'Seguimiento', 'Reclamaciones', 'Penalizaciones', 'Comite'
    ],
    autoLoadLang: true,
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    }
});