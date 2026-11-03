/*
 * Gestionar proceso de selección.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Gestionarprocesoseleccion
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Seleccion.Gestionarprocesoseleccion');

Pvd.Seleccion.Gestionarprocesoseleccion.Controlador = {
    init: function (idioma, vista, modelo) {
		
		this.accion = 'add';
		var accionTec = 'add';
        var windSow = 0 ;var windAsCom = 0; var windTec = 0; var windProc = 0; var windResp = 0; var windAddTec = 0;
        var estado = '';
		var rowIndex, idp, idplanilla, idmodelomat, idpt, idvalor, datosProc, idexpresion, recursos;
		var itemTab = new Array();
        var busc = 0;

        vista.btnAdicionar.focus();
		modelo.stProcesosSeleccion.load({params:{start:0, limit:15}});
        comprobarValidezResultadoTecnica();
		vista.plantillaInformacion.compile();
		vista.pStart.add(vista.plantillaInicio);
		//Proceso selección
        modelo.stProcesosSeleccion.on('load', function(st){
            if (busc == 1 && st.getCount()==0) {
                mostrarMensaje(1, idioma.lbNoDatosBusc);
                busc = 0;
            } else if (st.getCount()==0) {
                mostrarMensaje(1, idioma.lbNoDatos);
            }
            if (vista.gpProcesosSeleccion.getSelectionModel().getCount() == 0) {
                vista.btnModificar.disable();
                vista.btnEliminar.disable();
				vista.btnAsociar.disable();
				vista.btnTecnica.disable();
				vista.btnModelo.disable();
				vista.btnGestProceso.disable();
                vista.btnCompartir.disable();
            }
            var datos =  modelo.stProcesosSeleccion.getRange();
            var comvencido = 0;
            var tecnicaven = 0;
            for (i = 0; i < datos.length; i++){
                if ((datos[i].get('cantd') >= 0 || datos[i].get('cantd') == null)) {
                    if (datos[i].get('comitesexpirados').length > 0) {
                        comvencido = 1;
                    }
                    if (datos[i].get('tecnicasexpiradas')==1 || datos[i].get('planillasexpiradas')==1) {
                        tecnicaven = 1;
                    }
                }
            }
            if (comvencido == 1 && tecnicaven == 1) {
                advertencia(idioma.lbTecnicaComiteExpirados);
            } else if (comvencido == 1) {
                advertencia(idioma.lbComitesExpirados);
            } else if (tecnicaven == 1) {
                advertencia(idioma.lbTecnicaExpirada);
            }
        });

        modelo.stProcesosSeleccion.on('beforeload', function(st){
            var cargartodo = (vista.chbMostrarMasProc.checked == true)?1:0;
            st.baseParams.cargartodo = cargartodo;
        });

        vista.chbMostrarMasProc.on('check', function(){
            modelo.stProcesosSeleccion.load({params:{start:0, limit:15}});
        });
  
		vista.gpProcesosSeleccion.getSelectionModel().on('rowselect', function () {
			datosProc = vista.gpProcesosSeleccion.getSelectionModel().getSelected().data;
			idp = datosProc.idproceso;
            estado = datosProc.estado;
			idexpresion = datosProc.idexpresion;
			recursos = (datosProc.recurso)?datosProc.recurso:-1;
			modelo.tlMenuSeleccion.baseParams.idproceso = idp;
            modelo.tlMenuSeleccion.baseParams.otro = datosProc.otro;
            if (datosProc.otro == 1) {
                vista.btnModificar.disable();
                vista.btnEliminar.disable();
                vista.btnAsociar.disable();
                vista.btnTecnica.disable();
                vista.btnModelo.disable();
                vista.btnCompartir.disable();
                vista.btnVerComp.disable();
            } else {
                vista.btnModificar.enable();
                vista.btnEliminar.enable();
                vista.btnAsociar.enable();
                vista.btnTecnica.enable();
                vista.btnModelo.enable();
                vista.btnCompartir.enable();
                vista.btnVerComp.enable();
            }
            vista.btnGestProceso.enable();
            if (datosProc.cantd == null ||datosProc.cantd >= 0) {
                if (datosProc.comitesexpirados.length > 0) {
                    var mensaje = '';
                    if (datosProc.comitesexpirados.length == 1) {
                        mensaje = idioma.lbDesasociarComiteExpSin;
                    } else {
                        mensaje = idioma.lbDesasociarComiteExpPlu;
                    }
                    mostrarMensaje(2, mensaje, function (btnPresionado){
                        if (btnPresionado == 'ok') {
                            Ext.getBody().mask(idioma.lbMsgEsperaEnviarDatos);
                            Ext.Ajax.request({
                                url: 'desasociarComiteProceso',
                                params: {idproceso: idp, comites: Ext.encode(datosProc.comitesexpirados)},
                                callback: function (){
                                    Ext.getBody().unmask();
                                },
                                success: function (r){
                                    var responseData = Ext.decode(r.responseText);
                                    if(responseData == false)
                                        mostrarMensaje(6, idioma.lbDesFail);
                                    else{
                                        mostrarMensaje(1, idioma.lbDesSucces);
                                    }
                                    modelo.stProcesosSeleccion.reload();
                                }
                            });
                        }
                    });
                } else if (datosProc.tecnicasexpiradas == 1 || datosProc.planillasexpiradas == 1) {
                    mostrarMensaje(2, idioma.lbVerifTecnExpiradas, function (btnPresionado){
                        if (btnPresionado == 'ok') {
                            vista.winGestionarTecnica.show();
                        }
                    });
                }
            }
		}, this);
		
		vista.btnAdicionar.on('click', function(){ 			
			vista.winAdicionarProceso.setTitle(idioma.lbwinAddProceso);
			vista.btnAplicar.show();
			vista.winAdicionarProceso.show();
			limpiarFormulario();
			self.accion = 'add';
        });

        vista.btnVerComp.on('click', function(){
            modelo.stCompetencias.baseParams.idproceso = vista.gpProcesosSeleccion.getSelectionModel().getSelected().data.idproceso;
            modelo.stCompetencias.load();
            vista.winComp.show();
        });

        vista.winAsociarComite.on('show', function(){windAsCom = 1; modelo.stComite.load({params:{start:0, limit:15}});});

        vista.winAsociarComite.on('hide', function(){windAsCom = 0;});

        vista.winAdicionarProceso.on('beforeshow', function(){vista.tfdenominacion.focus(true, 500);});

        vista.winAdicionarProceso.on('show', function(){ windProc = 1; modelo.stCargos.load();});

        vista.winAdicionarProceso.on('hide', function(){windProc = 0;vista.sfBuscarCargo.onTrigger1Click();});

        vista.winGestionarTecnica.on('show', function(){windTec = 1; modelo.stTecnicasSeleccionAs.load({params:{idproceso: idp}});});

        vista.winGestionarTecnica.on('hide', function(){ windTec = 0;});

        vista.winAddTecnicaSelec.on('show', function(){
            windAddTec = 1;
            modelo.stPlanillas.baseParams.idproceso = idp;
            modelo.stPlanillas.load();
            vista.cbPlanillaEval.focus(true, 500);
        });

        modelo.stCompetencias.on('load', function (st, rec, opt) {
            if (rec.length == 0) {
                mostrarMensaje(1,idioma.lbNoDatos);
            }
        }, this);
		
		modelo.stCargos.on('load', function (st, rec, opt) {
            if (rec.length == 0) {
				if (vista.sfBuscarCargo.getValue() == '') {
					mostrarMensaje(1,idioma.lbNoDatos);
				} else {
					mostrarMensaje(1,idioma.lbNoDatosBusc);
				}
			}
            if (self.accion == 'mod' && datosProc.cargos != '') {
                cargarCargosSeleccionados();
            }
		}, this);

        modelo.stEntidades.on('load', function () {
            cargarCompEntidadesSeleccionadas();
        }, this);

        vista.winAddTecnicaSelec.on('hide', function(){ windAddTec = 0;});

        vista.windaddPersona.on('show', function(){
            windResp = 1;
            modelo.stPersonas.load({params:{idproceso: idp}});
        });

        vista.windaddPersona.on('hide', function(){ windResp = 0;});
		
		vista.btnModificar.on('click', function(){ 
			var s = vista.gpProcesosSeleccion.getSelectionModel().getSelected().data;
			vista.winAdicionarProceso.setTitle(idioma.lbwinModProceso);
			vista.btnAplicar.hide();	
			vista.winAdicionarProceso.show();
            vista.tfdenominacion.setValue(s.denominacion);
            vista.tfCantRec.setValue(s.recurso);
            vista.dfInicio.setValue(s.fdesde);
            vista.dfFin.setValue(s.fhasta);
            var ch = (s.contratar == 1)?true:false;
            vista.chbParaContrato.setValue(ch);
            if (s.cargos == '') {
                vista.fsCargos.collapse();
            } else {
                vista.fsCargos.expand();
            }
			self.accion = 'mod';
        });		
		
		vista.btnEliminar.on('click', function(){  			
			eliminarProceso();
        });
				
		vista.gpProcesosSeleccion.on('rowdblclick', function (grid, rowIndex, eventObj) {			
			vista.tpMenuSeleccion.getRootNode().reload();
			vista.tpMenuSeleccion.getRootNode().expand();
			vista.windSeleccionCandidatos.show();
			var info = {denominacion:datosProc.denominacion, recurso: (datosProc.recurso)?datosProc.recurso:'No definido',
			cargos: datosProc.cargos, fdesde: datosProc.fdesde, fhasta: (datosProc.fhasta)?datosProc.fhasta:'No definida'};
			vista.plantillaInformacion.overwrite(vista.pDetallesProceso.body, info);
			vista.windSeleccionCandidatos.maximize();
		}, this);

        vista.btnBuscar.on('click', function(){
            var cargo = null;
            if (vista.cbCargos.getValue() != '') {
                cargo = modelo.stCargos.getAt(vista.cbCargos.selectedIndex);
            }
            modelo.stProcesosSeleccion.load({ params:{
                    denominacion: vista.tfbuscar.getValue(),
                    cargo: (cargo != null)?Ext.encode(cargo.data):new Array(),
                    start: 0,
                    limit: 15
                }
            });
            busc = 1;
        });

        vista.btnLimpiar.on('click', function(){
            vista.tfbuscar.reset();
            vista.cbCargos.reset();
            modelo.stProcesosSeleccion.load({params: {start: 0, limit: 15}});
        });

        vista.windSeleccionCandidatos.on('show', function(){
            windSow = 1;
        });

        vista.windSeleccionCandidatos.on('hide', function(){
            windSow = 0;
        });
		
		vista.btnGestProceso.on('click', function(){
			vista.tpMenuSeleccion.getRootNode().reload();
			vista.tpMenuSeleccion.getRootNode().expand();
			vista.windSeleccionCandidatos.show();
			
			var info = {denominacion:datosProc.denominacion, recurso: (datosProc.recurso)?datosProc.recurso:'No definido',
			cargos: datosProc.cargos, fdesde: datosProc.fdesde, fhasta: (datosProc.fhasta)?datosProc.fhasta:'No definida'};
			
			vista.plantillaInformacion.overwrite(vista.pDetallesProceso.body, info);
			vista.windSeleccionCandidatos.maximize();
        });
		
		vista.btnCancelar.on('click', function(){
			limpiarFormulario();
			vista.winAdicionarProceso.hide();
        });
				
		vista.btnAceptar.on('click', function(){  			
			guardarDatos('ACP');
        });
		
		vista.btnAplicar.on('click', function(){  			
			guardarDatos('APL');
        });
				
		//Tecnicas de selección		
		vista.btnTecnica.on('click', function(){
			vista.winGestionarTecnica.show();
        });

        vista.winGestionarTecnica.on('hide', function(){
            ctroll = 0;
        });
			
		vista.gpTecnicasAsociadas.getSelectionModel().on('rowselect', function (sm) {
            datpt =  vista.gpTecnicasAsociadas.getSelectionModel().getSelected().data;
			idpt = datpt.idprocesotecnica;
            vista.btnModificarTecSel.enable();
            vista.btnEliminarTecSel.enable();
			vista.btnArribaOrden.enable();
			vista.btnAbajoOrden.enable();
			rowIndex = modelo.stTecnicasSeleccionAs.indexOf(sm.getSelected());			
			if (rowIndex == 0) {
				vista.btnArribaOrden.disable();
			}
			if (rowIndex + 1 == modelo.stTecnicasSeleccionAs.getRange().length) {
				vista.btnAbajoOrden.disable();
			}
            if (datpt.cantd != null && datpt.cantd < 0) {
                advertencia(idioma.msgTecnicanoactiva);
            } else if (datpt.planillasexp == 1) {
                advertencia(idioma.msgTecnicaconPlannoactiva);
            }
		}, this);
		
		modelo.stTecnicasSeleccionAs.on('load', function () {
            vista.btnModificarTecSel.disable();
            vista.btnEliminarTecSel.disable();
			vista.btnGuardarOrden.disable();
			vista.btnArribaOrden.disable();
			vista.btnAbajoOrden.disable();
		}, this);
				
		vista.cbModeloMatematico.on('select', function(cb, record){ 			
			idmodelomat = vista.cbModeloMatematico.getValue();
			mostrarCamposHito(record.get('idescala'));
			if (record.get('idescala'))
				cargarValores(record.get('idescala'));
			vista.nfValor.reset();
			vista.cbCondiciones.reset();
			vista.cbValor.reset();
			idvalor = -1;
        });	
		
		modelo.stModelos.on('load', function(st){  			
			vista.cbModeloMatematico.enable();
			if (accionTec == 'mod') {
				var record = vista.gpTecnicasAsociadas.getSelectionModel().getSelected();
				var index = st.find('idmodelo', record.get('idmodelo'), 0, false);
				if (index != -1) {
					vista.cbModeloMatematico.setValue(record.get('idmodelo'));
					if (record.get('hito') == 1) {
						mostrarCamposHito(st.getAt(index).get('idescala'));
					}
					cargarValores(st.getAt(index).get('idescala'));
				}
			}
            if (st.getCount() == 0) {
                mostrarMensaje(1, 'La planilla evaluativa seleccionada no posee modelo matem&aacute;tico.');
            }
        });		
		
		modelo.stValor.on('load', function(){  			
			if (accionTec == 'mod' && idvalor != -1) {
				var valor = modelo.stValor.getById(idvalor);
				vista.cbValor.setValue(idvalor);
				vista.cbValor.setRawValue(valor.data.denominacion);
			}
        });		
					
		vista.cbPlanillaEval.on('select', function(cbx){  
			vista.cbModeloMatematico.reset();
			cargarModelosMatematicos(cbx.getValue());
			idplanilla = cbx.getValue();
        });
			
		vista.fsHito.on('expand', function(){ 
			vista.cbCondiciones.reset();
			vista.cbCondiciones.allowBlank = false;			
			if (Ext.getCmp('iditemnfValor').isVisible()) {
				vista.nfValor.reset();
				vista.nfValor.allowBlank = false;
				vista.cbValor.reset();
				vista.cbValor.allowBlank = true;
			} else {
				vista.cbValor.reset();
				vista.cbValor.allowBlank = false;
				vista.nfValor.reset();
				vista.nfValor.allowBlank = true;
			}			
        });
		
		vista.fsHito.on('collapse', function(){ 
			vista.cbCondiciones.reset();
			vista.cbCondiciones.allowBlank = true;
			if (Ext.getCmp('iditemnfValor').isVisible()) {
				vista.nfValor.reset();
				vista.nfValor.allowBlank = true;
			} else {
				vista.cbValor.reset();
				vista.cbValor.allowBlank = true;
			}
        });

        vista.fsCargos.on('expand', function(){
             vista.winAdicionarProceso.setHeight(484);
             vista.winAdicionarProceso.doLayout();
        });

        vista.fsCargos.on('collapse', function(){
            vista.winAdicionarProceso.setHeight(224);
            vista.winAdicionarProceso.doLayout();
        });
				
		vista.btnArribaOrden.on('click', function(){ 			
			moverArribaAbajo('Arriba');
        });
		
		vista.btnAbajoOrden.on('click', function(){ 			
			moverArribaAbajo('Abajo');
        });
		
		vista.btnGuardarOrden.on('click', function(){ 			
			guardarOrden();
        });
		
		vista.btnAdicionarTecSel.on('click', function(){	
			vista.winAddTecnicaSelec.setTitle(idioma.lbAddTecnSel);
			vista.btnAplicarAddTecnicaSelec.show();	
			vista.winAddTecnicaSelec.show();
			accionTec = 'add';
        });
		
		vista.btnModificarTecSel.on('click', function(){ 
			pt = vista.gpTecnicasAsociadas.getSelectionModel().getSelected().data;
			modelo.stResponsableTecnica.baseParams.idprocesotecnica = pt.idprocesotecnica;	
			modelo.stResponsableTecnica.load();	
			idplanilla = pt.idtecnica;
			idmodelomat = pt.idmodelo;			
			vista.winAddTecnicaSelec.setTitle(idioma.lbModTecnSel);
			vista.btnAplicarAddTecnicaSelec.hide();	
			vista.winAddTecnicaSelec.show();
			vista.cbPlanillaEval.setValue(pt.planilla);			
			var time = pt.validez;
			if (pt.unidad == 2) {
				time = time/30;
			} else if (pt.unidad == 3) {
				time = time/365;
			}   
			vista.tftiempo.setValue(time);
			vista.cbUnidadTime.setValue(pt.unidad);
			cargarModelosMatematicos(idplanilla);			
			vista.cbModeloMatematico.setValue(pt.modelomatematico);
			vista.cbModeloMatematico.enable();
			vista.diAddTecnicaSelec.setValue(pt.fdesde);
			vista.dfAddTecnicaSelec.setValue(pt.fhasta);			
			if (pt.hito == 0) {
				mostrarCamposHito(pt.idescala);	
				Ext.getCmp('eshito').collapse(true);											
				idvalor = -1;
			} else {
				Ext.getCmp('eshito').expand(true);
				vista.cbCondiciones.setValue(pt.condicion);				
				idvalor = pt.valor;
				if (!pt.idescala) {
					vista.nfValor.setValue(pt.valor);
				}
			}
			accionTec = 'mod';
        });		
		
		vista.btnEliminarTecSel.on('click', function(){ 			
			eliminarTecnicaProceso();
        });
		
		vista.btnCerrarTecnica.on('click', function(){	
			vista.winGestionarTecnica.hide();
        });	
		
		vista.btnAceptarAddTecnicaSelec.on('click', function(){  			
			guardarTecnicaProceso('ACP');
        });
		
		vista.btnAplicarAddTecnicaSelec.on('click', function(){  			
			guardarTecnicaProceso('APL');
        });
		
		vista.btnCancelarAddTecnicaSelec.on('click', function(){	
			limpiarFormularioTecnica();
			vista.winAddTecnicaSelec.hide();
        });
		
		//Responsables
		vista.gpResponsableTecnica.getSelectionModel().on('rowselect', function () {            
            vista.btnEliminarresponsabletec.enable();			
		}, this);

        vista.gpResponsableTecnica.getSelectionModel().on('rowdeselect', function () {
            vista.btnEliminarresponsabletec.disable();
        }, this);

		vista.btnAdicionarresponsabletec.on('click', function(){			
			vista.windaddPersona.show();
        });
		
		vista.btnEliminarresponsabletec.on('click', function(){
			var recPersona = vista.gpResponsableTecnica.getSelectionModel().getSelections();
            var mensaje = '';
            if (recPersona.length == 1) {
                mensaje = idioma.msgDelPer_confirmSin;
            } else {
                mensaje = idioma.msgDelPer_confirmPlu;
            }
			mostrarMensaje(2, mensaje, function (btn)
            {
                if (btn == 'ok') {
                    if (!Ext.isEmpty(recPersona) && Ext.isArray(recPersona)) {
                        Ext.each(recPersona, function (rec)
                        {
                            modelo.stResponsableTecnica.remove(rec);
                        }, this);
                        if (recPersona.length == 1) {
                            mostrarMensaje(1, 'El responsable ha sido eliminado satisfactoriamente');
                        } else {
                            mostrarMensaje(1, 'Los responsables han sido eliminados satisfactoriamente');
                        }
                    }
                }
            }.createDelegate(this));
        });	
		
		vista.btnAceptarAddPersona.on('click', function(){
            adicionarResponsable();
        });
		
		vista.btnCancelarAddPersona.on('click', function(){
			vista.gpPersonas.getSelectionModel().clearSelections();	
			vista.windaddPersona.hide();
        });
		
		//Modelo de selección
		vista.btnModelo.on('click', function(){ 
			cargarModelos();
        });	
		
		//Comité de ingreso
		vista.btnAsociar.on('click', function(){ 
			cargarComitesSeleccionados();
			vista.winAsociarComite.show();
        });
						
		vista.btnCancelarComite.on('click', function(){
			vista.gpComite.getSelectionModel().clearSelections();	
			vista.winAsociarComite.hide();
        });
		
		vista.btnAceptarComite.on('click', function(){  			
			guardarComitesProceso();
        });
		
        vista.gpEntidades.getSelectionModel().on('selectionchange', function(){
            vista.btnAceptarCompart.enable();
        });

        vista.btnCompartir.on('click', function(){
            vista.windCompartir.show();
            vista.gpEntidades.getSelectionModel().clearSelections();
            modelo.stEntidades.load();
        });

        vista.btnCancelarCompart.on('click', function(){
            vista.windCompartir.hide();
        });

        vista.btnAceptarCompart.on('click', function(){
            compartirProceso();
        });
		
		//Ventana Selección 		
		vista.tpMenuSeleccion.on('click', function(node){
			if (!vista.tabPanel.getItem(node.id)) {
				if (node.id == 'gestcandidatos') { 
					var panelGestCand = new Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarCandidato({
                                                    idproceso:idp,
                                                    estado:estado,
                                                    idioma:idioma});
					vista.tabPanel.add(panelGestCand);
					itemTab.push(node.id);
				} else if (node.id == 'gestseleccion') {               
					var panelGestSelec = new Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarSeleccion({
													idproceso:idp,
													cantrecurso: recursos,
                                                    estado:estado,
													idexpresionmatematica: idexpresion,
                                                    otro: datosProc.otro,
													idioma:idioma});
					vista.tabPanel.add(panelGestSelec);
					itemTab.push(node.id);
				} else if (node.id == 'analisis') {
					Ext.getBody().mask('Procesando datos  de la gráfica...');
					Ext.Ajax.request({
						url      : 'getDatosGrafica',				
						params   : {idproceso : idp},
						callback : function() {Ext.getBody().unmask();},
						success  : function (r){
							var responseData = Ext.decode(r.responseText);
							if (responseData.success) {
								var serie1 = [['Candidatos en proceso',      parseInt(responseData.data.total_en_proceso)],
											 ['Candidatos preseleccionados', parseInt(responseData.data.total_preseleccionado)],
											 ['Candidatos seleccionados',    parseInt(responseData.data.total_seleccionado)],
											 ['Candidatos excluidos',        parseInt(responseData.data.total_excluido)]];	
								var serie2 = [['Excluidos por el proceso', parseInt(responseData.data.excluido_proceso)],
											 ['Excluidos por el usuario',  parseInt(responseData.data.excluido_usuario)]];	
								var panelAnalisis = new Pvd.Seleccion.Gestionarprocesoseleccion.PanelAnalisis({serieResumen:serie1, serieExcluido:serie2});
								vista.tabPanel.add(panelAnalisis);
								itemTab.push(node.id);
								vista.tabPanel.setActiveTab(node.id);
							} else {
								mostrarMensaje(6, idioma.msgErrorGrafica);
							}
						}
					});
					
				} else if (node.id == 'reporte') {
					var panelReporte = new Pvd.Seleccion.Gestionarprocesoseleccion.PanelReporte({idproceso:idp, idioma:idioma});
					vista.tabPanel.add(panelReporte);
					itemTab.push(node.id);
				} else if (node.id == 'gestseguimiento') {
                    var panelSeguimiento= new Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarSeguimiento({
                        idproceso:idp,
                        estado:estado,
                        idioma:idioma});
                    vista.tabPanel.add(panelSeguimiento);
                    itemTab.push(node.id);
                } else {
					if (node.id != 'tecnicas') {
						var panelGestTecnica = new Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarTecnica({
													idproceso:idp,
                                                    estado:estado,
													idprocesotecnica:node.id,
                                                    cantd: node.attributes.cantd,
                                                    planillasexp: node.attributes.planillasexp,
													idioma:idioma});
						panelGestTecnica.id = node.id;
						panelGestTecnica.title = node.text;
						vista.tabPanel.add(panelGestTecnica);
						itemTab.push(node.id);
					}	else {
						node.expand();
					}				
				}				
			}
			vista.tabPanel.setActiveTab(node.id);
			vista.tpMenuSeleccion.getSelectionModel().clearSelections();
        });	
		
		vista.tabPanel.on('beforeremove', function(a,comp){
			var n = vista.tpMenuSeleccion.getNodeById(comp.id);
			vista.tpMenuSeleccion.getSelectionModel().unselect(n);
        });

		vista.windSeleccionCandidatos.on('hide', function(){
			for (i = 0; i < itemTab.length; i++) {
				vista.tabPanel.remove(itemTab[i]);
			}			
			vista.tabPanel.setActiveTab('inicio');
        });
		
		function cargarValores(idescala)
		{		
			if (!Ext.isEmpty(idescala)) {
				modelo.stValor.load({
					params: {idescala: idescala}
				});
			} else {
				modelo.stValor.removeAll();
			}
		}
		
		function cargarModelosMatematicos(idplanilla)
		{
			if (!Ext.isEmpty(idplanilla)) {
				modelo.stModelos.load({
					params: {idplanilla: idplanilla}
				});
			}			
		}
				
		function cargarModelos() 
		{
			PVD.mostrarMascara('loadtecplan', idioma.lbCampoEspar, idioma.msgLoadTecPlan);
            Ext.Ajax.request({
                url: 'getTecPlanillaByProces',
                method: 'POST',
                params: {
                    idproceso: idp
                },
                callback: function (options, success, response)
                {
                    PVD.ocultarMascara('loadtecplan');
                    var responseData = Ext.decode(response.responseText);
                    var arrTechniques = new Array();
                    Ext.each(responseData.datos, function (tecnica)
                    {
                        arrTechniques.push([
                            tecnica.idplanilla,
                            tecnica.planilla,
                            tecnica.values
                        ]);
                    });
                    if (arrTechniques.length == 0) {
                        mostrarMensaje(1, idioma.lbProcNoTecnica);
                    } else {
                        var win = new Ext.pvd.persona.formula.winEditorExpresionesEvalSel({
                            hideFieldDenom: true,
                            constrain: true,
                            indicadores: arrTechniques,
                            idexpresionmatematica: vista.gpProcesosSeleccion.getSelectionModel().getSelected().get('idexpresion') || -1
                        });
                        win.show();
                        win.on('expresionsalvada', function (result)
                        {
                            PVD.mostrarMascara('expmatsaved', idioma.lbCampoEspar, idioma.lbSalvExpMat);
                            Ext.Ajax.request({
                                url: 'addModeloProcesoseleccion',
                                method: 'POST',
                                params: {
                                    idproceso: idp,
                                    idexpresionmatematica: result.idexpresionmatematica
                                },
                                callback: function (options, success, response)
                                {									
                                    responseData = Ext.decode(response.responseText);
                                    PVD.ocultarMascara('expmatsaved');
                                    win.close();
									modelo.stProcesosSeleccion.reload();
                                }
                            });
                        });
                    }
                }
            });
		}
		
		function mostrarCamposHito(idescala)
        { 
            if (!Ext.isEmpty(idescala)) {
                Ext.getCmp('iditemcbValor').show();				
                Ext.getCmp('iditemnfValor').hide();				
            } else {
                modelo.stValor.removeAll();
                vista.cbValor.reset();
                Ext.getCmp('iditemnfValor').show();
                Ext.getCmp('iditemcbValor').hide();               
            }
            Ext.getCmp('eshito').doLayout();
        }
		
		function guardarDatos(btnpress){	
			if (vista.fAddProceso.getForm().isValid()) {
				var cargos = new Array();
				for(i = 0; i < vista.gpCargos.getSelections().length; i++){
				    cargos.push(vista.gpCargos.getSelections()[i].data);
				}
				if (vista.fsCargos.collapsed == true || cargos.length > 0) {
					Ext.Ajax.request({
						url: (self.accion == 'add' ? 'addProcesoSeleccion' : 'modProcesoSeleccion'),
						params: {
							idproceso: self.accion == 'add' ? -1 : idp,
							denominacion: vista.tfdenominacion.getValue(),
							recurso: vista.tfCantRec.getValue(),
							cargos: Ext.encode(cargos),
							fdesde: vista.dfInicio.getRawValue(),
							fhasta: vista.dfFin.getRawValue(),
                            contratar: (vista.chbParaContrato.checked == true)?1:2
						},
						success: function (r){
							var responseData = Ext.decode(r.responseText);
							if (self.accion == 'mod' && responseData == true) {
								mostrarMensaje(1, idioma.msgMod_success);
							} else if (self.accion == 'mod' && responseData == false)  {
								mostrarMensaje(6, idioma.msgMod_fail);
							}
							if (self.accion == 'add' && responseData == true) {
								mostrarMensaje(1, idioma.msgAdd_success);
							} else if (self.accion == 'add' && responseData == false)  {
								mostrarMensaje(6, idioma.msgAdd_fail);
							}
							if (btnpress == 'ACP' && responseData == true)
							{
								vista.winAdicionarProceso.hide();
							}
							limpiarFormulario();
							modelo.stProcesosSeleccion.reload();
						}
					});
				} else {
					mostrarMensaje(6, 'Debe seleccionar al menos un cargo.');
				}				
			}
		} 
		
		function eliminarTecnicaProceso(){	
			var tecnicas = new Array();
			var s = vista.gpTecnicasAsociadas.getSelectionModel().getSelections();
			for(i = 0; i < s.length; i++) {
                tecnicas.push(s[i].data.idprocesotecnica);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = idioma.msgDelT_confirmSin;
            } else {
                mensaje = idioma.msgDelT_confirmPlu;
            }
			mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.msgDel_status);
                    Ext.Ajax.request({
                        url: 'deleteTecnicaProceso',
						params: {tecnicas: Ext.encode(tecnicas)},
                        callback: function (){
							Ext.getBody().unmask();                                                    
                        },
                        success: function (r){
							var responseData = Ext.decode(r.responseText);
							if(responseData == false) {
                                if (s.length == 1) {
                                    mensaje = idioma.msgDelT_failSin;
                                } else {
                                    mensaje = idioma.msgDelT_failPlu;
                                }
                                mostrarMensaje(6, mensaje);
                            } else{
                                if (s.length == 1) {
                                    mensaje = idioma.msgDelT_successSin;
                                } else {
                                    mensaje = idioma.msgDelT_successPlu;
                                }
                                mostrarMensaje(1, mensaje);
							}
							modelo.stTecnicasSeleccionAs.reload(); 
						}
                    });
                }
            });
		}
		
		function eliminarProceso(){	
			var procesos = new Array();
			var s = vista.gpProcesosSeleccion.getSelectionModel().getSelections();
			for(i = 0; i < s.length; i++) {
                procesos.push(s[i].data.idproceso);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = idioma.msgDel_confirmSin;
            } else {
                mensaje = idioma.msgDel_confirmPlu;
            }
			mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.msgDel_status);
                    Ext.Ajax.request({
                        url: 'delProcesoSeleccion',
                        params: {procesos: Ext.encode(procesos)},
                        callback: function (){
							Ext.getBody().unmask();                                                    
                        },
                        success: function (r){
							var responseData = Ext.decode(r.responseText);
							if(responseData == false) {
                                if (s.length == 1) {
                                    mensaje = idioma.msgDel_failSin;
                                } else {
                                    mensaje = idioma.msgDel_failPlu;
                                }
                                mostrarMensaje(6, mensaje);
                            } else{
                                if (s.length == 1) {
                                    mensaje = idioma.msgDel_successSin;
                                } else {
                                    mensaje = idioma.msgDel_successPlu;
                                }
                                mostrarMensaje(1, mensaje);
							}
							modelo.stProcesosSeleccion.reload(); 
						}
                    });
                }
            });
		}
		
		function cargarCargosSeleccionados() 
		{
			Ext.Ajax.request({
				url: 'getCargosByIdProceso',
				params: {idproceso:idp},
				callback: function (){                                                    
				},
				success: function (r){
					var responseData = Ext.decode(r.responseText);
                    if (responseData.length > 0) {
                        var objrec = [];
                        for (i=0; i<responseData.length; i++) {
                            var obj = modelo.stCargos.getById(responseData[i].idcargo);
                            objrec.push(obj);
                        }
                        vista.smCargos.selectRecords(objrec);
                    }
				}
			});
		}
		
		function cargarComitesSeleccionados() 
		{
			Ext.Ajax.request({
				url: 'getComiteByIdProceso',
				params: {idproceso:idp},
				callback: function (){                                                    
				},
				success: function (r){
					var responseData = Ext.decode(r.responseText);
					var objrec = [];
					for (i=0; i<responseData.length; i++) {
						var obj = modelo.stComite.getById(responseData[i].idcomision);
						objrec.push(obj);
					}
					vista.smComite.selectRecords(objrec);
				}
			});
		}

        function cargarCompEntidadesSeleccionadas()
        {
            Ext.Ajax.request({
                url: 'getEntidadesByIdProceso',
                params: {idproceso:idp},
                callback: function (){
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    var objrec = [];
                    for (i=0; i<responseData.length; i++) {
                        var obj = modelo.stEntidades.getById(responseData[i].idestructura);
                        objrec.push(obj);
                    }
                    vista.smEntidades.selectRecords(objrec);
                    vista.btnAceptarCompart.disable();
                }
            });
        }
		
		function guardarComitesProceso() 
		{
			if (vista.gpComite.getSelections().length > 0) {
				var comites = new Array();
				for(i = 0; i < vista.gpComite.getSelections().length; i++){	
					comites.push(vista.gpComite.getSelections()[i].data);
				}
				Ext.Ajax.request({
					url: 'guardarComiteProceso',
					params: {idproceso:idp,
							 arrcomite: Ext.encode(comites)},
					callback: function (){
                    },
					success: function (r){
						var responseData = Ext.decode(r.responseText);
						if (responseData) {
                            if (comites.length == 1) {
                                mostrarMensaje(1, 'La comisi&oacute;n ha sido asociada satisfactoriamente.');
                            } else {
                                mostrarMensaje(1, 'Las comisiones han sido asociadas satisfactoriamente.');
                            }
						} else {
							mostrarMensaje(6,idioma.msgSave_fail);
						}
						vista.winAsociarComite.hide();
					}
				});
			} else {
				mostrarMensaje(6, idioma.msgSave_Vacio);
			}			
		}

        function compartirProceso()
        {
            var entidades = new Array();
            for(i = 0; i < vista.gpEntidades.getSelections().length; i++){
                entidades.push(vista.gpEntidades.getSelections()[i].id);
            }
            Ext.getBody().mask('Guardando datos...');
            Ext.Ajax.request({
                url: 'compartirProceso',
                params: {idproceso:idp,
                         entidades: Ext.encode(entidades)},
                callback: function (){
                    Ext.getBody().unmask();
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    if (responseData) {
                        if (entidades.length > 0) {
                            mostrarMensaje(1,'El proceso de selecci&oacute;n ha sido compartido satisfactoriamente.');
                        } else {
                            mostrarMensaje(1,'El proceso de selecci&oacute;n ha sido descompartido satisfactoriamente.');
                        }
                    } else {
                        mostrarMensaje(6,idioma.msgSave_fail);
                    }
                    vista.windCompartir.hide();
                }
            });
        }
		
		function guardarTecnicaProceso(btnpress) 
		{
			var todosresp = modelo.stResponsableTecnica.getRange();
			var responsables = new Array();
			for(i = 0; i < todosresp.length; i++){	
				responsables.push(todosresp[i].data.idcomisionpersona);
			}
			var hito = 0;
			if(!vista.fsHito.collapsed){
				hito = 1;
			} 
			var validez = vista.tftiempo.getValue();
			if (vista.cbUnidadTime.getValue() == 2) {
				validez = validez * 30;
			} else if (vista.cbUnidadTime.getValue() == 3) {
				validez = validez * 365;
			}
			if (vista.fpTecnicaSelec.getForm().isValid()) {
				Ext.Ajax.request({
					url: 'guardarTecnicaProceso',
					params: {idprocesotecnica:idpt,
							 idproceso:idp,
							 idtecnica: idplanilla,
							 idmodelo: idmodelomat,
                             tiempo: validez,
							 unidad: vista.cbUnidadTime.getValue(),
							 fdesde: vista.diAddTecnicaSelec.getRawValue(),
							 fhasta: vista.dfAddTecnicaSelec.getRawValue(),
							 hito: hito,
							 condicion: vista.cbCondiciones.getValue(),
							 valor: (vista.nfValor.getValue())?vista.nfValor.getValue():vista.cbValor.getValue(),
							 responsables: Ext.encode(responsables),
							 accion: accionTec},
					callback: function (){},
					success: function (r){
						var responseData = Ext.decode(r.responseText);
						if (responseData == true) {
							mostrarMensaje(1, idioma.msgSave_success);
						}
						if (btnpress == 'ACP')
						{
							vista.winAddTecnicaSelec.hide();
						}
						limpiarFormularioTecnica();
						modelo.stTecnicasSeleccionAs.reload();
					}
				});				
			} else {
				mostrarMensaje(6,idioma.lbCamposVacios)
			}
		}
		
		function limpiarFormularioTecnica()
		{	modelo.stValor.removeAll();
			vista.fpTecnicaSelec.getForm().reset();
			vista.fsHito.collapse();			
			modelo.stResponsableTecnica.removeAll();
			modelo.stModelos.removeAll();
			vista.cbModeloMatematico.disable();
		}
		
		function limpiarFormulario()
		{
			vista.tfdenominacion.setValue('');
			vista.tfCantRec.setValue('');
			vista.dfInicio.setValue(new Date().format('d/m/Y'));
			vista.dfFin.setValue('');
			vista.fAddProceso.getForm().clearInvalid();
			vista.gpCargos.getSelectionModel().clearSelections();
            vista.fsCargos.expand();
            vista.chbParaContrato.reset();
		}
		
		function moverArribaAbajo(dirmov)
		{
			var recordSeleccionado = vista.gpTecnicasAsociadas.getSelectionModel().getSelected();
			var ordenSelec = recordSeleccionado.get('orden');
			var recordAux = recordSeleccionado;
			if (dirmov == 'Arriba') {
				var recordAnterior = modelo.stTecnicasSeleccionAs.getAt(rowIndex -1);
				modelo.stTecnicasSeleccionAs.remove(recordSeleccionado);
				modelo.stTecnicasSeleccionAs.insert(rowIndex -1, recordAux);
				recordSeleccionado.set('orden', recordAnterior.get('orden'));
				recordAnterior.set('orden', ordenSelec);
				vista.gpTecnicasAsociadas.getSelectionModel().selectPrevious();				
			} else {
				var recordSiguiente = modelo.stTecnicasSeleccionAs.getAt(rowIndex + 1);				
				modelo.stTecnicasSeleccionAs.remove(recordSeleccionado);
				modelo.stTecnicasSeleccionAs.insert(rowIndex + 1, recordAux);
				recordSeleccionado.set('orden', recordSiguiente.get('orden'));
				recordSiguiente.set('orden', ordenSelec);
				vista.gpTecnicasAsociadas.getSelectionModel().selectNext();
			}
			modelo.stTecnicasSeleccionAs.commitChanges();
			vista.btnGuardarOrden.enable();
		}
		
		function guardarOrden()
		{
			var datast = modelo.stTecnicasSeleccionAs.getRange();
			var tecnicas = new Array();
			for(i = 0; i < datast.length; i++){	
				tecnicas.push(datast[i].data);
			}
			Ext.Ajax.request({
				url: 'actualizarOrden',
				params: {tecnicas: Ext.encode(tecnicas)},
				callback: function (){                                                    
				},
				success: function (r){
					var responseData = Ext.decode(r.responseText);
					if (responseData == true) {
						mostrarMensaje(1, idioma.lbCambiarOrdenTrue);
					}
					vista.btnGuardarOrden.disable();
				}
			});			
		}

        function comprobarValidezResultadoTecnica()
        {
            Ext.Ajax.request({
                url: 'comprobarValidezResultadoTecnica',
                params: {},
                callback: function (){},
                success: function (){}
            });
        }

        function adicionarResponsable()
        {
            var recPersona = vista.gpPersonas.getSelectionModel().getSelections();
            if (recPersona.length > 0) {
                var existe = new Array();
                Ext.each(recPersona, function (rec)
                {
                    var index = modelo.stResponsableTecnica.find('idcomisionpersona', rec.get('idcomisionpersona'));
                    if (index == -1) {
                        modelo.stResponsableTecnica.add(new Ext.data.Record({
                            'idprocesotecnica': 't-0',
                            'idcomisionpersona': rec.get('idcomisionpersona'),
                            'comision': rec.get('comision'),
                            'cargocomision': rec.get('cargocomision'),
                            'numid': rec.get('numid'),
                            'nombreyapellidos': rec.get('nombreyapellidos')
                        }));
                    } else {
                        existe.push(rec);
                    }
                }, this);
                if (existe.length > 0) {
                    if (recPersona.length == 1) {
                        mostrarMensaje(6, idioma.msgAddListPersona_ExisteSin);
                    } else {
                        mostrarMensaje(6, idioma.msgAddListPersona_ExistePlu);
                    }
                } else {
                    if (recPersona.length == 1) {
                        mostrarMensaje(1, idioma.msgAddListPersona_OKSin);
                    } else {
                        mostrarMensaje(1, idioma.msgAddListPersona_OKPlu);
                    }
                }
                vista.gpPersonas.getSelectionModel().clearSelections();
                vista.windaddPersona.hide();
            }  else  {
                mostrarMensaje(6,idioma.msgAddPers_noselec);
            }
        }

        function advertencia(mssg){
            mostrarMensaje(8, mssg);
        }

        var ctroll = 0;
		//Teclas calientes
		var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
			key: 'pkoxgltr',
			alt: true,
			ctrl: true,
			//stopEvent: true,
			handler: function(k, e) {
				switch(k) {
					case 80:{ //p para aplicar
                        if(!vista.btnAplicarAddTecnicaSelec.disabled){
                            guardarTecnicaProceso('APL');
                        } else if(!vista.btnAplicar.disabled){
							guardarDatos('APL');
						}
                        if (windSow == 1) {
                            if(vista.tabPanel.getActiveTab().id == 'gestseleccion' && !vista.tabPanel.getActiveTab().btnAplicarMod.disabled){
                                vista.tabPanel.getActiveTab().btnAplicarMod.handler();
                            }
                            if(vista.tabPanel.getActiveTab().iconCls == 'tecnica' && !vista.tabPanel.getActiveTab().btnAplicarTec.disabled){
                                vista.tabPanel.getActiveTab().btnAplicarTec.handler();
                            }
                        }
						break;
					}
                    case 75:{ //k para gest técnicas
                        if(!vista.btnTecnica.disabled && windSow == 0){
                            modelo.stTecnicasSeleccionAs.load({params:{idproceso: idp}});
                            vista.winGestionarTecnica.show();
                        }
                        ctroll = 1;
                        break;
                    }
                    case 79:{ //o para gest modelo
                        if(!vista.btnModelo.disabled && windSow == 0){
                            cargarModelos();
                        }
                        break;
                    }
                    case 88:{ //x para cerrar
                        if(!vista.btnCerrarTecnica.disabled && windAddTec == 0){
                            vista.winGestionarTecnica.hide();
                        }
                        break;
                    }
                    case 71:{ //g para gestionar
                        if(!vista.btnGestProceso.disabled){
                            vista.tpMenuSeleccion.getRootNode().reload();
                            vista.tpMenuSeleccion.getRootNode().expand();
                            vista.windSeleccionCandidatos.show();

                            var info = {denominacion:datosProc.denominacion, recurso: (datosProc.recurso)?datosProc.recurso:'No definido',
                                cargos: datosProc.cargos, fdesde: datosProc.fdesde, fhasta: (datosProc.fhasta)?datosProc.fhasta:'No definida'};

                            vista.plantillaInformacion.overwrite(vista.pDetallesProceso.body, info);
                            vista.windSeleccionCandidatos.maximize();
                        }
                        break;
                    }
                    case 76:{//l para excluir
                        if (windSow == 1) {
                            if(vista.tabPanel.getActiveTab().id == 'gestcandidatos' && !vista.tabPanel.getActiveTab().btnExcluir.disabled){
                                vista.tabPanel.getActiveTab().btnExcluir.handler();
                            }
                        }
                        break;
                    }
                    case 84:{//t para listar excluidos
                        if (windSow == 1) {
                            if(vista.tabPanel.getActiveTab().id == 'gestcandidatos' && !vista.tabPanel.getActiveTab().btnListExcluido.disabled){
                                vista.tabPanel.getActiveTab().btnListExcluido.handler();
                            }
                        }
                        break;
                    }
                    case 82:{//r para reincorporar excluido
                        if (windSow == 1) {
                            if(vista.tabPanel.getActiveTab().id == 'gestcandidatos' && !vista.tabPanel.getActiveTab().btnReincorporar.disabled){
                                vista.tabPanel.getActiveTab().btnReincorporar.handler();
                            }
                        }
                        break;
                    }
                }
			}
		},{
            key: 'imthblxkgzj',
            alt: true,
            //stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                        if(!vista.btnAdicionarresponsabletec.disabled && windAddTec == 1){
                            vista.windaddPersona.show();
                        } else if(!vista.btnAdicionarTecSel.disabled && windTec == 1){
                            vista.winAddTecnicaSelec.setTitle(idioma.lbAddTecnSel);
                            vista.btnAplicarAddTecnicaSelec.show();
                            vista.winAddTecnicaSelec.show();
                            accionTec = 'add';
                        } else if(!vista.btnAdicionar.disabled && windSow == 0){
                            vista.winAdicionarProceso.setTitle(idioma.lbwinAddProceso);
                            vista.btnAplicar.show();
                            vista.winAdicionarProceso.show();
                            limpiarFormulario();
                            self.accion = 'add';
                        }
                        if (windSow == 1) {
                            if(vista.tabPanel.getActiveTab().id == 'gestcandidatos' && !vista.tabPanel.getActiveTab().btnAddCandidato.disabled){
                                vista.tabPanel.getActiveTab().btnAddCandidato.handler();
                            }
                        }
                        break;
                    }
                    case 77:{ //m para modificar
                        if(!vista.btnModificarTecSel.disabled && windTec == 1){
                            pt = vista.gpTecnicasAsociadas.getSelectionModel().getSelected().data;
                            modelo.stResponsableTecnica.baseParams.idprocesotecnica = pt.idprocesotecnica;
                            modelo.stResponsableTecnica.load();
                            idplanilla = pt.idtecnica;
                            idmodelomat = pt.idmodelo;
                            vista.winAddTecnicaSelec.setTitle(idioma.lbModTecnSel);
                            vista.btnAplicarAddTecnicaSelec.hide();
                            vista.winAddTecnicaSelec.show();
                            vista.cbPlanillaEval.setValue(pt.planilla);
                            cargarModelosMatematicos(idplanilla);
                            vista.cbModeloMatematico.setValue(pt.modelomatematico);
                            vista.cbModeloMatematico.enable();
                            vista.diAddTecnicaSelec.setValue(pt.fdesde);
                            vista.dfAddTecnicaSelec.setValue(pt.fhasta);
                            if (pt.hito == 0) {
                                mostrarCamposHito(pt.idescala);
                                Ext.getCmp('eshito').collapse(true);
                                idvalor = -1;
                            } else {
                                Ext.getCmp('eshito').expand(true);
                                vista.cbCondiciones.setValue(pt.condicion);
                                idvalor = pt.valor;
                                if (!pt.idescala) {
                                    vista.nfValor.setValue(pt.valor);
                                }
                            }
                            accionTec = 'mod';
                        } else if(!vista.btnModificar.disabled && windSow == 0){
                            vista.fAddProceso.getForm().reset();
                            var s = vista.gpProcesosSeleccion.getSelectionModel().getSelected().data;
                            vista.tfdenominacion.setValue(s.denominacion);
                            vista.tfCantRec.setValue(s.recurso);
                            vista.dfInicio.setValue(s.fdesde);
                            vista.dfFin.setValue(s.fhasta);
                            cargarCargosSeleccionados();
                            vista.winAdicionarProceso.setTitle(idioma.lbwinModProceso);
                            vista.btnAplicar.hide();
                            vista.winAdicionarProceso.show();
                            self.accion = 'mod';
                        }
                        break;
                    }
                    case 84:{ //t para compartir
                        vista.windCompartir.show();
                        vista.gpEntidades.getSelectionModel().clearSelections();
                        modelo.stEntidades.load();
                        break;
                    }
                    case 72:{ //h para ayuda
                        var title = 'Ayuda de la funcionalidad';
                        var referencia = 'seleccion/gestionarprocesoseleccion';
                        help.show(title, referencia);
                        break;
                    }
                    case 66:{
                        if (!vista.btnBuscar.disabled && (vista.tfbuscar.getValue() != '' || vista.cbCargos.selectedIndex)) {
                            var cargo = null;
                            if (vista.cbCargos.getValue() != '') {
                                cargo = modelo.stCargos.getAt(vista.cbCargos.selectedIndex);
                            }

                            modelo.stProcesosSeleccion.load({ params:{
                                    denominacion: vista.tfbuscar.getValue(),
                                    cargo: (cargo != null)?Ext.encode(cargo.data):new Array(),
                                    start: 0,
                                    limit: 15
                                }
                            });
                            busc = 1;
                        }
                        break;
                    }
                    case 76:{ //l para limpiar
                        vista.tfbuscar.reset();
                        vista.cbCargos.reset();
                        modelo.stProcesosSeleccion.load({params: {start: 0, limit: 15}});
                        break;
                    }
                    case 88:{ //x para cancelar
                        if(windProc == 1){
                            limpiarFormulario();
                            vista.winAdicionarProceso.hide();
                        } else  if(windResp == 1){
                            vista.gpPersonas.getSelectionModel().clearSelections();
                            vista.windaddPersona.hide();
                        }else  if(windAddTec == 1){
                            limpiarFormularioTecnica();
                            vista.winAddTecnicaSelec.hide();
                        } else  if(windAsCom == 1){
                            vista.gpComite.getSelectionModel().clearSelections();
                            vista.winAsociarComite.hide();
                        }  else  if(vista.btnCancelarCompart.isVisible()){
                            vista.windCompartir.hide();
                        }
                        break;
                    }
                    case 75:{ //k para asociar comite
                        if(!vista.btnAsociar.disabled && windSow == 0 && ctroll == 0){
                            cargarComitesSeleccionados();
                            vista.winAsociarComite.show();
                        }
                        break;
                    }
                    case 71:{ //g para guardar
                        if(!vista.btnGuardarOrden.disabled && windTec == 1){
                            guardarOrden();
                        }
                        break;
                    }
                    case 90:{//z para desubicar
                        if (windSow == 1) {
                            if(vista.tabPanel.getActiveTab().id == 'gestseleccion' && !vista.tabPanel.getActiveTab().btnDesUbicar.disabled){
                                vista.tabPanel.getActiveTab().btnDesUbicar.handler();
                            }
                        }
                        break;
                    }
                    case 74:{//j para iniciar
                        if (windSow == 1) {
                            if(vista.tabPanel.getActiveTab().iconCls == 'tecnica' && !vista.tabPanel.getActiveTab().btnIniciarTec.disabled){
                                vista.tabPanel.getActiveTab().btnIniciarTec.handler();
                            }
                        }
                        break;
                    }
                }
            }
        },{
			key: 46,//del para eliminar
			fn: function(){
                if(!vista.btnEliminarTecSel.disabled && windTec == 1){
                    eliminarTecnicaProceso();
                }else if(!vista.btnEliminarresponsabletec.disabled && windAddTec == 1){
                    var recPersona = vista.gpResponsableTecnica.getSelectionModel().getSelections();
                    var mensaje = '';
                    if (recPersona.length == 1) {
                        mensaje = idioma.msgDelPer_confirmSin;
                    } else {
                        mensaje = idioma.msgDelPer_confirmPlu;
                    }
                    mostrarMensaje(2, mensaje, function (btn)
                    {
                        if (btn == 'ok') {
                            if (!Ext.isEmpty(recPersona) && Ext.isArray(recPersona)) {
                                Ext.each(recPersona, function (rec)
                                {
                                    modelo.stResponsableTecnica.remove(rec);
                                }, this);
                                if (recPersona.length == 1) {
                                    mostrarMensaje(1, 'El responsable ha sido eliminado satisfactoriamente');
                                } else {
                                    mostrarMensaje(1, 'Los responsables han sido eliminados satisfactoriamente');
                                }
                            }
                        }
                    }.createDelegate(this));
                }else if(!vista.tabPanel.getActiveTab().btnEliminarCandidato.disabled && windSow == 1){
                    vista.tabPanel.getActiveTab().btnEliminarCandidato.handler();
                }else if(!vista.btnEliminar.disabled){
				    eliminarProceso();
				}
			}
		},{
			key: 13,//enter para aceptar
			fn: function(){
				if(vista.btnAceptar.isVisible() && windProc == 1){
				   vista.btnAceptar.focus();
				   guardarDatos('ACP');
				}  else if (vista.btnAceptarAddPersona.isVisible() && windResp == 1) {
                   adicionarResponsable();
                } else if (vista.btnAceptarAddTecnicaSelec.isVisible() && windAddTec == 1) {
                    guardarTecnicaProceso('ACP');
                } else if (vista.btnAceptarComite.isVisible() && windAsCom == 1) {
                    guardarComitesProceso();
                } else if (vista.btnAceptarCompart.isVisible()) {
                    compartirProceso();
                }
			}
		}]);
    }
};
