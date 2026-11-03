UCID.portal.cargarEtiquetas('cuentabancaria', function(perfil, idioma){
    perfil = arguments[0];
    idioma = arguments[1];
    //Inicializando modelo
    var modelo = Pvd.Nomina.Banco.Exportarcuentabancaria.Modelo;
    modelo.init(idioma);
 
    //Inicializando la vista.
    var vista = Pvd.Nomina.Banco.Exportarcuentabancaria.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Banco.Exportarcuentabancaria.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

});
