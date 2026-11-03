/**
 *  @author Jorge Luis Cuellar Mondeja, Kenier Cumba
 *  24/07/2013
 */
Ext.ns('Ext.erp.CONFG.Nomencladores');
Ext.erp.CONFG.Nomencladores.Vista = {
    init: function(idioma, modelo) {
        var viewport = new Ext.erp.viewPortNomencladores({
            title: idioma.lbNomenlcadores
        });
        var defaultController = '/configuracion/nomgenerales/index.php/nomencladoresgenerales/';
        viewport.addNodoTree(idioma.lbNaturaleza, 'naturaleza', defaultController, 'NomNaturaleza');
        viewport.addNodoTree(idioma.lbMarcamodelo, 'marcamodelo', '/configuracion/nomgenerales/index.php/marcamodelo/', 'NomMarca');
        viewport.addNodoTree(idioma.lbViaAdquisicion, 'viaadquisicion', defaultController, 'NomViaadquisicion');
        viewport.addNodoTree(idioma.lbOrgano, 'organo', defaultController, 'NomOrganosatisface');
        viewport.addNodoTree(idioma.lbTipoenvase, 'tipoenvase', defaultController, 'NomTipoenvase');
        //viewport.addNodoTree(idioma.lbLinea, 'nomlinea', defaultController, 'NomLinea');
        //viewport.addNodoTree(idioma.lbComportamientoEntidad, 'comportamientoentidad', defaultController, 'NomComportamiento');
    }
};
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('nomencladoresgenerales', function(perfil, idioma) {    
    var vista = Ext.erp.CONFG.Nomencladores.Vista;
    vista.init(idioma, {});
    UCID.portal.cargarAcciones(window.frameElement.id, function(res) {
        urlReportes = UCID.portal.getAccionesReportes();
    }); 
});
