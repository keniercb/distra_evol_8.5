Ext.ns('PVD.Persona.FuncionCargo');
//Controlador de la vista del componente
PVD.Persona.FuncionCargo.Controlador = {

    init: function (idioma, vista, modelo) {
		this.accion = 'add';
        var busc = 0;
		
		modelo.stFuncionCargos.on('load', function () {
			vista.btnMod.disable();
			vista.btnDel.disable();
		});


        vista.tpEstructura.tree.on('click', function (n) {
            vista.btnAdd.enable();

        var arreglo=[];
        var nodos=[];
            arreglo=n.getPath();
            nodos=arreglo.split('/');
            modelo.stFuncionCargos.baseParams = {idestructura: n.id, nodos:Ext.encode(nodos)};
            modelo.stFuncionCargos.load({params:{limit: 15, start: 0}});
        }, this);

		
		vista.gpFuncioncargo.getSelectionModel().on('rowselect', function () {
			vista.btnMod.enable();
			vista.btnDel.enable();
        }, this);
		
		vista.btnAyuda.on('click', function () {
            var title = 'Ayuda de Configurar Funci&oacute;n';
            var referencia = '';
            help.show(title, referencia);
        });
				
		vista.btnAdd.on('click', function () {	
			vista.winGest.setTitle('Adicionar Funci&oacute;n');
            vista.tfDenominacion.reset();
            vista.winGest.show();
			self.accion = 'add';
        }); 
		
		vista.btnMod.on('click', function () {	
			vista.winGest.setTitle('Modificar Funci&oacute;n');
			vista.tfDenominacion.setValue(vista.gpFuncioncargo.getSelectionModel().getSelected().data.denominacion);
            vista.winGest.show();
			vista.btnAplicar.hide();
			self.accion = 'mod';
        }); 

		vista.btnCancelar.on('click', function () {
			vista.fpDatos.getForm().reset();
            vista.winGest.hide();
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






		function guardarDatos(btnpress)
		{
            var especifica=0;
            if(vista.tpEstructura.tree.nodo.attributes.idconcepto==7 || vista.tpEstructura.tree.nodo.attributes.idconcepto==10){
                especifica=1;
            }
			Ext.Ajax.request({
				url: (self.accion == 'add' ? 'addFuncioncargo' : 'updateFuncioncargo'),
				params: {
					idfunccargo: self.accion == 'add' ? -1 : vista.gpFuncioncargo.getSelectionModel().getSelected().data.idfunccargo,
					idestructura: vista.tpEstructura.tree.nodo.attributes.id,
					idpadre: vista.tpEstructura.tree.nodo.attributes._parent,
					denominacion: vista.tfDenominacion.getValue(),
                    especifica:especifica
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
                            vista.winGest.hide();
                        }
                        vista.gpFuncioncargo.getSelectionModel().clearSelections();
                        modelo.stFuncionCargos.reload();
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
                        url: 'deleteFuncioncargo',
                        params: {idfunccargo: vista.gpFuncioncargo.getSelectionModel().getSelected().data.idfunccargo},
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
                            modelo.stFuncionCargos.reload();
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
                        vista.winGest.setTitle('Adicionar especializaci&oacute;n a cargo');
                        vista.winGest.show();
                        self.accion = 'add';
                    }
                }
            },{
                key: 'm',
                alt: true,
                fn: function () {
                    if (!vista.btnMod.disabled) {
                        vista.winGest.setTitle('Modificar especializaci&oacute;n a cargo');
                        vista.tfDenominacion.setValue(vista.gpFuncioncargo.getSelectionModel().getSelected().data.denominacion);
                        vista.winGest.show();
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
                        vista.winGest.hide();
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