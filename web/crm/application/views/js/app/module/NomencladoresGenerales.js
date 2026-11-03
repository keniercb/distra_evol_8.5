Ext.define('CRM.module.NomencladoresGenerales', {
    extend: 'Ext.app.BundledApplication',
    name: 'NomencladoresGenerales',
    modules: ['Nomencladores'],
    autoLoadLang: true,
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    }
});