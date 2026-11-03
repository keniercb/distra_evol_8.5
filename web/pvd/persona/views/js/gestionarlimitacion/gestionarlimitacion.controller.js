Ext.ns('Ext.component.persona');                                                                                                                                                               
Ext.component.persona.Controlador={
	init: function(perfil,idioma, vista, modelo) {
		var accion = 'add';
		var objselect, idpersona, idsituacionlaboralp;
		vista.btnAdicionar.focus();
		modelo.store.load({params:{limit: 15, start: 0}});
		modelo.stPersonas.load({params:{limit: 15, start: 0}});
		/*----------  Trabajo en el formulario  ----------*/
		//Cerrar formulario
		vista.btnCancelar.on('click', function() {
			vista.winAdicionar.hide();
		});

		vista.btnAdicionar.on('click', function(){
			vista.gpPersonas.enable();
			vista.gpPersonas.focus(true, 500);
			vista.winAdicionar.setTitle('Adicionar limitaci&oacute;n');
			vista.winAdicionar.show();
			vista.btnAplicar.show();
			vista.fpDatos.getForm().reset();
			accion = 'add';
		});

		vista.winAdicionar.on('hide', function() {
			vista.gpPersonas.getSelectionModel().clearSelections();
		});

		vista.btnModificar.on('click', function(){
			vista.gpPersonas.disable();
			vista.cbCausa.focus(true, 500);
			vista.winAdicionar.setTitle('Modificar limitaci&oacute;n');
			vista.winAdicionar.show();
			vista.btnAplicar.hide();
			vista.cbCausa.setValue(objselect.idcausa);
			vista.cbCausa.setRawValue(objselect.causa);
			vista.dfDesde.setValue(objselect.fdesde);
			vista.dfHasta.setValue(objselect.fhasta);
			idpersona = objselect.idpersona;
			idsituacionlaboralp = objselect.idsituacionlaboralp;
			accion = 'mod';
		});

		vista.btnCancelar.on('click', function(){
			vista.fpDatos.getForm().reset();
			vista.winAdicionar.hide();
		});

		vista.gpLimitados.getSelectionModel().on('rowselect', function (n) {
			objselect = n.getSelected().data;
			vista.btnModificar.enable();
			vista.btnRemove.enable();
		}, this);

		vista.gpLimitados.getSelectionModel().on('rowdeselect', function () {
			vista.btnModificar.disable();
			vista.btnRemove.disable();
		}, this);

		vista.gpPersonas.getSelectionModel().on('rowselect', function (n) {
			idpersona = n.getSelected().data.idpersona;
			idsituacionlaboralp = n.getSelected().data.idsituacionlaboralp;
			vista.btnModificar.enable();
			vista.btnRemove.enable();
		}, this);

		modelo.store.on('load', function () {
			objselect = null;
			vista.btnModificar.disable();
			vista.btnRemove.disable();
		}, this);

		vista.btnRemove.on('click', function (){
			eliminar();
		});
		vista.btnExportar.on('click', function (){
			exportar();
		});

		vista.btnAceptar.on('click', function (){
			guardarDatos('ACP');
		});

		vista.btnAplicar.on('click', function (){
			guardarDatos('APL');
		});

		vista.btnAyuda.on('click', function (){
			var title = 'Ayuda de gestionar limitaci�n';
			var referencia = '';
			help.show(title, referencia);
		});

		function guardarDatos(btnpress)
		{
			if (idpersona) {
				if(vista.fpDatos.getForm().isValid()){
					var idpadre = null;
					if (accion == 'add' && objselect) {
						idpadre = objselect.idlimitacion;
					}
					Ext.Ajax.request({
						url: (accion == 'add' ? 'addLimitacion' : 'updateLimitacion'),
						params: {
							idlimitacion: accion == 'add' ? -1 : objselect.idlimitacion,
							idpersona: idpersona,
							idcausa: vista.cbCausa.getValue(),
							fdesde: vista.dfDesde.getRawValue(),
							fhasta: vista.dfHasta.getRawValue(),
							idsituacionlaboralp: idsituacionlaboralp
						},
						success: function (r){
							var responseData = Ext.decode(r.responseText);
							if (responseData != false) {
								if(accion == 'mod')
								{
									mostrarMensaje(1, 'La limitaci&oacute;n ha sido modificada satisfactoriamente.');
								}else{
									mostrarMensaje(1, 'La limitaci&oacute;n ha sido adicionada satisfactoriamente.');
								}
								if (btnpress == 'ACP')
								{
									vista.winAdicionar.hide();
								}
								vista.fpDatos.getForm().reset();
								vista.gpPersonas.getSelectionModel().clearSelections();
								modelo.store.removeAll();
								modelo.store.reload();
							} else
								mostrarMensaje(3,'Ocurri� un error mientras se guardaban los datos.');

						}
					});
				}
			} else {
				mostrarMensaje(3,'Debe seleccionar a la persona que desea limitar.');
			}
		}

		function eliminar()
		{
			var limitaciones = new Array();
			var s = vista.gpLimitados.getSelectionModel().getSelections();
            for (i = 0; i < s.length; i++) {
                limitaciones.push(s[i].data.idlimitacion);
            }
            var mensaje = idioma.lbTitMsgSeguroEliminar;
            if (s.length > 1) {
                mensaje = '¿Está seguro que quiere eliminar las limitaciones seleccionadas?';
            }
			mostrarMensaje(2, mensaje, function (btnPresionado){
				if (btnPresionado == 'ok') {
					Ext.getBody().mask('Eliminando datos...');
					Ext.Ajax.request({
						url: 'deleteLimitacion',
						params: {limitaciones: Ext.encode(limitaciones)},
						callback: function (){
							Ext.getBody().unmask();
						},
						success: function (r){
							var responseData = Ext.decode(r.responseText);
							if(responseData == false)
								mostrarMensaje(3, 'La limitaci&oacute;n seleccionada no puede ser eliminada debido a que se encuentra en uso');
							else {
                                if (limitaciones.length > 1) {
                                    mostrarMensaje(1, 'Las limitaciones han sido eliminadas satisfactoriamente.');
                                } else {
                                    mostrarMensaje(1, 'La limitación ha sido eliminada satisfactoriamente.');
                                }
							}
							modelo.store.removeAll();
							modelo.store.reload();
						}
					});
				}
			});
		}
		function exportar()
		{

			var me=this;

			//if (type == 'pdf') {
				var params = Ext.urlEncode({
					destino: 'I',
					//idpersona: this.getSelection()[0].get('idpersona')
				});
				var idIframeResolucion = Ext.id();
				var w = new Ext.Window({
					title: 'Reporte: ' + name,
					width: 800,
					height: 500,
					maskDisabled: false,
					animCollapse: false,
					maximizable: true,
					constrainHeader: true,
					border: false,
					items: {
						xtype: 'component',
						autoEl: {
							tag: 'iframe',
							id: idIframeResolucion,
							style: 'height: 100%; width: 100%; border: none',
							src: document.location.protocol + '//' + document.location.host +
							'/pvd/persona/index.php/gestionarlimitacion/exportarLimitaciones' + '?' + params
						}
					}
				});
				w.show();
				w.maximize();
				PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando vista previa del reporte.');
				document.getElementById(idIframeResolucion).onload = function () {
					PVD.ocultarMascara('rep01');
				};

		}

		//Manipulador de HotKeys
		var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
			key: 'imlhbx',
			alt: true,
			stopEvent: true,
			handler: function(k, e) {
				switch(k) {
					case 73:{ //i para adicionar
						if(!vista.btnAdicionar.disabled){
							vista.gpPersonas.enable();
							vista.gpPersonas.focus(true, 500);
							vista.winAdicionar.setTitle('Adicionar limitaci&oacute;n');
							vista.winAdicionar.show();
							vista.btnAplicar.show();
							vista.fpDatos.getForm().reset();
							accion = 'add';
						}
						break;
					}
					case 77:{ //m para modificar
						if(!vista.btnModificar.disabled){
							vista.gpPersonas.disable();
							vista.cbCausa.focus(true, 500);
							vista.winAdicionar.setTitle('Modificar limitaci&oacute;n');
							vista.winAdicionar.show();
							vista.btnAplicar.hide();
							vista.cbCausa.setValue(objselect.idcausa);
							vista.cbCausa.setRawValue(objselect.causa);
							vista.dfDesde.setValue(objselect.fdesde);
							vista.dfHasta.setValue(objselect.fhasta);
							idpersona = objselect.idpersona;
							idsituacionlaboralp = objselect.idsituacionlaboralp;
							accion = 'mod';
							accion = 'mod';
						}
						break;
					}
					case 76:{ //l para limpiar
						/*if (!vista.btnLimpiar.disabled) {
							
						}
						break;*/
					}
					case 72:{ //h para ayuda
						var title = 'Ayuda del nomenclador gestionar limitaci&oacute;n';
						var referencia = '';
						help.show(title, referencia);
						break;
					}
					case 66:{ //b para buscar
						/*if () {
							
						}
						break;*/
					}
					case 88:{ //x para cancelar
						if(!vista.btnCancelar.disabled){
							vista.fpDatos.getForm().reset();
							vista.winAdicionar.hide();
						}
						break;
					}

				}
			}
		},{
			key: 46,//del para eliminar
			fn: function(){
				if(!vista.btnRemove.disabled){
					eliminar();
				}
			}
		},{
			key: 13,//enter para aceptar
			fn: function(){
				if(vista.btnAceptar.isVisible()){
					vista.btnAceptar.focus();
					guardarDatos('ACP');
				}
			}
		},{
			key: 80,//p para aplicar
			alt: true,
			ctrl: true,
			fn: function(){
				if(vista.btnAplicar.isVisible()){
					guardarDatos('APL');
				}
			}
		}]);
	}
};