Ext.define('Contratacion.module.RecuperacionContrato', {
    extend: 'Ext.app.BundledApplication',
    name: 'RecuperacionContrato',
    appFolder: 'recuperacioncontrato',
    // views: ['MainSolicitudPago'],
    views: ['MainRecuperacionContrato'],
    // controllers: ['SolicitudPago','MainWindow'],
    controllers: ['RecuperacionContrato'],
    // securityFunction: true,
    autoLoadLang: true,

    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    },

    // run: function (options) {
    //     var me = this;
    //     if (!this.isRunning) {
    //         //si no esta corriendo la app entonces se renderiza la vista deseada en el tabpanel
    //         var mainView = this.render('main_tabpanel', 'Main', options);
    //         // var mainView = this.render('main_tabpanel', 'MainSolicitudPago', options);
    //         this.isRunning = true;
    //
    //         mainView.on({
    //             close: function () {
    //                 delete me.isRunning;
    //             }
    //         });
    //
    //         return mainView;
    //     }
    //     return false;
    // }
});


