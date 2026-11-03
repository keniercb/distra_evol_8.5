Ext.define('ServicioMedico.module.ProgramaMedico', {
    extend: 'Ext.app.BundledApplication',
    name: 'ProgramaMedico',
    appFolder: 'programamedico',
    controllers: ['ProgramaMedico'],
    autoLoadLang: true,
    securityFunction: true,
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    },

    run: function(options){
        var me = this;

        if(!this.isRunning){
            //si no esta corriendo la app entonces se renderiza la vista deseada en el tabpanel
            var mainView = this.render('main_tabpanel', 'PanelPrincipal', options);
            this.isRunning = true;

            mainView.on({
                close: function(){
                    delete me.isRunning;
                }
            });

            return mainView;
        }
        return false;
    }
});


