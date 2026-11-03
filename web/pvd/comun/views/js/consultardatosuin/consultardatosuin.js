/**
 * Created by Miguel Antonio on 18/01/2016.
 */
perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
labels = Object();
UCID.portal.cargarEtiquetas('consultardatosuin', cargarInterfaz);

function cargarInterfaz() {
    perfil = arguments[0];
    labels = arguments[1];
    var suin = new Ext.SUIN.Consultar.panelDatos({
        gestionar: true
    });

    var vp = new Ext.Viewport({
        layout: 'fit',
        items: [suin]
    });

}