Ext.ns('Pvd.Nomina.Pagos.Compartimentacion');

Pvd.Nomina.Pagos.Compartimentacion.Controlador = {
    init: function(idioma, vista, modelo) {

        var variables = {
            idcargo : null,
            accion: null,
            compartimentacion: null,
            idcategoria:null
        };   
        
         vista.pobjestructura.on('estructuraselecionada',function(sm, nodo){
            if(nodo.attributes.tipoestructura == 7){
                vista.btnAceptarCargo.enable();
                variables.idcargo = nodo.id;
            }else{
				vista.btnAceptarCargo.disable();
                variables.idcargo = null;
			}
        }.createDelegate(this));

        vista.btnAdicionar.setHandler(function(){
			vista.winEstructura.show();
			vista.btnAceptarCargo.setDisabled(true);
		});

		vista.btnEliminarCateg.setHandler(function(){
            if(vista.gpCompartimentacionCategorias.getSelectionModel().hasSelection()){
                
                mostrarMensaje(2, "Est&aacute; seguro que desea eliminar la categoría seleccionada?", function(boton){
                    if(boton == "ok"){
                        Ext.Ajax.request({
                            url:'DelCategoria',
                            method:'POST',
                            params: {
                                idcompartcargocategoria:vista.gpCompartimentacionCategorias.getSelectionModel().getSelected().data.idcompartcargocategoria
                            },
                            callback: function (options,success,response){
                                var respuesta = Ext.decode(response.responseText);
                                if(respuesta.codigo == 'DEL-1'){
                                   mostrarMensaje(1, 'La categoría se ha eliminado satisfactoriamente.');
                                    //modelo.stCompartimentacionCategorias.baseParams.idcargo = vista.gpCompartimentacionCargos.getSelectionModel().getSelected().data.idcargo;
                                    //modelo.stCompartimentacionCategorias.load();

                                }else {
                                    mostrarMensaje(3, 'El cargo seleccionado no se puede eliminar debido a que está en uso.');
                                }


                            }.createDelegate(this)
                        });


                    }
                }.createDelegate(this));
            }else{

            }
		});

        vista.btnAdicionarCateg.setHandler(function(){
			vista.winCategoria.show();
			vista.btnAceptarCategoria.setDisabled(true);
		});
        vista.btnCancelarcategoria.setHandler(function(){
            vista.winCategoria.hide();
        });


        vista.categoria.on('click', function (n, e) {
            vista.btnAceptarCategoria.enable();
            variables.idcategoria = n.id;

        });
        vista.selectionModel.on('rowselect', function (n, e) {
            vista.btnEliminarCateg.enable();
        });

        vista.btnAceptarCategoria.setHandler(function(){

           AdicionarCategoria(variables.idcategoria,variables.idcargo);
        });

        function AdicionarCategoria(idcategoria) {

            Ext.Ajax.request({
                url:'AddCategoria',
                method:'POST',
                params: {
                    idcategoria: idcategoria,
                    idcargo:vista.gpCompartimentacionCargos.getSelectionModel().getSelected().data.idcargo
                },
                callback: function (options,success,response){
                    var respuesta = Ext.decode(response.responseText);
                    if(respuesta.codigo == 'ADD-1'){
                        mostrarMensaje(1, 'La categoría se adicion&oacute; satisfactoriamente.');
                        vista.winCategoria.hide();
                        //modelo.stCompartimentacionCategorias.baseParams.idcargo = vista.gpCompartimentacionCargos.getSelectionModel().getSelected().data.idcargo;
                        //modelo.stCompartimentacionCategorias.load();

                    }else {
                        mostrarMensaje(3, 'La categoría ya existe');
                    }


                }.createDelegate(this)
            });
        }
        vista.btnEliminar.setHandler(function(){
			if(vista.gpCompartimentacionCargos.getSelectionModel().hasSelection()){
				mostrarMensaje(2, "Est&aacute; seguro que desea eliminar la compartimentaci&oacute;n del cargo seleccionado?", function(boton){
					if(boton == "ok"){
						variables.accion = 'DEL';
                         this.ADDDELCompartimentacionCargo(variables.accion, 1);


					}
				}.createDelegate(this));
			}else{

			}
		}.createDelegate(this));   
		 
        vista.btnCancelarCargo.setHandler(function(){
			vista.winEstructura.hide();
			variables.idcargo = null;
		});
		   
        vista.btnAceptarCargo.setHandler(function(){
			variables.accion = 'ADD';
			this.ADDDELCompartimentacionCargo(variables.accion, 1);
		}.createDelegate(this));   
		
        vista.btnGuardar.setHandler(function(){
			variables.accion = 'ADD';
			if(vista.gpCompartimentacionCargos.getSelectionModel().hasSelection()){
				this.ADDDELCompartimentacionCargo(variables.accion, 2);
			}else{
				mostrarMensaje(3, 'Debe seleccionar un cargo.');
			}
		}.createDelegate(this));   
		 
		 vista.gpCompartimentacionCargos.getSelectionModel().on('rowselect', function(sm, index, rec){
			variables.idcompartimentacionnomina = rec.data.idcompartimentacionnomina;
			modelo.stCompartimentacionTipoNomina.removeAll();
			modelo.stCompartimentacionTipoNomina.baseParams.idcompartimentacionnomina = rec.data.idcompartimentacionnomina;
			modelo.stCompartimentacionTipoNomina.load();
            //modelo.stCompartimentacionCategorias.removeAll();
			//modelo.stCompartimentacionCategorias.baseParams.idcargo = rec.data.idcargo;
			//modelo.stCompartimentacionCategorias.load();
            vista.btnAdicionarCateg.enable();
		});
		 
        this.ADDDELCompartimentacionCargo = function(accion, tipo){
			var url = '';
			if(accion == 'ADD'){
				url = 'guardarcompartimentacion';
			}else if(accion == 'DEL'){
				url = 'eliminarcompartimentacion';
			}
			
			if(tipo == 2){
				var m = modelo.stCompartimentacionTipoNomina.getModifiedRecords();
				variables.compartimentacion = (m.length > 0 ? new Array() : null);
				for(var i = 0; i < m.length; i++){
					variables.compartimentacion.push(m[i].data);
				}
			}else{
				variables.compartimentacion = null;
			}
			
			Ext.Ajax.request({
				url: url,
				method:'POST',
				params: {
					 idcompartimentacionnomina: variables.idcompartimentacionnomina,
					 idcargo: variables.idcargo,
					 tipo: tipo,
					 compartimentacion: Ext.encode(variables.compartimentacion)
				},
				callback: function (options,success,response){
					var respuesta = Ext.decode(response.responseText);
					if(respuesta.codigo == 'ADD-1'){
						mostrarMensaje(1, 'La compartimentaci&oacute;n se adicion&oacute; satisfactoriamente.');
						
					}else if(respuesta.codigo == 'DEL-1'){
						mostrarMensaje(1, 'La compartimentaci&oacute;n se elimin&oacute; satisfactoriamente.');
					} else if(respuesta.codigo == 'DEL-2'){
                        mostrarMensaje(3, 'El cargo seleccionado no se puede eliminar debido a que está en uso. ');
                    }
					 if(tipo == 1){
						vista.winEstructura.hide();
						modelo.stCompartimentacionCargos.removeAll();
						modelo.stCompartimentacionCargos.load();
					}else{
						modelo.stCompartimentacionTipoNomina.removeAll();
						modelo.stCompartimentacionTipoNomina.load();
						modelo.stCompartimentacionTipoNomina.commitChanges();
					}	
				}.createDelegate(this)
			});
		}

		modelo.stCompartimentacionCargos.load();
	}
}
