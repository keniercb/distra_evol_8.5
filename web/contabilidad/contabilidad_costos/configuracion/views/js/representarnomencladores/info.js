
Ext.namespace('Ext.Confin.Configuracion');
Ext.Confin.Configuracion.EstructuraEconomica = Ext.extend(Ext.Component, {
    perfil: window.parent.UCID.portal.perfil,
    respuesta: '',
    constructor: function () {
        Ext.QuickTips.init();
        scopeEstructuraEconomica = this;
        Ext.Ajax.request({
            method: "POST",
            url: "getexcepcioncontrolada",
            callback: function (options, success, response) {
                scopeEstructuraEconomica.respuesta = Ext.decode(response.responseText);
                scopeEstructuraEconomica.cargarInterfaz();
            }
        });
    },
    cargarInterfaz: function () {
        scopeEstructuraEconomica.vpInfo = new Ext.Viewport({
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
        mostrarMensaje(1, scopeEstructuraEconomica.respuesta.detalles, function (btn) {
            if (btn === 'ok') {
                scopeEstructuraEconomica.closeWindow();
            }
        });
    },
    loadJs: function (jsSrc, id) {
        if (jsSrc != null) {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc + ".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    closeWindow: function () {
        window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
    }
});
new Ext.Confin.Configuracion.EstructuraEconomica();

