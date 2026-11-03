Ext.ns('Misitio.Funciones');

Misitio.Funciones.VentanaReportes = function (parametros) {

    var pReportePersona = new Misitio.Panel.PanelReportesAvanzado({
        id                    : 'conceptos' + parametros.id
        , region              : 'center'
        , collapsible         : true
        , disabled            : parametros.disabled
        , animCollapse        : true
        , ocultarBtnActualizar: (parametros.ocultarBtnActualizar) ? parametros.ocultarBtnActualizar : false
        , autoScroll          : true
        , width               : (parametros.width) ? parametros.width : '100%'
        , metodo              : parametros.metodo
        , consulta            : parametros.consulta
        , configuracion       : parametros.configuracion

    });


    var ventanaReportes = new Ext.Window({
        title          : parametros.titulo,
        modal          : true,
        enableTabScroll: true,
        height         : screen.height * 0.50,
        width          : screen.width * 0.50,
        closable       : true,
        resizable      : false,
        maximizable    : true,
        constrain      : true,
        minimizable    : true,
        layout         : 'fit',
        items          : [pReportePersona]
    });


    if (!parametros.noMostrarVentana) {
        ventanaReportes.show();
        // ventanaReportes.maximize();
    }


    return pReportePersona;

};