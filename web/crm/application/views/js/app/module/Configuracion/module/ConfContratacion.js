Ext.define('ConfiguracionGral.module.ConfContratacion', {
    extend: 'Ext.app.BundledApplication',
    name: 'ConfContratacion',
    appFolder: 'confcontratacion',
    controllers: ['Main','ConfComiteTran','WindowRule','ConfComiteGD','ConfContratoGD', 'ConfOfertaNegocioG',
        'ConfSolicitudNegocio','ConfContratoPlanif','ConfContratoCompart','ConfComiteGeneral',
        'ConfContratoContabilidad', 'ConfSolicitudPagoGD', 'ConfClientesproveedores', 'ConfContratoGeneral',
        'ConfProforma', 'ConfContratoImportacionGD', 'ConfCache', 'ConfComiteGD'],
    securityFunction: true,
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    },

    run: function (options) {
        var me = this;

        if (!this.isRunning) {
            //si no esta corriendo la app entonces se renderiza la vista deseada en el tabpanel
            var mainView = this.render('main_tabpanel', 'Main', options);
            if(mainView){
                this.isRunning = true;

                mainView.on({
                    close: function () {
                        delete me.isRunning;
                    }
                });
                return mainView;
            }
            return false
        }
        return false;
    }
});


