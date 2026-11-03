UCID.portal.cargarEtiquetas('nomina', function(perfil, idioma){
    perfil = arguments[0];
    idioma = arguments[1];
    //Inicializando modelo
    var modelo = Pvd.Nomina.Pagos.Nomina.Modelo;
    modelo.init(idioma);
 
    //Inicializando la vista.
    var vista = Pvd.Nomina.Pagos.Nomina.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Pagos.Nomina.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.frameElement.id);
});
