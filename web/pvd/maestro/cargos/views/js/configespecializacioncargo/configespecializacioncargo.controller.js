Ext.ns('PVD.Persona.ConfigEspecializacionCargo');
//Controlador de la vista del componente
PVD.Persona.ConfigEspecializacionCargo.Controlador = {

    init: function (idioma, vista, modelo) {
		this.accion = 'add';
        var busc = 0;
		modelo.stCargos.load({params:{limit: 15, start: 0}});
		modelo.stCargos.on('load', function (st) {
			vista.btnAdd.disable();
			vista.btnMod.disable();
			vista.btnDel.disable();
            if (busc == 1 && st.getCount()==0) {
                mostrarMensaje(1, idioma.lbNoDatosBusc);
                busc = 0;
            } else if (st.getCount()==0) {
                mostrarMensaje(1, idioma.lbNoDatos);
            }
		}); 		
		
		modelo.stHomologacionesCargos.on('load', function () {
			vista.btnMod.disable();
			vista.btnDel.disable();
		}); 
		
		vista.gpCargos.getSelectionModel().on('rowselect', function () {
			vista.btnAdd.enable();
			modelo.stHomologacionesCargos.baseParams = {idcargo: vista.gpCargos.getSelectionModel().getSelected().data.idcargo};
			modelo.stHomologacionesCargos.load({params:{limit: 15, start: 0}});
        }, this);
		
		vista.gpHomologaciones.getSelectionModel().on('rowselect', function () {
			vista.btnMod.enable();
			vista.btnDel.enable();
        }, this);
		
		vista.btnAyuda.on('click', function () {
            var title = 'Ayuda de Configurar especializaci&oacute;n cargo';
            var referencia = '';
            help.show(title, referencia);
        });
				
		vista.btnAdd.on('click', function () {	
			vista.winGestionar.setTitle('Adicionar especializaci&oacute;n a cargo');
            vista.winGestionar.show();
			self.accion = 'add';
        }); 
		
		vista.btnMod.on('click', function () {	
			vista.winGestionar.setTitle('Modificar especializaci&oacute;n a cargo');
			vista.tfDenominacion.setValue(vista.gpHomologaciones.getSelectionModel().getSelected().data.denominacion);
            vista.winGestionar.show();
			vista.btnAplicar.hide();
			self.accion = 'mod';
        }); 

		vista.btnCancelar.on('click', function () {
			vista.fpDatos.getForm().reset();
            vista.winGestionar.hide();
        });	
				
		vista.btnAceptar.on('click', function () {
			guardarDatos('ACP');
        });	
		
		vista.btnAplicar.on('click', function () {
			guardarDatos('APL');
        });

		vista.btnDel.on('click', function () {
            eliminar(); 
        });

        vista.btnBuscar.on('click', function () {
            modelo.stCargos.load({params:{limit: 15, start: 0, filtro: vista.tfBuscar.getValue()}});
            busc = 1;
        });

        vista.btnLimpiar.on('click', function () {
            vista.tfBuscar.reset();
            modelo.stCargos.load({params:{limit: 15, start: 0}});
        });
		
		function guardarDatos(btnpress)
		{
			Ext.Ajax.request({
				url: (self.accion == 'add' ? 'addHomologacion' : 'updateHomologacion'),				
				params: {
					idespcargo: self.accion == 'add' ? -1 :vista.gpHomologaciones.getSelectionModel().getSelected().data.idespcargo,
					idcargo: vista.gpCargos.getSelectionModel().getSelected().data.idcargo,
					denominacion: vista.tfDenominacion.getValue()
				},
				success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    if(responseData == false)
                        mostrarMensaje(3, 'La especializaci&oacute;n ya existe para dicho cargo.');
                    else{
                        var texaccion = '';
                        if (self.accion == 'add') {
                            texaccion = ' adicionada ';
                        }  else {
                            texaccion = ' modificada ';
                        }
                        mostrarMensaje(1, 'La especializaci&oacute;n ha sido' + texaccion + 'satisfactoriamente.');
                        if (btnpress == 'ACP') {
                            vista.winGestionar.hide();
                        }
                        vista.gpHomologaciones.getSelectionModel().clearSelections();
                        modelo.stHomologacionesCargos.reload();
                    }
					vista.fpDatos.getForm().reset();
				}
			});
		}
        
        function eliminar() 
        {
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar la especializaci&oacute;n seleccionada?', function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando...');
                    Ext.Ajax.request({
                        url: 'deleteHomologacion',
                        params: {idespcargo: vista.gpHomologaciones.getSelectionModel().getSelected().data.idespcargo},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false)
                                mostrarMensaje(3, 'La especializaci&oacute;n seleccionada no puede ser eliminada porque se encuentra en uso.');
                            else{
                                mostrarMensaje(1, 'La especializaci&oacute;n ha sido eliminada satisfactoriamente');
                            }
                            modelo.stHomologacionesCargos.reload();
                        }
                    });
                }
            });
        }

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 46,//del para eliminar
                fn: function(){
                    if(!vista.btnDel.disabled){
                        eliminar();
                    }
                }
            },{
                key: 'i',
                alt: true,
                fn: function () {
                    if (!vista.btnAdd.disabled) {
                        vista.winGestionar.setTitle('Adicionar especializaci&oacute;n a cargo');
                        vista.winGestionar.show();
                        self.accion = 'add';
                    }
                }
            },{
                key: 'm',
                alt: true,
                fn: function () {
                    if (!vista.btnMod.disabled) {
                        vista.winGestionar.setTitle('Modificar especializaci&oacute;n a cargo');
                        vista.tfDenominacion.setValue(vista.gpHomologaciones.getSelectionModel().getSelected().data.denominacion);
                        vista.winGestionar.show();
                        vista.btnAplicar.hide();
                        self.accion = 'mod';
                    }
                }
            },{
                key: 'l',
                alt: true,
                fn: function () {
                    if (!vista.btnLimpiar.disabled) {
                        vista.tfBuscar.reset();
                        modelo.stCargos.load({params:{limit: 15, start: 0}});
                    }
                }
            },{
                key: 'b',
                alt: true,
                fn: function () {
                    if (!vista.btnBuscar.disabled) {
                        modelo.stCargos.load({params:{limit: 15, start: 0, filtro: vista.tfBuscar.getValue()}});
                        busc = 1;
                    }
                }
            },{
                key: 'x',
                alt: true,
                fn: function () {
                    if (!vista.btnCancelar.disabled) {
                        vista.fpDatos.getForm().reset();
                        vista.winGestionar.hide();
                    }
                }
            },
            {
                key: 'p',
                alt: true,
                ctrl: true,
                fn: function () {
                    if (!vista.btnAplicar.disabled) {
                        guardarDatos('APL');
                    }
                }
            },
            {
                key: 13,
                //stopEvent: true,
                fn: function () {
                    if (!vista.btnAceptar.disabled) {
                        guardarDatos('ACP');
                    }
                }
            }
        ]);
    }
};