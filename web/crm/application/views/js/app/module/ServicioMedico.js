Ext.define('CRM.module.ServicioMedico', {
    extend: 'Ext.app.BundledApplication',
    name: 'ServicioMedico',
    modules: [
        'ProgramaMedico'
    ],
    autoLoadLang: true,
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    }
});