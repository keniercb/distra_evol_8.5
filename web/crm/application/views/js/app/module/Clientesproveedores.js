Ext.define('CRM.module.Clientesproveedores', {
    extend: 'Ext.app.BundledApplication',
    name: 'Clientesproveedores',
    modules: ['GestionClienteProveedor','NomClienteProveedor', 'PerfilesClientes', 'Segmentacion','Solicitud'],
    autoLoadLang: true,
    disabled: false,
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    }
});