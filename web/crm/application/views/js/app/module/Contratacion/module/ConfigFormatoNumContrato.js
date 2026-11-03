Ext.define('Contratacion.module.ConfigFormatoNumContrato', {
    extend: 'Ext.app.BundledApplication',
    name: 'ConfigFormatoNumContrato',
    appFolder: 'configformatonumcontrato',
    controllers:['Main'],
    autoLoadLang: true,
    disabled: false,
    launch: function () {
            //Ext.create('ConfigFormatoNumContrato.view.Main').show();
    }
});