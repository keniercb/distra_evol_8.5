/**
 * Created with JetBrains PhpStorm.
 * User: Milena
 * Date: 4/14/15
 * Time: 2:24 PM
 * To change this template use File | Settings | File Templates.
 */

UCID.portal.cargarEtiquetas('confpagosporresultados', function(perfil, idioma){
    perfil = arguments[0];
    idioma = arguments[1];
    //Cargando los indicadores
    Ext.Ajax.request({
        url: 'buscarPadreSuperior',
        method: 'POST',
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            var idestructurapadre = responseData;
            //Inicializando modelo
            var modelo = Pvd.Nomina.Confpagoxresultados.Modelo;
            modelo.init(idioma);
            //Inicializando la vista.
            var vista = Pvd.Nomina.Confpagoxresultados.Vista;
            vista.init(perfil, idioma, modelo, idestructurapadre);
            //Inicializar controlador.
            Pvd.Nomina.Confpagoxresultados.Controlador.init(idioma, vista, modelo);
            UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
        }.createDelegate(this)
    });

});