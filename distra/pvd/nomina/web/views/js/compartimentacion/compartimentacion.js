UCID.portal.cargarEtiquetas('compartimentacion', function(perfil, idioma){
    perfil = arguments[0];
    idioma = arguments[1];
    //Inicializando modelo
    var modelo = Pvd.Nomina.Pagos.Compartimentacion.Modelo;
    modelo.init(idioma);
 
    //Inicializando la vista.
    var vista = Pvd.Nomina.Pagos.Compartimentacion.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Pagos.Compartimentacion.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

});
