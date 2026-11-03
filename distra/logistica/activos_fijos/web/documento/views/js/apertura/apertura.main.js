/**
 * Created by Daniel on 15/11/2016
 */
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.aft.apertura.Idioma, LOG.util.Idioma);
    var vistaEmitidas = new LOG.aft.apertura.View({
        acciones: acciones_reportes,
        idioma: idioma,
        title:'Emitidas',
        tipo:0,
        idayuda:'idayudaaperturaemitidas'
    });
    var vistaRecibidas = new LOG.aft.apertura.View({
        acciones: acciones_reportes,
        idioma: idioma,
        title:'Recibidas',
        tipo:1,
        idayuda:'idayudaaperturarecibidas'
    });
    var tapPanel = new LOG.util.UITabTemplate({
        idioma: idioma,
        formaVisualizacion:'viewport'
    });
    tapPanel.addTabToTemplete(vistaEmitidas);
    tapPanel.addTabToTemplete(vistaRecibidas);
    tapPanel.init();
    tapPanel.view();
    tapPanel.on({
        tabchange:function(p,tab){
            if(tapPanel.getActiveTemplate().getStorePrincipal().getCount()== 0)
                tapPanel.getActiveTemplate().getStorePrincipal().load();
        }
    });
    vistaEmitidas.getStorePrincipal().load();
    //vistaRecibidas.getStorePrincipal().load()
});