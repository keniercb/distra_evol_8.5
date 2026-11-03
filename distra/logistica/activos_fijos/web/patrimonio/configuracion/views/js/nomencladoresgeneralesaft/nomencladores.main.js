/**
 *  Jorge Luis Cuellar Mondeja
 *  24/07/2013
 */
Ext.ns('Ext.erp.LOG.Nomencladores');

Ext.erp.LOG.Nomencladores.Vista = {
    init: function (idioma) {
        var viewport = new Ext.erp.viewPortNomencladores({
            title: idioma.lbNomenlcadores
        });
        var aftDefaultController = '/logistica/activos_fijos/patrimonio/configuracion/index.php/nomencladoresgeneralesaft/';
        var aftDefaultControllerAFT = '/logistica/activos_fijos/configuracion/index.php/nomencladoresgeneralesaft/';
        var defaultController = '/configuracion/nomgenerales/index.php/nomencladoresgenerales/';
        if (acciones_reportes.length > 0) {           
            for (var i = 0; i < acciones_reportes.length; i++) {               
                switch (acciones_reportes[i].abreviatura) {
                    case 'NOMESTATUS':
                        viewport.addNodoTree(idioma.lbEstatus, 'nomestatus', '/logistica/activos_fijos/configuracion/index.php/nomestatus/', 'NomEstatustecnico', idioma.lbtabEstatus);
                        //'/logistica/activos_fijos/configuracion/index.php/nomestatus/'
                        break;
                    case 'NOMCOLOR':
                        viewport.addNodoTree(idioma.lbColor, 'color', aftDefaultControllerAFT, 'NomColor', idioma.lbtabColor);
                        break;
                    case 'NOMACTIV':
                        viewport.addNodoTree(idioma.lbActividad, 'actividad', aftDefaultControllerAFT, 'NomActividadMedio', idioma.lbtabActividad);
                        break;
                    case 'NOMDESTINOFINAL':
                        viewport.addNodoTree(idioma.lbDestinoFinal, 'destinofinal', aftDefaultControllerAFT, 'NomDestinoFinal', idioma.lbtabDestinoFinal);
                        break;
                    case 'NOMREGIMEN':
                        //  addNodoTree: function (text, id, urlController, modelo, texttab) {
                        viewport.addNodoTree(idioma.lbRegimen, 'nomregimen', aftDefaultController, 'NomRegimenPatrimonio', idioma.lbNomRegimen);
                        break;
                    case 'DOCUMENTOEXPEDIENTE':
                        viewport.addNodoTree(idioma.lbDocumentoExpediente, 'nomdocexpediente', aftDefaultController, 'NomDocumentoExpediente', idioma.lbDocumentoExpediente);
                        break;
                    case 'NOMCOMPARTIMIENTOS':
                        viewport.addNodoTree(idioma.lbCompartimientos, 'nomcompartimientos', aftDefaultController, 'NomCompartimientos', idioma.lbNomCompartimientos);
                        break;
                    case 'NOMTIPOLOGIA':
                        viewport.addNodoTree(idioma.lbTipologia, 'nomtipologia', aftDefaultController, 'NomTipologia', idioma.lbNomTipologia);
                        break;
                     case 'NOMTIPOOBRA':
                        viewport.addNodoTree(idioma.lbTipoObra, 'nomtipoobra', aftDefaultController, 'NomTipoObra',idioma.lbNomTipoObra);
                        break;
                     case 'NOMDESIGNACION':                 
                        viewport.addNodoTree(idioma.lbDesignacion, 'nomdesignacion', aftDefaultController, 'NomDesignacion', idioma.lbNomDesignacion);
                        break;
                     case 'NOMCONSTRUCTIVA':                  
                        viewport.addNodoTree(idioma.lbConstructiva, 'nomconstructiva', aftDefaultController, 'NomConstructiva', idioma.lbNomConstructiva);
                        break;
                   /*  case 'NOMCOMUNICACION':
                       viewport.addNodoTree(idioma.lbTipoComunicacion, 'nomtipocomunicacion', aftDefaultController, 'NomTipoComunicacion', idioma.lbNomTipoComunicacion);
                        break;*/
                     case 'NOMVENTILACION':                 
                        viewport.addNodoTree(idioma.lbTipoVentilacion, 'nomtipoventilacion', aftDefaultController, 'NomTipoVentilacion', idioma.lbNomTipoVentilacion);
                        break;
                    case 'NOMSISTEMAENERGETICO':
                        viewport.addNodoTree(idioma.lbSistemaEnergetico, 'nomsistemaenergetico', aftDefaultController, 'NomSistemaEnergetico', idioma.lbNomSistemaEnergetico);
                        break;
                    case 'NOMPUNTOFUEGO':
                        viewport.addNodoTree(idioma.lbTipoPuntoFuego, 'nomtipopuntofuego', aftDefaultController, 'NomTipoPuntoFuego', idioma.lbNomTipoPuntoFuego);
                        break;
                    case 'NOMPOSICIONFUEGO':
                        viewport.addNodoTree(idioma.lbTipoPosicionFuego, 'nomtipoposicionfuego', aftDefaultController, 'NomTipoPosicionFuego', idioma.lbNomTipoPosicionFuego);
                        break;
                    case 'NOMTIPOSECCION':
                        viewport.addNodoTree(idioma.lbTipoSeccion, 'nomtiposeccion', aftDefaultController, 'NomTipoSeccion', idioma.lbNomTipoSeccion);
                        break;
                    case 'NOMSISTEMACONSTRUCTIVO':
                    viewport.addNodoTree(idioma.lbSistemaConstructivo, 'nomsistemaconstructivo', aftDefaultController, 'NomSistemaConstructivo', idioma.lbNomSistemaConstructivo);
                        break;                    
                     case 'NOMLOCAL':                     
                    viewport.addNodoTree(idioma.lbLocal, 'nomlocal', aftDefaultController, 'NomLocal', idioma.lbNomLocal);
                        break;
                    case 'NOMMATERIALCONSTRUCCION':
                        viewport.addNodoTree(idioma.lbMaterialConstruccion, 'nommaterialconstruccion', aftDefaultController, 'NomTipoConstruccion', idioma.lbNomMaterialConstruccion);
                        break;
                    case 'OCUPACIONVIV':
                        viewport.addNodoTree(idioma.lbOcupacionViv, 'nomocupacionviv', aftDefaultController, 'NomOcupacionViv', idioma.lbNomOcupacionViv);
                        break;
                    case 'VINCULACIONLABORAL':
                        viewport.addNodoTree(idioma.lbVinculacionLaboral, 'nomvinculacionlaboral', aftDefaultController, 'NomVinculacionLaboral', idioma.lbNominculacionLaboral);
                        break;
                    case 'OTRASINSTALACIONES':
                        viewport.addNodoTree(idioma.lbOtrasInstalaciones, 'nomotrasinstalaciones', aftDefaultController, 'NomOtrasInstalaciones', idioma.lbNomOtrasInstalaciones);
                        break;
                }
                
                
            }
        } else {
            mostrarMensaje(1, 'Debe configurar los recursos para esta acción.');
        }
    }

}

UCID.portal.cargarEtiquetas('nomencladoresgeneralesaft', function (perfil, idioma) {

    Ext.QuickTips.init();

    UCID.portal.cargarAcciones(window.frameElement.id, function (res) {
        urlReportes = UCID.portal.getAccionesReportes();
        var vista = Ext.erp.LOG.Nomencladores.Vista;
        vista.init(idioma, {});
    });

});