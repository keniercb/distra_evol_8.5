UCID.portal.cargarEtiquetas('recnominaporestructura', function(perfil, idioma){
    perfil = arguments[0];
    idioma = arguments[1];
    //Inicializando modelo
    var modelo = Pvd.Nomina.Recuperaciones.RecNominaporEstructura.Modelo;
    modelo.init(idioma);
 
    //Inicializando la vista.
    var vista = Pvd.Nomina.Recuperaciones.RecNominaporEstructura.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Recuperaciones.RecNominaporEstructura.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

});
