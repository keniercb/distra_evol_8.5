var perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.labels = Object();

cargarInterfaz();


function cargarInterfaz() {
    perfil.labels = arguments[1];

    var btnAyuda = new Ext.Button({
        id: 'btnAyudaRecuperacionesComplejas',
        iconCls: 'btn',
        icon: perfil.dirImg + 'ayuda.png',
        //text: 'Ayuda',
        tooltip: 'Ayuda'
    });
    var toolbarPanelReporte = ['->', btnAyuda];


    var objRecComplejas = new Ext.components.CmpReccomplejas.Interfaz({
        margins: '5 0 5 0',
        title: 'prueba ole y dany',
        width: '100%',
        height: 360,
        singleSelect: false,
        region: 'center',
        border: true,
        idconfiguracion: 'planificacion',
        tituloReporte: 'Reporte',
        tituloConfiguracion: 'Configuración',
        tituloGrid: 'Indicadores',
        hideBtnRtf: true,
        noUsarGestAvisos: true,
        useMap: false,
        hideBtnOperCant: false,
        autoLoadList: true,
        renderers: {
            showAprobacion: function (val, metaData) {
                if (val == 1) {
                    metaData.css = 'icondistra-true verde';
                    //return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
                }
                else {
                    metaData.css = 'icondistra-false rojo';
                    //return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
                }
            },
            showbases: function (val) {

                if (val == 2) {
                    return 'Si';
                }
                else {
                    return 'No';

                }
            }
        }
    });

    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [objRecComplejas]
    });
    objRecComplejas.setActiveTab(0);

}
