UCID.portal.cargarEtiquetas('cierre', function(perfil, idioma){
    perfil = arguments[0];
    idioma = arguments[1];
    //Inicializando modelo
    var modelo = Pvd.Nomina.Cierre.Modelo;
    modelo.init(idioma);
 
    //Inicializando la vista.
    var vista = Pvd.Nomina.Cierre.Vista;
    vista.init(perfil, idioma, modelo);    

    //Inicializar controlador.
    Pvd.Nomina.Cierre.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

});
