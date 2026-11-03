Ext.define('Contratacion.module.SolicitudPago', {
    extend: 'Ext.app.BundledApplication',
    name: 'SolicitudPago',
    appFolder: 'solicitudpago',
    // views: ['MainSolicitudPago'],
    views: ['Main'],
    // controllers: ['SolicitudPago','MainWindow'],
    controllers: ['Main','MainWindow'],
    securityFunction: true,
    autoLoadLang: true,

    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    },

    run: function (options) {
        var me = this;
        if (!this.isRunning) {
            //si no esta corriendo la app entonces se renderiza la vista deseada en el tabpanel
            var mainView = this.render('main_tabpanel', 'Main', options);
            // var mainView = this.render('main_tabpanel', 'MainSolicitudPago', options);
            this.isRunning = true;

            mainView.on({
                close: function () {
                    delete me.isRunning;
                }
            });

            return mainView;
        }
        return false;
    }
});


