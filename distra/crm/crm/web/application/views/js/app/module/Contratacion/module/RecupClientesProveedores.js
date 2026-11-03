Ext.define('Contratacion.module.RecupClientesProveedores', {
    extend: 'Ext.app.BundledApplication',
    name: 'RecupClientesProveedores',
    appFolder: 'recupclientesproveedores',
    controllers:['Main'],
    autoLoadLang: true,
    disabled: false,
    launch: function () {
            //Ext.create('ConfigFormatoNumContrato.view.Main').show();
    }
});