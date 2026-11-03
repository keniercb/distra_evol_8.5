Ext.define('Contratacion.module.OfertaNegocio', {
    extend: 'Ext.app.BundledApplication',
    name: 'OfertaNegocio',
    appFolder: 'ofertanegocio',
    controllers: ['OfertaNegocio', 'EditOferta'],
    autoLoadLang: true,
    securityFunction: true,
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    },
    run: function(options){
        var me = this;
console.log('eeeeeeee')
        if(!this.isRunning){
            //si no esta corriendo la app entonces se renderiza la vista deseada en el tabpanel
            var mainView = this.render('main_tabpanel', 'OfertaNegocio', options);
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


