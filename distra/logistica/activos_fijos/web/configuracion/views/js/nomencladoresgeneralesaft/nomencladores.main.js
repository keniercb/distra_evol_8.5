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
        var aftDefaultController = '/logistica/activos_fijos/configuracion/index.php/nomencladoresgeneralesaft/';
        var defaultController = '/configuracion/nomgenerales/index.php/nomencladoresgenerales/';
        if (acciones_reportes.length > 0) {
            for (var i = 0; i < acciones_reportes.length; i++) {
                switch (acciones_reportes[i].abreviatura) {
                    case 'NOMESTATUS':
                        viewport.addNodoTree(idioma.lbEstatus, 'nomestatus', '/logistica/activos_fijos/configuracion/index.php/nomestatus/', 'NomEstatustecnico', idioma.lbtabEstatus);
                        //'/logistica/activos_fijos/configuracion/index.php/nomestatus/'
                        break;
                    case 'NOMCOLOR':
                        viewport.addNodoTree(idioma.lbColor, 'color', aftDefaultController, 'NomColor', idioma.lbtabColor);
                        break;
                    case 'NOMACTIV':
                        viewport.addNodoTree('Grupo de explotaci\xf3n'/*idioma.lbActividad*/, 'actividad', aftDefaultController, 'NomActividadMedio', "Nomenclador grupo de explotaci\xf3n"/*idioma.lbtabActividad*/);
                        break;
                    case 'NOMDESTINOFINAL':
                        viewport.addNodoTree(idioma.lbDestinoFinal, 'destinofinal', aftDefaultController, 'NomDestinoFinal', idioma.lbtabDestinoFinal);
                        break;
                    case 'NOMMODULACION':
                        viewport.addNodoTree(idioma.lbModulacion, 'modulacion', aftDefaultController, 'NomModulacion', idioma.lbtabModulacion);
                        break;
                    /*case 'NOMBANDERA':
                        viewport.addNodoTree(idioma.lbBandera, 'bandera', aftDefaultController, 'NomBandera', idioma.lbtabBandera);
                        break;
                    case 'NOMCASACLASIFIC':
                        viewport.addNodoTree(idioma.lbCasaClasific, 'casaclasific', aftDefaultController, 'NomCasaClasificadora', idioma.lbtabCasaClasific);
                        break;*/
                    default:
                        for(var j =0; j < arrNomencladoresPlugins.length; j++){
                            viewport = arrNomencladoresPlugins[j].init(viewport, acciones_reportes[i].abreviatura);
                        }
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