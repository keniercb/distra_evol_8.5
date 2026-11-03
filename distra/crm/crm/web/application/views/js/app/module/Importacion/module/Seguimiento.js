Ext.define('Importacion.module.Seguimiento', {
    extend: 'Ext.app.BundledApplication',
    name: 'Seguimiento',
    appFolder: 'seguimiento',
    views: ['Main'],
    controllers: ['Main','MainWindow'],
    securityFunction: true,
    autoLoadLang: true,

    launch: function () {
    },

    run: function (options) {
        var me = this;
        if (!this.isRunning) {
            //si no esta corriendo la app entonces se renderiza la vista deseada en el tabpanel
            var mainView = this.render('main_tabpanel', 'Main', options);
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


