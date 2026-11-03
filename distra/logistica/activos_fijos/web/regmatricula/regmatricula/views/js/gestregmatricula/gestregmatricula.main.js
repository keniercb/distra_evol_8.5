/**
 * Created with JetBrains PhpStorm.
 * User: Osmel Cutino
 * Date: 12/03/15
 * Time: 10:37
 * To change this template use File | Settings | File Templates.
 */
Ext.ns('Ext.LOG.gestregmatricula.main');

Ext.LOG.gestregmatricula.main.Vista = {
    init: function(idioma) {


        if (acciones_reportes.length == 1) {
            mostrarMensaje(1, idioma.MsgPermisoDenegado);
            return;
        }

        var viewport = new Ext.LOG.gestregmatricula({
            idioma: idioma,
            acciones: acciones_reportes
        });
        /*  if (acciones_reportes.length > 1) {
         for (var i = 0; i < acciones_reportes.length; i++) {
         switch (acciones_reportes[i].abreviatura) {
         case 'VEHICULO"':
         document.getElementById('vista').innerHTML = "<p>" + 'Veh&iacute;culo' + "</p>";
         break;
         
         }
         }
         } else {
         mostrarMensaje(1, 'Debe configurar los recursos para esta acción.');
         }*/

    }

}
UCID.portal.cargarEtiquetas('gestregmatricula', function(perfil, idioma) {

    Ext.QuickTips.init();

    UCID.portal.cargarAcciones(window.frameElement.id, function(res) {
        urlReportes = UCID.portal.getAccionesReportes();
        var vista = Ext.LOG.gestregmatricula.main.Vista;
        vista.init(idioma, {});
    });

});

