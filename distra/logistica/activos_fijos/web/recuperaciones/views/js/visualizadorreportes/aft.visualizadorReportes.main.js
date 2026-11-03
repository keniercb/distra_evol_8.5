UCID.portal.cargarEtiquetas('visualizadorreportes', function (perfil, idioma) {

    UCID.portal.cargarAcciones(window.frameElement.id, function () {
    });
    var visualizadorReportes = new aft.visualizadorReportes.component({
        idioma: idioma,
        perfil: perfil
    });
    visualizadorReportes.show();
    visualizadorReportes.doLayout();

});