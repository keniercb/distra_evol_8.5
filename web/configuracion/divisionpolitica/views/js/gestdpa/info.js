/**
 * @description Informacion para la funcionalidad Gestionar DPT al lanzar excepciones controladas del sistema.
 *
 * @author Ing. Alexis Rodriguez Reyes.
 * @package ERP Cuba.
 * @subpackage Contabilidad y Finanzas.
 * @namespace Ext.Confin.Configuracion.InfoFecha
 * @copyright XETID.
 * @version 1.0
 */
Ext.namespace('Ext.Confin.Configuracion');
Ext.Confin.Configuracion.InfoFecha = Ext.extend(Ext.Component, {
    perfil: window.parent.UCID.portal.perfil,
    respuesta: '',
    constructor: function() {
        Ext.QuickTips.init();
        scopeInfoFecha = this;
        if (!document.getElementById('Notification')) {
            scopeInfoFecha.loadJs("/configuracion/comun/views/js/Notification/js/Ext.Cont.Notification", 'Notification');
        }
        Ext.Ajax.request({
            method: "POST",
            url: "getexcepcioncontrolada",
            callback: function(options, success, response) {
                scopeInfoFecha.respuesta = Ext.decode(response.responseText);
                scopeInfoFecha.cargarInterfaz();
            }
        });
    },
    notifyEvent: function(animateTarget, title, msg, icon, time, callback) {
        var notification = new Ext.Cont.Notification({
            animateTarget: animateTarget,
            fnc: (callback) ? callback : Ext.emptyFn,
            iconbox: icon,
            iconCls: "icon-waiting",
            title: title,
            html: msg,
            hideDelay: (time) ? time : 5000
        });
        notification.box();
    },
    cargarInterfaz: function() {
        scopeInfoFecha.vpInfo = new Ext.Viewport({
            id: 'vpInfo',
            layout: 'fit',
            items: [
                new Ext.Panel({
                    id: 'pInfo',
                    frame: false,
                    border: false,
                    layout: 'fit'
                })
            ]
        });
//          scopeInfoFecha.notifyEvent(Ext.getCmp('pInfo').el.dom, "Informaci&oacute;n", scopeInfoFecha.respuesta.detalles, 1, 5000, scopeInfoFecha.closeWindow);
        mostrarMensaje(1, scopeInfoFecha.respuesta.detalles);

    },
    loadJs: function(jsSrc, id) {
        if (jsSrc != null) {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc + ".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    closeWindow: function() {
        window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
    }
});
new Ext.Confin.Configuracion.InfoFecha();