/**
 * Gestion Subsistemas.
 * 
 * @author Ing. Maikel Garcia Valdes.
 * @author Ing. Alejandro Mengana Pérez.
 * @package ERP Cuba.
 * @subpackage Configuraci&oacute;n General. 
 * @namespace Ext.ConfGnral.Subsistema
 * @copyright XETID
 * @version 1.0
 */

Ext.QuickTips.init();
/*var etiquetas = Ext.Configuracion_General_Parametros.etiquetas;
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
 };*/

//function cargarInterfaz() {
//var component = new Ext.Configuracion_General_Parametros.Subsistemas({
//    layout: 'fit',
//    frame: true,
//    id: 'comones'
//});

var vpPrincipal = new Ext.Viewport({
    id: 'viewportsub',
    layout: 'fit',
    items: new Ext.Configuracion_General_Parametros.Subsistemas({
        layout: 'fit',
        frame: true,
        id: 'comones',
        listeners: {
            endload: function(panel){
                Ext.getCmp('viewportsub').doLayout();
            }
        }
    })
});
//};




 