Ext.ns('GestionContrato.view');
//Vista del componente.
GestionContrato.view.ReporteComplejo = {
    init: function (idioma) {
        console.log('Creando')

        this.objRecComplejas = new Ext.components.CmpReccomplejas.Interfaz({
            id: 'interfazrecuperacionescomplejas',
            cls:'x-panel-reportes-complejos',
            margins: '5 0 5 0',
            title: 'Reporte de contratos',
            width: '100%',
            height: 430,
            singleSelect: false,
            region: 'center',
            border: true,
            idconfiguracion: 'contratos',
            tituloReporte: 'Reporte de contratos',
            tituloConfiguracion: 'Configuración de la búsqueda',
            tituloGrid: 'Listado de contratos',
            mainToolBar: ['->', {
                id: 'btnAyudaReportComp',
                text: 'Ayuda',
                iconCls: 'ayuda'
            }],
            hideBtnRtf: false,
            singleSelect: true,
            noUsarGestAvisos: true, //False si voy a usar el componente de Gestionar avisos
            useMap: false,
            hideBtnOperCant: false,
            autoLoadList: true,
            renderers: getRenderes()
        });

        function getRenderes() {
            return Ext.apply({
                showSexo: function (val) {
                    if (val == 0) {
                        return '<center><img src="/pvd/persona/views/images/persona/female.png" /></center>';
                    } else {
                        return '<center><img src="/pvd/persona/views/images/persona/male.png" /></center>';
                    }
                }, showGradoMilitar: function (val, opt, rec) {
                    // grado
                    if (!Ext.isEmpty(val)) {
                        return '<center><img ext:qtip="<b>' + rec.data.grado + '</b>" style="height: 16px;cursor: pointer" src="' + val + '" /></center>';
                    } else {
                        return '<center><img src="' + Ext.BLANK_IMAGE_URL + '" /></center>';
                    }
                }
            });
        };

        this.vp = new Ext.Viewport({
            layout : 'fit',
            items:[this.objRecComplejas]

        });


    }
};
// window.parent.UCID=window.UCID;
console.log('window 2.2')
console.log('window', window)
console.log('window.parent', window.parent)
// console.log(window.parent.UCID)
// console.log(window.parent.UCID.portal)
// console.log(window.parent.UCID.portal.perfil)
console.log('window.UCID', window.UCID)
console.log('window.perfil', window.perfil)
console.log('window.parent.UCID', window.parent.UCID)
console.log('window.variableinventa', window.variableinventa)
console.log('window.src', window.src)
console.log('window.document', window.document)
console.log('window.1', document.getElementById('interfazrecuperacionescomplejas'))
console.log('element:',document.getElementById('idpanelreportecomplejo'))
// console.log(UCID)
//Inicializando la vista.
// window.parent.UCID.portal.perfi=
var perfil={};
function cargarEtiquetas(vistaCU, fn, es) {
    Ext.Ajax.request({
        url: 'cargaretiquetas',
        method: 'POST',
        params: {
            vista: vistaCU,
            es: es
        },
        callback: function (options, success, response) {
            console.log('callback', options, success, response)
            if (success) {
                var etiquetas = Ext.decode(response.responseText);
                console.log('etiquetas', etiquetas)
                if (!perfil) {
                    perfil = {};
                }
                console.log('Perfil', perfil)
                perfil.etiquetas = etiquetas;
                var codMsg = perfil.etiquetas.codMsg;
                if (!codMsg)
                    fn(perfil, etiquetas);
                else if (codMsg == 4) {
                    cargarEtiquetas(vistaCU, fn, true);
                }
            }
        }
    });
}

// UCID.portal.cargarEtiquetas('reportecomplejo', function (perfil, idioma) {
cargarEtiquetas('reportecomplejo', function (perfil, idioma) {
    console.log('FN')
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    // var modelo = Pvd.ControlAsistencia.Reportecomplejo.Modelo;
    // modelo.init();

    //Inicializando la vista.
    var vista = GestionContrato.view.ReporteComplejo;
    vista.init(idioma);

    //Inicializar controlador.
    // Pvd.ControlAsistencia.Reportecomplejo.Controlador.init(idioma, vista, modelo);

});