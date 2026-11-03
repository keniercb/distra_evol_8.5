var perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.labels = Object();

UCID.portal.cargarEtiquetas('administracion',function(){
    var self = this;
	perfil.labels = arguments[1];
    this.gpListConfig = new Ext.reccomplejas.TabListConfiguracion({
        region: 'center',
        margins:'5 5 5 5'
    });

    var v = new Ext.Viewport({
        layout: 'border',
        items: [this.gpListConfig]
    });

});