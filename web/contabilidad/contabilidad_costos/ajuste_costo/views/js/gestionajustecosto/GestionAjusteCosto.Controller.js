Ext.ns('Costo.Procesos.Asociacion.Cuenta');
Costo.Procesos.Asociacion.Cuenta.Controller = {
    init : function(perfil,etiquetas,view,model){
        var scope = this;
		
		//teclas calientes
        document.onkeyup = function(e) {
            function isValid(e){
                if(e.altKey){
                    return 'alt';
                }else if(e.ctrlKey){
					return 'ctrl';
				}
                else{
                    return 'bad';
                }
            }
            if(e.which == Ext.EventObject.I){
                //Adicionar
                if(isValid(e) == 'alt' && !view.btnAdicionar.disabled){
                    scope.btnAdicionarAction();
                }
            }
            if(e.which == Ext.EventObject.M){
                //Modificar
                if(isValid(e) == 'alt' && !view.btnModificar.disabled){
                    scope.btnModificarAction();
                }
            }
            if(e.which == Ext.EventObject.DELETE && !view.btnEliminar.disabled){
                //Eliminar
				if(view.sm.hasSelection())
					scope.eliminarAjuste();
            }
            /*if(e.which == Ext.EventObject.H){
                //Ayuda
                if(isValid(e) == 'alt'){
                    scope.EventosAyuda();
                }
            }*/
            if(e.which == Ext.EventObject.E){
                //Ejecutar secuencia
                if(isValid(e) == 'alt' && !view.btnEjecutar.disabled){
                   scope.btnEjecutarAction();
                }
            }
			if(e.which == Ext.EventObject.B){
                //Buscar
                if(isValid(e) == 'ctrl'){
                   scope.btnBuscarAction();
                }
            }
        }
        
		/* EVENTOS SELECTIONS MODEL */
        view.sm.on({
            rowselect: function(smodel, rowIndex, record){
                view.btnModificar.enable();
                if(record.data.estado == 0){ // si no esta ejecutada
                    view.btnAbrir.enable();
                    view.btnEliminar.enable();
                    view.btnEjecutar.enable();
                }else{
                    view.btnEjecutar.disable();
                    view.btnEliminar.disable();
                }             
            },
            rowdeselect : function(smodel, rowIndex, record){              
                view.btnModificar.disable();
                view.btnEliminar.disable();
                view.btnEjecutar.disable();
            }
        });  
		
		model.storeAjustes.on({
            beforeload: function(store, options) {
                view.btnModificar.disable();
				view.btnEliminar.disable();
				view.btnEjecutar.disable();
            }
        });
		
		/** BOTONES **/
        view.btnAdicionar.on('click', function(){
            scope.btnAdicionarAction()
        })
        view.btnModificar.on('click', function(){
			scope.btnModificarAction();
        })
        view.btnBuscar.on('click', function() {
            scope.btnBuscarAction();
        });
        view.btnEliminar.on('click', function() {
            scope.eliminarAjuste();
        });
        view.btnEjecutar.on('click', function() {
            scope.btnEjecutarAction();
        });
		
		/*** ACCIONES DE LOS BOTONES ***/
		this.btnAdicionarAction = function(){
			view.CrearWindw(perfil,model,1);
            view.winGestionar.show();
			scope.eventosWindowsAdd();
		}
		this.btnModificarAction = function(){
			view.CrearWindw(perfil,model);
            view.winGestionar.show();
			
            // esto aki hay que terminarlo
            view.btnCancelar.on('click', function(){
                view.winGestionar.close();
            });
		}
		this.btnBuscarAction = function(){
			view.createWindowsSearch(model);
            view.ventanaSearch.show();
            eventosWindowsSearch();
		}
		this.btnEjecutarAction = function(){
			if(view.sm.hasSelection()){
                var ajusteSelected =  view.sm.getSelected();
                var parametros = {
                    numero : ajusteSelected.json.numero,
                    descripcion : ajusteSelected.json.descripcion,
                    idcentroelemento : ajusteSelected.json.idcentro,
                    idcuentaproceso : ajusteSelected.json.idcuentaproceso,
                    idcuentaprodterminada : ajusteSelected.json.idcuentaprodterminada,
                    idestructura : ajusteSelected.json.idestructuracomun
                };
                scope.ejecutarAjuste(parametros,true);
            }else{
                mostrarMensaje(1,etiquetas.msgNotElementosSelected);
            }
		}
		
		this.eventosWindowsAdd = function(){
			/*********************CENTRO DE COSTO************************/      
            view.cbCentroCosto.on({
                expand : function(combo){
                    view.gridCentros.setHeight(300);
                    // view.sfBuscarCentro.setWidth(view.cbCentroCosto.getSize().width - 6)
                    if(!view.gridCentros.rendered)
                    {
                        view.gridCentros.render('centros');
                    }
                }
            });
            
            view.smCentros.on({
                rowselect  : function(selectionModel,rowIndex,record){
                    view.cbCentroCosto.setValue(record.data.descripcion);
                    view.cbCentroCosto.collapse();
                    view.cbCPproceso.enable();
                    view.cbCPterminada.enable();
                    view.cbCPvendida.enable();
                    //                    view.cbCPproceso.clearValue();
                    //                    view.cbCPterminada.clearValue();
                    //                    view.cbCPvendida.clearValue();
                    model.storeCuentasProceso.load();
                    model.storeCuentasTerminada.load();
                    model.storeCuentasVendida.load();
                }
            });
           
            /********************CUENTA PROCESO**********************/
            view.cbCPproceso.on({
                expand : function(combo){
                    view.gridCuentasProceso.setHeight(200);
                    // view.sfBuscarCuentasProceso.setWidth(view.cbCPproceso.getSize().width - 6)
                    view.gridCuentasProceso.render('cuentasproceso');
                }
            });
            view.smCuentasProceso.on({
                rowselect  : function(selectionModel,rowIndex,record){
                    view.cbCPproceso.setValue(record.data.descripcion);
                    view.cbCPproceso.collapse();
                }
            });
            
            model.storeCuentasProceso.on({
                beforeload : function(store,options){
                    var idCentroNivel = view.smCentros.getSelected().data.idcentrogrupo;
                    this.baseParams.idCentroNivel = idCentroNivel;
                },
                load : function(store, records, options){
                    this.baseParams = {};
                }
            })
            /********************CUENTA TERMINADA**********************/
            view.cbCPterminada.on({
                expand : function(combo){
                    view.gridCuentasTerminada.setHeight(150);
                    // view.sfBuscarCuentasTerminada.setWidth(view.cbCPterminada.getSize().width - 6)
                    if(!view.gridCuentasTerminada.rendered)
                    {
                        view.gridCuentasTerminada.render('cuentasterminada');
                    }
                }
            });
            view.smCuentasTerminada.on({
                rowselect  : function(selectionModel,rowIndex,record){
                    view.cbCPterminada.setValue(record.data.descripcion);
                    view.cbCPterminada.collapse();
                }
            });
            
            model.storeCuentasTerminada.on({
                beforeload : function(store,options){
                    var idCentroNivel = view.smCentros.getSelected().data.idcentrogrupo;
                    this.baseParams.idCentroNivel = idCentroNivel;
                },
                load : function(store, records, options){
                    this.baseParams = {};
                }
            })
            
            /********************CUENTA VENDIDA**********************/
            view.cbCPvendida.on({
                expand : function(combo){
                    view.gridCuentasVendida.setHeight(150);
                    // view.sfBuscarCuentasVendida.setWidth(view.cbCPvendida.getSize().width - 6)
                    if(!view.gridCuentasVendida.rendered)
                    {
                        view.gridCuentasVendida.render('cuentavendida');
                    }
                }
            });
            view.smCuentasVendida.on({
                rowselect  : function(selectionModel,rowIndex,record){
                    view.cbCPvendida.setValue(record.data.descripcion);
                    view.cbCPvendida.collapse();
                }
            });
            
            model.storeCuentasVendida.on({
                beforeload : function(store,options){
                    var idCentroNivel = view.smCentros.getSelected().data.idcentrogrupo;
                    this.baseParams.idCentroNivel = idCentroNivel;
                },
                load : function(store, records, options){
                    this.baseParams = {};
                }
            })
        
        
            function limpiarDatos(){
                view.cbCPproceso.clearValue();
                view.cbCPterminada.clearValue();
                view.cbCPvendida.clearValue();
            }
            /********************DATOS DE LAS CUENTAS**********************/
            view.tfImporteProceso.on({
                blur  : function(){
                    if(!Ext.isEmpty(view.tfImporteProceso.getValue()) && !Ext.isEmpty(view.tfEquivalenteProceso.getValue())){
                        var diferencia = view.tfImporteProceso.getValue() - view.tfEquivalenteProceso.getValue();
                        view.tfDiferenciaProceso.setValue(diferencia);
                    }
                }
            });
            
            view.tfEquivalenteProceso.on({
                blur  : function(){
                    if(!Ext.isEmpty(view.tfImporteProceso.getValue()) && !Ext.isEmpty(view.tfEquivalenteProceso.getValue())){
                        var diferencia = view.tfImporteProceso.getValue() - view.tfEquivalenteProceso.getValue();
                        view.tfDiferenciaProceso.setValue(diferencia);
                    }
                }
            });
            
            view.tfImporteTerminada.on({
                blur  : function(){
                    if(!Ext.isEmpty(view.tfImporteTerminada.getValue()) && !Ext.isEmpty(view.tfEquivalenteTerminada.getValue())){
                        var diferencia = view.tfImporteTerminada.getValue() - view.tfEquivalenteTerminada.getValue();
                        view.tfDiferenciaTerminada.setValue(diferencia);
                    }
                }
            });
            
            view.tfEquivalenteTerminada.on({
                blur  : function(){
                    if(!Ext.isEmpty(view.tfImporteTerminada.getValue()) && !Ext.isEmpty(view.tfEquivalenteTerminada.getValue())){
                        var diferencia = view.tfImporteTerminada.getValue() - view.tfEquivalenteTerminada.getValue();
                        view.tfDiferenciaTerminada.setValue(diferencia);
                    }
                }
            });
            
            view.btnAceptar.on('click', function(){
                eventoAdicionar(0);
            });
            view.btnAplicar.on('click', function() {
                eventoAdicionar(1);
            });
            view.btnEjecutar.on('click', function() {
                Ext.Msg.confirm(etiquetas.titleConfirm,etiquetas.msgEjecutarAjusteAdd,function(btnPress){
                    if(btnPress === 'yes'){
                        eventoAdicionar(2);
                    }
                });
            });
            view.btnCancelar.on('click', function(){
                view.winGestionar.close();
            });
		}
		
        function eventoAdicionar(tipo){
            if(view.tfNumero.getValue()!='' && view.txaDescripcion.getValue()!='' && view.cbCentroCosto.getValue()!=''
                && view.cbCPproceso.getValue()!='' && view.cbCPterminada.getValue()!=''){
				var parametros = {
                    numero : view.tfNumero.getValue(),
                    descripcion : view.txaDescripcion.getValue(), 
                    idcentroelemento : view.smCentros.getSelected().data.idcentrogrupo,
                    idcuentaproceso : view.smCuentasProceso.getSelected().data.idcuenta,
                    idcuentaprodterminada : view.smCuentasTerminada.getSelected().data.idcuenta
                }
                scope.loadMask(etiquetas.msgWait);
                Ext.Ajax.request({
                    method : "POST",
                    url : 'adicionarAjuste',
                    params : parametros,
                    callback : function(options, success, response)
                    {
                        if(!response.responseText){
                            mostrarMensaje(1,etiquetas.msgDefaultError);
                        }else{
                            var responseData = Ext.decode(response.responseText);
                            switch(responseData.code)
                            {
                                case 1:
                                    scope.mask.hide();
                                    mostrarMensaje(1,etiquetas.msgSingleAddSuccess)
                                    if(tipo == 0){
                                        view.winGestionar.close()
                                    }else if(tipo==1){
                                        scope.limpiarForm();
                                    }else{
                                        scope.ejecutarAjuste(parametros)
                                    }
                                    model.storeAjustes.reload();                   
                                    break;
                                case 2:
                                    scope.mask.hide();
                                    mostrarMensaje(1,etiquetas.msgDefaultError);
                                    break;
                                case 3:
                                    scope.mask.hide();
                                    mostrarMensaje(1,etiquetas.msgSingleAsocFailed);
                                    break;
                                case 4:
                                    scope.mask.hide();
                                    mostrarMensaje(1,etiquetas.msgExistNumero);
                                    break;
                                default:
                                    mostrarMensaje(1, etiquetas.msgDefaultError);
                                    break;
                            }  
                        }
                    }
                });
            }else
                mostrarMensaje(1,etiquetas.msgInvalidForm); 
        }  


        this.ejecutarAjuste = function(parametros,cargarMascara){
            if(cargarMascara){
                scope.loadMask(etiquetas.msgExecuteWait);
            }
            Ext.Ajax.request({
                url : 'ejecutarAjuste',
                method : 'POST',
                params : parametros,
                callback : function(options, success, response) {
                    if(cargarMascara){
                        scope.mask.hide();
                    }
                    
                    if(!response.responseText)
                        mostrarMensaje(1,etiquetas.msgDeafultError);
                    else{
                        var responseData = Ext.decode(response.responseText);
                        if(responseData){
                            var idSubsistema = 5;
                            var idTipoComprobante = 1;
                            var anexos = [];
                            var arrayAnotaciones = [];
                            var cuentaOrigen = (parseInt(responseData.saldoatranferir) > 0) ? responseData.cuentaOrigen : responseData.cuentaDestino;
                            var cuentaDestino = (parseInt(responseData.saldoatranferir) > 0) ? responseData.cuentaDestino : responseData.cuentaOrigen;
                            anexos.push(
                                new Ext.Cont.Comprobante.Anexo({ // ADICIONANDO EL CENTRO ORIGEN
                                    centronivel : responseData.centroOrigen.concat, 
                                    idcentronivel : responseData.centroOrigen.idcentrogrupo,  
                                    importe : Math.abs(responseData.saldoatranferir)
                                })
                            );
                            arrayAnotaciones.push(new Ext.Cont.Comprobante.Anotacion({
                                cuenta : cuentaOrigen.text,
                                idcuenta : cuentaOrigen.idcuenta, 
                                moneda : responseData.extras.moneda, 
                                idmoneda : responseData.extras.idmonedacontable, 
                                idtasa : responseData.extras.idtasa, 
                                debito : Math.abs(responseData.saldoatranferir), 
                                tipo : 1, 
                                anexos: anexos
                            }));
								
                            anexos = [];
                            anexos.push(
                                new Ext.Cont.Comprobante.Anexo({ // ADICIONANDO EL CENTRO ORIGEN
                                    centronivel : responseData.centroOrigen.concat, 
                                    idcentronivel : responseData.centroOrigen.idcentrogrupo,  
                                    importe : Math.abs(responseData.saldoatranferir)
                                })
                            )
                            if(anexos.length > 0){
                                arrayAnotaciones.push(new Ext.Cont.Comprobante.Anotacion({
                                    cuenta : cuentaDestino.text,
                                    idcuenta : cuentaDestino.idcuenta,
                                    moneda : responseData.extras.moneda, 
                                    idmoneda : responseData.extras.idmonedacontable, 
                                    idtasa : responseData.extras.idtasa, 
                                    credito : Math.abs(responseData.saldoatranferir), 
                                    tipo : 1, 
                                    anexos: anexos
                                }));
									
                                Ext.Cont.Comprobante.init(idSubsistema, idTipoComprobante, responseData.descripcion, responseData.descripcion, responseData.extras.fechacontable, arrayAnotaciones).onSaved(function(idComprobante,numeroComprobante){
                                    Ext.Ajax.request({
                                        url : 'guardarAjusteEjecutado',
                                        method : 'POST',
                                        params : {
                                            idajustecosto : responseData.idajustecosto,
                                            idcomprobante : idComprobante,
                                            numerocomprobante : numeroComprobante
                                        },
                                        callback : function(options, success, response) {
                                            scope.mask.hide();
                                            if(!response.responseText){
                                                mostrarMensaje(1,etiquetas.msgDefaultError);
                                            }else{
                                                var responseData = Ext.decode(response.responseText);
                                                switch (responseData.code) {
                                                    case 1:
                                                        scope.mask.hide();
                                                        mostrarMensaje(1,etiquetas.msgSingleEjecucion);
                                                        model.storeAjustes.reload();
                                                        break;
                                                    case 2:
                                                        mostrarMensaje(1,etiquetas.msgDefaultError);
                                                        break;
                                                    case 3:
                                                        mostrarMensaje(1,etiquetas.msgExistEjecucion);
                                                        break;
                                                    default:
//                                                        scope.notifyEvent(view.grid.body.dom, etiquetas.titleError, etiquetas.msgDeafultError,2,3000);
                                                        mostrarMensaje(1,etiquetas.msgDeafultError);
                                                        break;
                                                }
                                            }
                                        }
                                    });
                                });
                            }
                        }else{
                            mostrarMensaje(1,etiquetas.msgDeafultError);
                        }
                    }
                }
            });
            
        }
          
        this.eliminarAjuste = function(){
            if(view.sm.hasSelection()){
                Ext.Msg.confirm('Confirmacion',etiquetas.msgConfirmacion,function(btnPress){
                    if(btnPress === 'yes'){    
                        scope.loadMask(etiquetas.msgWaitDel);
                        var secselected = view.sm.getSelected();
                        Ext.Ajax.request({
                            url : 'eliminarAjuste',
                            method : 'POST',
                            params : {
                                idajustecosto : secselected.json.idajustecosto,
                                idestructuracomun : secselected.json.idestructuracomun
                            },
                            callback : function(options, success, response) {
                                scope.mask.hide();
                                if(!response.responseText){
                                    mostrarMensaje(1,etiquetas.msgDefaultError);
                                }else{
                                    var responseData = Ext.decode(response.responseText);
                                    switch (responseData.code) {
                                        case 1:
                                            scope.mask.hide();
                                            mostrarMensaje(1,etiquetas.msgSingleDelSuccess);
                                            model.storeAjustes.reload();
                                            break;
                                        case 2:
                                            mostrarMensaje(1,etiquetas.msgDefaultError);
                                            break;
                                        default:
//                                            scope.notifyEvent(view.grid.body.dom, etiquetas.titleError, etiquetas.msgDeafultError,2,3000);
                                            mostrarMensaje(1, etiquetas.msgDeafultError);
                                            break;
                                    }
                                }
                            }
                        });  
                    }
                });
            }else{
                mostrarMensaje(1, etiquetas.msgNotElementosSelected);
            }
        }
          
        function eventosWindowsSearch(){
            view.btnCancelarSearch.on('click', function() {
                view.ventanaSearch.close();
            });
            view.btnAceptarSearch.on('click', function(){
                searchAction();
            });

			view.tfCodigo.on({
				keypress: function(field,event){
					if(event.getKey()===event.ENTER && !Ext.isEmpty(field.getValue()))
						scope.searchAction();
				},
				keyup : function(field,event){
					if(field.getValue().length > 0 || !Ext.isEmpty(view.tfNombre.getValue()) || !Ext.isEmpty(view.cbEstado.getValue()))
						view.btnAceptarSearch.enable();
					else
						view.btnAceptarSearch.disable();
				}
            });
			
			view.tfNombre.on({
				keypress: function(field,event){
					if(event.getKey()===event.ENTER && !Ext.isEmpty(field.getValue()))
						scope.searchAction();
				},
				keyup : function(field,event){
					if(field.getValue().length > 0 || !Ext.isEmpty(view.tfCodigo.getValue()) || !Ext.isEmpty(view.cbEstado.getValue()))
						view.btnAceptarSearch.enable();
					else
						view.btnAceptarSearch.disable();
				}
            });
			
            view.cbEstado.on({
                beforeselect : function(combo,record,index){
                    if(combo.getValue() != record.data.idestado) // cambio de seleccion
                        view.btnAceptarSearch.enable();
                }
            });
        }
        
        function searchAction(){
            view.ventanaSearch.close();
            if(!Ext.isEmpty(view.tfCodigo.getValue()) || !Ext.isEmpty(view.tfNombre.getValue()) || !Ext.isEmpty(view.cbEstado.getValue())){
                var params = {
                    numero:!Ext.isEmpty(view.tfCodigo.getValue()) ? view.tfCodigo.getValue() : '-1',
                    nombre:!Ext.isEmpty(view.tfNombre.getValue()) ? view.tfNombre.getValue() : '-1',
                    estado:!Ext.isEmpty(view.cbEstado.getValue()) ? view.cbEstado.getValue() : '-1',
                    start:0,
                    limit:20
                }
                model.storeAjustes.load({
                    params : params,
                    callback:function(records, options, success){
                        if(records.length == 0){
                            model.storeAjustes.removeAll();
                            view.grid.body.unmask();
//                            scope.notifyEvent(view.grid.body.dom,etiquetas.titleInfo,etiquetas.emptyMsg,1,1000);
                            mostrarMensaje(1,etiquetas.emptyMsg);
                        }
                    }
                })
            }else{
                mostrarMensaje(1,etiquetas.msgNoDataToSend);
            }
        }
        
        this.limpiarForm = function(campo){
            switch (campo) {
                case 1: //cuando se cambia de cuenta
                    if (view.gridCuentasProceso.rendered){
                        view.smCuentasProceso.clearSelections();
                        model.storeCuentasProceso.removeAll();
                    }
                    if (view.gridCuentasTerminada.rendered){
                        view.smCuentasTerminada.clearSelections();
                        model.smCuentasTerminada.removeAll();
                    }
                    if (view.gridCuentasVendida.rendered){
                        view.smCuentasVendida.clearSelections();
                        model.storeCuentasVendida.removeAll();
                    }
                    break;
                default:
                    view.panelGestionar.getForm().reset();
                    if (view.gridCuentasProceso.rendered){
                        view.smCuentasProceso.clearSelections();
                        model.storeCuentasProceso.removeAll();
                    }
                    if (view.gridCuentasTerminada.rendered){
                        view.smCuentasTerminada.clearSelections();
                        model.storeCuentasTerminada.removeAll();
                    }
                    if (view.gridCuentasVendida.rendered){
                        view.smCuentasVendida.clearSelections();
                        model.storeCuentasVendida.removeAll();
                    }
                    break;
            }
        }
        /**
         * Funcion que muestra una notifico
         */
        this.notifyEvent = function(animateTarget, title, msg, icon, time){    
            this.notification = new Ext.Cont.Notification({
                animateTarget : animateTarget,
                fnc : Ext.emptyFn, 
                iconbox : icon,
                iconCls : "icon-waiting",
                title : title,
                html : msg,
                hideDelay: (time) ? time : 5000
            });
            this.notification.box();
        }
        
        /**
         * Funcion que muestra un mensaje personalizado
         */
        this.MsgPersonalizado = function(options){
            Ext.Msg.show({
                title: options.title,
                buttons: options.buttons,
                msg: options.msg,
                icon: options.icon,
                fn : options.fn
            });
        }
        /**
		* Funcion establece una mascara a tamanno de viewport
		*/
        this.loadMask = function(msg){
            scope.mask = new Ext.LoadMask(Ext.getBody(), {
                msg : msg
            });
            scope.mask.show();
        }
    }
}