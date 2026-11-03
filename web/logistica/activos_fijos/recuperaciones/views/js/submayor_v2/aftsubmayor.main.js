Ext.ns('Log.aft.submayor_v2');


UCID.portal.cargarAcciones(window.parent.parent.parent.idFuncionalidad, function() {
    Log.aft.submayor_v2.acciones = acciones_reportes;
    var idioma = LOG.util.UIManager.apply(Log.aft.submayor_v2.Idioma, LOG.util.Idioma);
    var model = Log.aft.submayor_v2.model();
    
    
    // types
    var tipoSubmayores = {
        'activos': {id: 'activos', text: 'Submayor de AFT'},
        'utiles': {id: 'utiles', text: 'Submayor de UH', tooltip: "Muestra solamente todos los que tengan marcado que es un UH en el maestro de productos"},
        'transportes': {id: 'transportes', text: 'Submayor Transportes', tooltip: "Muestra solamente los que pertenezcan a la naturaleza de medios de transporte terrestre"},
    };
    var tipoVista = {
        'cantidades': {id: 'cantidades', text: 'Cantidades'},
        'medios': {id: 'medios', text: 'Medios'},
    };
    
    var container = new Log.aft.submayor_v2.Container({
        tipoVistas: [
            //tipoVista.medios,
            tipoVista.cantidades
        ],
        tipoSubmayores: [
            tipoSubmayores.activos, 
            tipoSubmayores.utiles, 
            tipoSubmayores.transportes
        ],
        model: model,
        idioma: idioma
    });
    container.doLayout();
    container.show();
    
});



