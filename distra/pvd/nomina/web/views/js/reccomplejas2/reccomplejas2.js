var perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.labels = Object();
UCID.portal.cargarEtiquetas('reccomplejas2', cargarInterfaz);

function cargarInterfaz() {
    perfil.labels = arguments[1];

    var btnAyuda = new Ext.Button({
        iconCls: 'ayuda',
        text: 'Ayuda',
        tooltip: 'Ayuda',
        //handler: showAyuda
    });
    var toolbarPanelReporte = ['->', btnAyuda];

    var objRecComplejas = new Ext.components.CmpReccomplejas.Interfaz({
        idconfiguracion: 'rec_nomia',
        tituloReporte: 'Reporte de historial de trazas',
        tituloConfiguracion: 'Configuración de la búsqueda',
        tituloGrid: 'Listado de trazas',
        mainToolBar: toolbarPanelReporte,
        hideBtnRtf: false,
        allowSingleSelectReport: false,
        noUsarGestAvisos: true, //False si voy a usar el componente de Gestionar avisos
        //useMap: true,
        hideBtnOperCant: false
        /*renderers: {
            showColorNombre: function(val) {
                if (val == 'Angel') {
                    return '<b>' + val + '</b>';
                } else {
                    return val;
                }
            }
        }*/
    });

    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [objRecComplejas]
    });
    objRecComplejas.setActiveTab(0);

}
