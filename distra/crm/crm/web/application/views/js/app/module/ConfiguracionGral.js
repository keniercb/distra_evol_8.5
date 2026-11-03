Ext.define('CRM.module.ConfiguracionGral', {
    extend: 'Ext.app.BundledApplication',
    name: 'ConfiguracionGral',
    appFolder: 'Configuracion',
    modules: ['Modules','Reportes','ConfContratacion', 'ConfPlantilla'],
    autoLoadLang: true,
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    }
});