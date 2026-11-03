/**
 * Gestion Fechas por Subsistemas.
 * 
 * @author Ing. Maikel Garcia Valdes.
 * @package ERP Cuba.
 * @subpackage Configuraci&oacute;n General. 
 * @namespace Ext.Configuracion_General_Parametros
 * @copyright XETID
 * @version 1.0
 */

Ext.QuickTips.init();
var etiquetas = Conf.Fecha.etiquetas;
loadMessageBox(etiquetas.lbPlease, etiquetas.lbMsgCargando);
function loadMessageBox(title, msg) {
    var mss = Ext.MessageBox.show({
        title: title,
        msg: msg,
        width: 300,
        progress: true,
        closable: false
    });
    var f = function(v) {
        return function() {
            var i = v / 11;
            Ext.MessageBox.updateProgress(i);
            if (i == 1) {
                cargarInterfaz();
                mss.hide();
            }
        };
    };
    for (var i = 1; i < 12; i++) {
        setTimeout(f(i), i * 500);
    }
}
;


function cargarInterfaz() {
    var componentFecha = new Ext.Configuracion_General_Parametros.Fecha({
        layout: 'fit',
        frame: false,
        border: false
    });
    var view_port = new Ext.Viewport({
        layout: 'fit',
        items: componentFecha
    });
}
;