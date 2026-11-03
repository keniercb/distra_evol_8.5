Ext.ns('Ext.erp.LOG.Nomenladores');

Ext.erp.LOG.Nomenladores.Vista = {
    init: function (idioma, modelo) {
        var viewport = new Ext.erp.viewPortNomencladores({
            title: idioma.lbTituloNomencladores
        });
        var defaultController = '/logistica/utiles/nomencladores/index.php/nomencladores/';
        if (acciones_reportes.length > 0) {
            for (var i = 0; i < acciones_reportes.length; i++) {
                switch (acciones_reportes[i].abreviatura) {
                    case 'NOMTAREA':
                        viewport.addNodoTree(idioma.lbTituloTipoArea, 'tipoarea', defaultController, 'NomTipoarea');
                        break;
                    case 'NOMTCALID':
                        viewport.addNodoTree(idioma.lbTituloTipoCalidad, 'tipocalidad', defaultController, 'NomCalidadmovdiferencia');
                        break;
                    case 'NOMTRANS':
                        viewport.addNodoTree(idioma.lbTituloTipoTransferencia, 'transferencia', defaultController, 'NomTipotransferencia');
                        break;
                    case 'NOMTIPOROTACION':
                        viewport.addNodoTree(idioma.lbTituloTipoRotacion, 'tiporotacion', defaultController, 'NomTiporotacion');
                        break;
                    case 'NOMTIPOTRANSFINTERNA':
                        viewport.addNodoTree(idioma.lbTituloTipoTransfInterna, 'tipotransfinterna', defaultController, 'NomTipotransfinterna');
                        break;
                    case 'NOMTIPOUBI':
                        viewport.addNodoTree(idioma.lbTituloTipoUbicacion, 'tipoubicacion', defaultController, 'NomTipoubicacion');
                        break;
                    case 'NOMCONCEPT':
                        viewport.addNodoTree(idioma.lbTituloTipoConcepto, 'concepto', defaultController, 'NomConcepto');
                        break;
                    case 'NOMCAT':
                        viewport.addNodoTree(idioma.lbTituloTipoCategoria, 'categoria', defaultController, 'NomCategoriasproducto');
                        break;
                    case 'NOMCPRECIO':
                        viewport.addNodoTree(idioma.lbTituloCategoriaPrecio, 'categoriaprecio', defaultController, 'NomCategoriaprecio');
                        break;
                    case 'NOMTPRECIO':
                        viewport.addNodoTree(idioma.lbTituloTipoPrecio, 'tipoprecio', defaultController, 'NomTipoprecio');
                        break;
					case 'NOMCUENTASUM':
						viewport.addNodoTree(idioma.lbTituloCuentaSum, 'cuentasuministrador', defaultController, 'NomCuentasuministrador');
						break;
					case 'NOMCILINDRO':
						viewport.addNodoTree(idioma.lbTituloCilindro, 'cilindros', defaultController, 'NomCilindro');
						break;
                    case 'NOMFORMAPAGO':
                        viewport.addNodoTree(idioma.lbTituloFormaPago, 'formapago', defaultController, 'NomFormapago');
                        break;
                    /*case 'NOMCOND':
                     viewport.addNodoTree(idioma.lbTituloCondicionPago, 'condicionpago', defaultController, 'NomCondicionpago');
                     break;
                     case 'NOMSERIE':
                     viewport.addNodoTree(idioma.lbTituloSerieDocumento, 'seriedocumento', defaultController, 'NomSerieDocumento');
                     break;*/
                    case 'NOMTRECLAMO':
                        viewport.addNodoTree(idioma.lbTituloReclamo, 'tiporeclamo', defaultController, 'NomTiporeclamo');
                        break;
                    case 'NOMCLASCONT':
                        viewport.addNodoTree(idioma.lbTituloClasCont, 'clasificacioncontable', defaultController, 'NomClasificacioncontablelog');
                        break;
                    case 'NOMCLASCONTFACT':
                        viewport.addNodoTree(idioma.lbTituloClasCont, 'clasificacioncontablefact', defaultController, 'NomClasificacioncontablelog');
                        break;
                    case 'NOMNORMAS':
                        viewport.addNodoTree(idioma.lbTituloNorma, 'norma', defaultController, 'NomNorma');
                        break;

                    case 'NOMCONSERVA':
                        viewport.addNodoTree(idioma.lbTituloConservacion, 'conservacion', defaultController, 'NomConservacion');
                        break;
                    case 'NOMREVESTIMIENTO':
                        viewport.addNodoTree(idioma.lbTituloRevestimiento, 'revestimiento', defaultController, 'NomRevestimiento');
                        break;
                    case 'NOMPARTIDA':
                        viewport.addNodoTree(idioma.lbTituloPartida, 'partida', defaultController, 'NomPartida');
                        break;
                    case 'NOMFABRICA':
                        viewport.addNodoTree(idioma.lbTituloFabrica, 'fabrica', defaultController, 'NomFabrica');
                        break;
                    case 'NOMELEMENTO':
                        viewport.addNodoTree(idioma.lbTituloElemento, 'elemento', defaultController, 'NomElemento');
                        break;
                    case 'NOMANNO':
                        viewport.addNodoTree(idioma.lbTituloAnnofabricacion, 'annofabricacion', defaultController, 'NomAnnofabricacion');
                        break;
                    case 'NOMMARCAARM':
                        viewport.addNodoTree(idioma.lbTituloMarcaarmamento, 'marcaarmamento', defaultController, 'NomMarcaarmamento');
                        break;
                    case 'NOMMACTIVIDAD':
                        viewport.addNodoTree(idioma.lbTituloActividad, 'actividadalimento', defaultController, 'NomActividadalimento');
                        break;
                    case 'NOMTIPOCAJA':
                        viewport.addNodoTree(idioma.lbTituloTipocaja, 'tipocaja', defaultController, 'NomTipocaja');
                        break;
                    case 'NOMPOS':
                        viewport.addNodoTree(idioma.lbTituloPos, 'pos', defaultController, 'NomPos');
                        break;
                    case 'NOMMODOPAGO':
                        viewport.addNodoTree(idioma.lbTituloModopago, 'modopago', defaultController, 'NomModopago');
                        break;
                    case 'NOMDESCUENTO':
                        viewport.addNodoTree(idioma.lbTituloDescuento, 'descuento', defaultController, 'NomDescuento');
                        break;
                    case 'NOMTASACAMBIO':
                        viewport.addNodoTree(idioma.lbTituloTasacambio, 'tasacambio', defaultController, 'NomTasacambio');
                        break;
                    case 'NOMTIEMPOGARANTIA':
                        viewport.addNodoTree(idioma.lbTituloTiempo, 'tiempo', defaultController, 'NomTiempo');
                        break;
                    case 'NOMFALLA':
                        viewport.addNodoTree(idioma.lbTituloTipofalla, 'fallasmedios', defaultController, 'NomFallasmedios');
                        break;
                    case 'NOMEDAD':
                        viewport.addNodoTree(idioma.lbTituloNomedades, 'nomedades', defaultController, 'NomEdades');
                        break;
                    case 'NOMTIPOAVERIA':
                        viewport.addNodoTree(idioma.lbTituloTipoaveria, 'tipoaveria', defaultController, 'NomTipoaveria');
                        break;
                    case 'NOMTIPOCONTROLADOR':
                        viewport.addNodoTree(idioma.lbTituloTipocontrolador, 'tipocontrolador', defaultController, 'NomTipocontrolador');
                        break;
                   /* case 'NOMTIPOREFRIGERANTE':
                        viewport.addNodoTree(idioma.lbTituloTiporefrigerante, 'tiporefrigerante', defaultController, 'NomTiporefrigerante');
                        break;*/
                    /*case 'NOMMODELOMAQUINA':
                        viewport.addNodoTree(idioma.lbTituloModelomaquina, 'modelomaquina', defaultController, 'NomModelomaquina');
                        break;*/
                    case 'NOMCONDICIONCONTENEDOR':
                        viewport.addNodoTree(idioma.lbTituloCondicioncontenedor, 'condicioncontenedor', defaultController, 'NomCondicioncontenedor');
                        break;
                    case 'NOMCONDICIONEMBARQUE':
                        viewport.addNodoTree(idioma.lbTituloCondicionembarque, 'condicionembarque', defaultController, 'NomCondicionembarque');
                        break;
                    /*case 'NOMMAQUINAREFRIGERACION':
                        viewport.addNodoTree(idioma.lbTituloMaquinarefrigeracion, 'maquinarefrigeracion', defaultController, 'NomMaquinarefrigeracion');
                        break;*/
                    case 'NOMTIPOACTIVIDAD':
                        viewport.addNodoTree(idioma.lbTituloTipoactividad, 'tipoactividad', defaultController, 'NomTipoactividad');
                        break;
                    case 'NOMACTIVIDADCONTENEDOR':
                        viewport.addNodoTree(idioma.lbTituloActividadcontenedor, 'actividadcontenedor', defaultController, 'NomActividadcontenedor');
                        break;
                    case 'NOMDESTINO':
                        viewport.addNodoTree(idioma.lbTituloDestino, 'nomdestino', defaultController, 'NomDestino');
                        break;
                    case 'NOMCUADREPROCESO': 
                        viewport.addNodoTree(idioma.lbTituloCuadreProceso, 'nomcuadreproceso', defaultController, 'NomCuadreProceso');
                        break; 
                    case 'NOMUBICACIONTALL': 
                        viewport.addNodoTree(idioma.lbTituloUbicaciontall, 'nomubicaciontall', defaultController, 'NomUbicaciontall');
                        break;    
                    case 'NOMCLASIFICACION':
                        viewport.addNodoTree(idioma.lbTituloClasificacion, 'nomclasificacion', defaultController, 'NomClasificacion');
                        break;
                    /*Nom de Matriculas*/
                    case 'NOMSECTOR':
                        viewport.addNodoTree(idioma.lbTituloSector, 'sector', defaultController, 'NomSector');
                        break;
                    case 'NOMTIPOCHAPA':
                        viewport.addNodoTree(idioma.lbTituloTipoChapa, 'tipochapa', defaultController, 'NomTipoChapa');
                        break;
                    case 'NOMTIPOTRAMITE':
                        viewport.addNodoTree(idioma.lbTituloTipoTramite, 'tipotramite', defaultController, 'NomTipoTramite');
                        break;
                    case 'NOMMETODOENSAYO':
                        viewport.addNodoTree(idioma.lbTituloMetodoEnsayo, 'metodoensayo', defaultController, 'NomMetodo');
                        break;
                    case 'NOMPRUEBA':
                        viewport.addNodoTree(idioma.lbTituloPrueba, 'pruebacalidad', '/logistica/controlcalidad/nomencladores/index.php/pruebacalidad/', 'NomPruebaCalidad');
                        break;
                    case 'NOMTIPOENSAYO':
                        viewport.addNodoTree(idioma.lbTituloTipoEnsayo, 'tipoensayo', '/logistica/controlcalidad/nomencladores/index.php/tipoensayo/', 'NomTipoEnsayo');
                        break;
                    case 'NOMROL':
                        viewport.addNodoTree(idioma.lbTituloRol, 'nomrol', defaultController, 'NomRol');
                        break;
                    case 'NOMTIPOCOMPRA':
                        viewport.addNodoTree(idioma.lbTituloTipoCompra, 'tipocompra', '/logistica/compra/configuracion/index.php/gesttipocompra/', 'NomTipocompra');
                        break;
                    case 'NOMORIGENEXPEDICION':
                        viewport.addNodoTree(idioma.lbTituloOrigenExpedicion, 'origenexpedicion', '/logistica/compra/configuracion/index.php/gestorigenexpedicion/', 'NomOrigenexpedicion');
                        break;
                    case 'NOMTERMINOCOMERCIAL':
                        viewport.addNodoTree(idioma.lbTituloTerminoComercial, 'terminocomercial', defaultController, 'NomTerminocomercial');
                        break;
                    case 'NOMEMPREIMPORT':
                        viewport.addNodoTree(idioma.lbTituloImportadora, 'empresaimportadora', defaultController, 'NomImportador');
                        break;
                    case 'NOMCRITERIOEVAL':
                        viewport.addNodoTree(idioma.lbTituloTipoEvaluacion, 'criterioevaluacion', defaultController, 'NomCriterioevaluacion');
                        break;
                    case 'NOMMODOTRANSP':
                        viewport.addNodoTree(idioma.lbTituloModoTransporte, 'modotransporte', '/logistica/compra/configuracion/index.php/gestmodotransporte/', 'NomModotransporte');
                        break;
                    case 'NOMENVASES':
                        viewport.addNodoTree(idioma.lbTituloTipoEnvase, 'tipoenvase', defaultController, 'NomTipoenvase');
                        break;
                    case 'NOMTIPOPRECIO':
                        viewport.addNodoTree(idioma.lbTituloTipoPrecioCompra, 'tipopreciocompra', defaultController, 'NomTipopreciocompra');
                        break;
                   /* case 'NOMTIPOCONTENEDCOMPRA':
                        viewport.addNodoTree(idioma.lbTituloTipocontenedor, 'tipocontenedor', defaultController, 'NomTipocontenedorcompra');
                        break;*/
                    case 'NOMTIPOEMBALAJE':
                        viewport.addNodoTree(idioma.lbTituloTipoembalaje, 'tipoembalaje', defaultController, 'NomTipoembalajeContenedor');
                        break;

                    case 'NOMTIPOSERVICIO':
                        viewport.addNodoTree(idioma.lbTituloTipoServicio, 'tiposervicio', defaultController, 'NomTipoServicio');
                        break;

                    case 'NOMIMO':
                        viewport.addNodoTree(idioma.lbTituloImo, 'imo', defaultController, 'NomImo');
                        break;

                    case 'NOMPAGE':
                        viewport.addNodoTree(idioma.lbTituloPage, 'page', defaultController, 'NomPage');                      
 /*Nomencladores de farmacia*/
                    /*case 'NOMLINEAPRODUCTO':
                        viewport.addNodoTree(idioma.lbTituloLineaProducto, 'lineaproductofarm', defaultController, 'NomLineaProductoFarm');
                    break;*/

                    case 'NOMFARMACEUTICA':
                        viewport.addNodoTree(idioma.lbTituloFarmaceutica, 'formafarmaceutica', defaultController, 'NomFormaFarmaceutica');
                    break;

                    case 'NOMGRUPOFARMACOLOGICO':
                        viewport.addNodoTree(idioma.lbTituloGrupFarmaCologico, 'grupofarmacologico', defaultController, 'NomGrupoFarmaceutico');
                    break;

                    case 'NOMCONCEPTORETENDO':
                        viewport.addNodoTree(idioma.lbTituloConceptoRetenido, 'conceptoretenido', defaultController, 'NomConceptoRetenido');
                    break;

                    case 'NOMCONSULTORIO':
                        viewport.addNodoTree('Consultorio', 'consultorio', defaultController, 'NomConsultorio');
                    break;
                    
					case 'NOMMOTIVODEVOLUCION':
                        viewport.addNodoTree(idioma.lbTituloMotivoDevolucion, 'motivodevolucion', defaultController, 'NomMotivodevolucion');
break;
                    case 'NOMTIPOCONTROLCALIDAD':
                        viewport.addNodoTree(idioma.lbTituloTipoControl, 'tipocontrolcalidad', defaultController, 'NomTipoControlCalidad');
                        break;

                    case 'NOMTIPOCOMBUSTIBLE':
                    viewport.addNodoTree(idioma.lbTituloTipoCombustible, 'nomtipocombustible', defaultController, 'NomTipoCombustibleCupet');
                    break;

                    case 'NOMSURTIDOR':
                    viewport.addNodoTree(idioma.lbTituloSurtidores, 'nomsurtidor', defaultController, 'NomSurtidor');
                    break;

                    case 'NOMCLASIFICACIONTARJETA':
                        viewport.addNodoTree(idioma.lbTituloClasificacionTarjeta, 'clasificaciontarjeta', defaultController, 'NomClasificacionTarjeta');
                    break;
                    case 'NOMBINES':
                        viewport.addNodoTree(idioma.LbTituloBines, 'nombines', defaultController, 'NomBines');
                        break;

                    case 'NOMTIPOIDENTIFICADORTARJETA':
                        viewport.addNodoTree(idioma.lbTituloTipoIdentificadorTarjeta, 'tipoidentificadortarjeta', defaultController, 'NomTipoIdentificadorTarjeta');
                        break;

                    case 'NOMTIPOOPERACION':
                        viewport.addNodoTree(idioma.lbTituloTipoOperacion, 'tipooperacion', defaultController, 'NomTipoOperacion');
                        break;

                }
            }
        } else {
            mostrarMensaje(1, 'Debe configurar los recursos para esta acci\xf3n.');
        }
    }
};

Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('nomencladores', function (perfil, idioma) {
    var vista = Ext.erp.LOG.Nomenladores.Vista;

    UCID.portal.cargarAcciones(window.frameElement.id, function (res) {
        urlReportes = UCID.portal.getAccionesReportes();
        vista.init(idioma, {});
    });
});
