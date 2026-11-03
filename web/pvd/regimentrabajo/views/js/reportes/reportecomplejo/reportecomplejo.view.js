Ext.ns('Pvd.ControlAsistencia.Reportecomplejo');
//Vista del componente.
Pvd.ControlAsistencia.Reportecomplejo.Vista = {

    init: function (idioma, modelo) {

        this.objRecComplejas = new Ext.components.CmpReccomplejas.Interfaz({
            margins: '5 0 5 0',
            title: 'Reporte de personas',
            width: '100%',
            height: 430,
            singleSelect: false,
            region: 'center',
            border: true,
            idconfiguracion: 'personas',
            tituloReporte: 'Reporte de personas',
            tituloConfiguracion: 'Configuración de la búsqueda',
            tituloGrid: 'Listado de personas',
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
            layout   : 'fit',
            items:[this.objRecComplejas]

        });


    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('reportecomplejo', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.Reportecomplejo.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.Reportecomplejo.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.Reportecomplejo.Controlador.init(idioma, vista, modelo);

});