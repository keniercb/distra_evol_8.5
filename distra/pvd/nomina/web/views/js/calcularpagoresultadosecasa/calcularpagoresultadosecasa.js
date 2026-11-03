UCID.portal.cargarEtiquetas('calcularpagoresultadosecasa', function(perfil, idioma){
    perfil = arguments[0];
    idioma = arguments[1];
    //Inicializando modelo
    var modelo = Pvd.Nomina.CalcularPagoResultado.Modelo;
    modelo.init(idioma);
 
    //Inicializando la vista.
    var vista = Pvd.Nomina.CalcularPagoResultado.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.CalcularPagoResultado.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

});
