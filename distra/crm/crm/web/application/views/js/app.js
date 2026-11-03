var perfil = window.parent.UCID.portal.perfil;


Ext.Loader.setConfig({
    enabled: true,
    // disableCaching: false
});

Ext.Ajax.request({
    url: 'loadActiveModules',
    callback: function (options, success, response) {
        var result = Ext.decode(response.responseText),
            activeModules = result.data && result.data.valores ?  Ext.decode(result.data.valores) : false;

        Ext.HMVCApplication({
            name: 'CRM',
            paths: {
                'CRM': '../../views/js/app',
                'CRM.ux': '../../views/js/app/core/utils/components',
                'CRM.plugins': '../../views/js/app/core/utils/plugins',
                'Ext.ux': '../../views/js/app/core/utils/components'
            },
            extend: 'Ext.app.BundledApplication',
            autoCreateViewport: true,
            globalConfig: true,
            controllers: [
                'Main',
                'CRM.core.controller.Base',
                'CRM.core.controller.Help',
                'CRM.core.controller.ServerResponse'
            ],
            modules: ['Contratacion', 'Importacion', 'BaseModule',
                'Clientesproveedores', 'ServicioMedico', 'Marketing','NomencladoresGenerales',
                'ConfiguracionGral','ComponenteReporte'],
            activeModules: activeModules,
            autoLoadLang: true,
            //init: function(){
            //    // Obtener los modulos activos segun la configuracion hecha
            //},
            launch: function () {
                //console.log('Application:' + this.name + ' launched (deep: ' + this.depth + ')');

                //console.log("Initializing general component's overrides");
                GlobalOverrides.init();

                var controller = this.getController('Main');
                controller.beforeSecuritySync();
                //controller.getActiveModules();
            }
        });
    }
});