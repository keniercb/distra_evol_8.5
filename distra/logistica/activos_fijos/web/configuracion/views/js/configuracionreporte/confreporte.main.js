/*UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.confreporte.Idioma, LOG.util.Idioma);

    var winConfreporte = new LOG.confreporte.ventana({
        idioma: idioma,
        acciones: acciones_reportes
    });
    winConfreporte.init();
 winConfreporte.view();
});*/

/**
 * Created by yoendy on 2/23/2016.
 */
Ext.ns('LOG.aft.Recu');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.confreporte.Idioma, LOG.util.Idioma);

    var viewport = new LOG.confreporte.Vista({
        acciones: acciones_reportes,
        idioma: idioma
    });


    /*Ext.Ajax.request({
        url: 'getEstructura',
        params: {
            idconcepto: 5
        },
        //url: '/logistica/utiles/plugin/index.php/plugincombodeposito/cargardepositos?idtipo=0',
        method: 'POST',
        callback: function (options, success, response) {
            var resp = Ext.decode(response.responseText);
            if (resp.success) {
                Ext.each(resp.datos, function(r){
                    viewport.addNodoTree(r.deposito, r.iddeposito, null, null, true, r);
                });
            }
        }
    });*/



});