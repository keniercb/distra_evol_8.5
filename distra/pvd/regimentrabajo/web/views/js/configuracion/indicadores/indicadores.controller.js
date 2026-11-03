Ext.ns('Pvd.ControlAsistencia.Indicadores');

Pvd.ControlAsistencia.Indicadores.Controlador = {

    init: function (idioma, vista, modelo) {

		//modelo.stTregimen.load();

        modelo.stListadoGrupoDescanso.load();
		this.accion = 'add';
        this.accion1 = 'addGD';
        var scope = this;
		
	/*	modelo.stInvitados.on('load', function () {           
			console.info(modelo.stInvitados.getRange());
        }, this);*/
        vista.gplistadoreporte.focus();
		
		
		 var idregimentrabajo;
		vista.gplistadoreporte.getSelectionModel().on('rowselect', function () {

			vista.btnModificar.enable();
			vista.btnEliminar.enable();
			vista.btnEliminarP.disable();
            //vista.btnAdicionar.focus();
			if(vista.gplistadoreporte.getSelectionModel().getSelections().length==1)
			{
                var idreporte=vista.gplistadoreporte.getSelectionModel().getSelected().get('idreporte');
			modelo.stListadoGrupoDescanso.baseParams = {idreporte:idreporte};
			modelo.stListadoGrupoDescanso.load();
			}
			
        }, this);
		
		vista.btnAdicionar.on('click', function () {
            modelo.stIndicadores.load(/*{params: {idreporte:1,start:0,limit:10}}*/);
			vista.btnAplicar.show();
			vista.winAdicionarRT.setTitle(idioma.lbTitVentAddRegimen);
			vista.winAdicionarRT.show();
            vista.tfdenominacion.focus();
            vista.idexpresionmatematica=-1;
			self.accion = 'add';
				
        }, this);
		
		vista.winAdicionarRT.on('hide',function(th){
			vista.fadicionarRT.getForm().reset();
		})
		
		vista.btnModificar.on('click', function () {
			vista.winAdicionarRT.setTitle(idioma.lbTitVentModRegimen);
			vista.winAdicionarRT.show();
			vista.winAdicionarRT.doLayout();
            vista.fadicionarRT.getForm().loadRecord(vista.gpListadoGrupoDescanso.getSelectionModel().getSelected());
            vista.tfdenominacion.focus();
			self.accion = 'mod';
        }, this);
		 		 
		vista.btnCancelar.on('click', function () {    
			vista.fadicionarRT.getForm().reset();			
			vista.winAdicionarRT.hide();	
        }, this);
		
		vista.btnAceptar.on('click', function () {
		guardarDatos('ACP');	
		
		}, this);
		
		vista.btnAplicar.on('click', function () {
		guardarDatos('APL');	
		
		}, this);
		
		vista.gpListadoGrupoDescanso.getSelectionModel().on('rowselect', function (q,r,r) {

            if(r.get('gestionable')==1)
            {
			vista.btnModificar.enable();
			vista.btnEliminar.enable();
            }
            else
            {
                vista.btnModificar.disable();
                vista.btnEliminar.disable();
            }
            //vista.btnAdicionarP.focus();
			
        }, this);
		
		vista.btnAdicionarP.on('click', function () {
         /*   if(vista.gplistadoreporte.getSelectionModel().getSelected()){
                var regimentrabajo = vista.gplistadoreporte.getSelectionModel().getSelected().get('idregimentrabajo');
                vista.combo.setValue(regimentrabajo);
            }else{
                vista.combo.setValue('');
            }*/

            modelo.stGestIndicadores.load();
			vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
			vista.winAdicionarGD.show();
			self.accion1 = 'addGD';
				
        }, this);


        vista.tfFormula.on('focus', function(){
            this.MostrarFormula();
        }.createDelegate(this));

        this.ConvertiraArreglo = function(arrObj){
            var arr = new Array();
            for(var i = 0; i < arrObj.length; i++){
                var a = new Array();
                a[0] = arrObj[i].idcausa;
                a[1] = arrObj[i].denominacion;
                a[2] = arrObj[i].tipo;
                arr[i] = a;
            }
            return arr;
        }.createDelegate(this);

        this.MostrarFormula = function(){

            Ext.Ajax.request({
                url: 'getIndicadoresCausa',
                callback: function() {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    //mostrarMensaje(1, idioma.lbMsgDelModeloExito);
                    var responseData = Ext.decode(r.responseText);

                   var result=new Array();
                    for(var i = 0; i < responseData.length; i++) {

                        if(responseData[i].idindicador)
                        {
                            var array1=new Array();
                            array1[0] = 'F' + responseData[i].idindicador;
                            array1[1] = responseData[i].denominacion;
                            array1[2] = 'Fijos';
                            result.push(array1);
                        }
                        else{
                            var array=new Array();
                            array[0] = responseData[i].idcausa;
                            array[1] = responseData[i].denominacion;
                            array[2] = 'Indicadores';
                            result.push(array);
                        }



                    }
                    this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                        title: 'Editor de expresiones matem&aacute;ticas',
                        idexpresionmatematica : self.accion == 'add' ?  vista.idexpresionmatematica : vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('idexpresionmatematica'),
                        indicadores: result,
                        agrupado: 1,
                        campoagrupar: 'Tipo',
                        mostrarFunciones: 2,
                        operadoresMostrar: ['+','-','*','/','pa','pc','s','p'],
                        mostrarDenominacion: true
                    });
                    this.objExpMat.on('expresionsalvada', function(arr){
                      vista.idexpresionmatematica = arr.idexpresionmatematica;
                        var formula= arr.elementosMostrar;
                        this.objExpMat.close();
                        vista.tfFormula.setValue(formula);


                    }.createDelegate(this));

                    this.objExpMat.show();
                }
            });

        }.createDelegate(this);
		
		
		function guardarDatos(btnpress){



            if(vista.fadicionarRT.getForm().isValid()){
                if(accion == 'add')
                    Ext.getBody().mask(idioma.lbTitMsgAdicionandoR);
                else
                    Ext.getBody().mask(idioma.lbTitMsgModificandoR);
                Ext.Ajax.request({
					url: (self.accion == 'add' ? 'addIndicador' : 'modIndicador'),
					params: {
						idindicador: self.accion == 'add' ? -1 : vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('idindicador'),
						denominacion: vista.tfdenominacion.getValue(),
						descripcion: vista.taDescripcion.getValue(),
						fdesde: vista.dfIregimen.getRawValue(),
						fhasta: vista.dfFregimen.getRawValue(),
                        unidadmedida:vista.tfunidadmedida.getValue(),
                        idexpresionmatematica:self.accion == 'add' ? vista.idexpresionmatematica:vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('idexpresionmatematica')
											
					},
					success: function (r){
                     Ext.getBody().unmask();
						var responseData = Ext.decode(r.responseText);	
					
						if(self.accion == 'mod'&&responseData.success) {
							mostrarMensaje(1, idioma.lbMsgModRegimenExito);
							
						} else if(self.accion == 'add'&&responseData.success){						
							mostrarMensaje(1, idioma.lbMsgInsRegimenExito);
													
						}
						 else if(!responseData.success){																									
							mostrarMensaje(3, responseData.mensaje);							
						}
						if (btnpress == 'ACP') {
							vista.fadicionarRT.getForm().reset();
							vista.winAdicionarRT.hide();
							
						}
						if (btnpress == 'APL') {
                            vista.idexpresionmatematica=-1;
							vista.fadicionarRT.getForm().reset();	
						}

						vista.gpListadoGrupoDescanso.store.reload();
					}
				});
			}else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
		} 
		


        function existe(nueva){

            if (vista.gpIndicadores.store.getCount() > 0) {
                var bandera = false;
                for (var i = 0; i < vista.gpIndicadores.store.getCount(); i++) {
//alert(vista.gpIndicadores.store.getAt(i).id);
//alert(nueva);
                    if (vista.gpIndicadores.store.getAt(i).id == nueva) {
                        bandera = true;
                        return bandera;
                        break;
                    }


                }
                return bandera;
            }
            else return false;



		}
		
		vista.btnEliminar.on('click', function(){
            Eliminar();
        }, this);

        function Eliminar(){
            var canteliminar=vista.gpListadoGrupoDescanso.getSelectionModel().getSelections().length;
            mostrarMensaje(2, canteliminar>1?idioma.lbTitMsgSeguroEliminarRVarios:idioma.lbTitMsgSeguroEliminarRUno, function(btnPresionado) {
                if (btnPresionado == 'ok') {
                    var ids = new Array();
                    for (i=0; i<vista.gpListadoGrupoDescanso.getSelectionModel().getSelections().length; i++) {
                        var id = vista.gpListadoGrupoDescanso.getSelectionModel().getSelections()[i].get('idindicador');
                        ids.push({idindicador:id});
                    }
                    Ext.getBody().mask(canteliminar>1?idioma.lbTitMsgEliminandoRVarios:idioma.lbTitMsgEliminandoRUno);
                    Ext.Ajax.request({
                        url: 'eliminarIndicador',
                        params:{arrindicador: Ext.encode(ids)},
                        callback: function() {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            //mostrarMensaje(1, idioma.lbMsgDelModeloExito);
                            var responseData = Ext.decode(r.responseText);
                            //console.info(responseData);
                            var aux = '';
                            var regimen = '';

                                mostrarMensaje(1, canteliminar>1?idioma.lbMsgDelRegimenExitoVarios:idioma.lbMsgDelRegimenExitoUno);

                            modelo.stListadoGrupoDescanso.reload();
                                                  }
                    });
                }
            });
        }
		
		
		vista.btnEliminarP.on('click', function(){
            EliminarGD();
        }, this);

        function EliminarGD(){

                var rows = vista.gpIndicadores.getSelectionModel().getSelections();
                var arrIds = new Array();

                if (rows.length === 0) {
                    return false;
                }
            else {
                    mostrarMensaje(2, idioma.lbTitMsgSeguroEliminarG, function (btnPresionado) {
                        if (btnPresionado == 'ok') {

                            for (i = 0; i < rows.length; i++) {
                                vista.gpIndicadores.store.remove(rows[i]);

                            }
                            //mostrarMensaje(1, idioma.lbMsgDelGrupoExito);

                           // modelo.stListadoGrupoDescanso.reload();
                          //  modelo.stTregimen.reload();

                        }
                    });
                }
        }
		

		function Notificar(mens,icon) {
			Ext.Notification.show({
				title: 'Informaci&oacute;n',
				icon:icon,
				msg: mens,
				time: 3
			}); 
		}

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imx',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                        if(vista.gplistadoreporte.focus()){
                            vista.winAdicionarRT.setTitle(idioma.lbTitVentAddRegimen);
                            vista.winAdicionarRT.show();
                            vista.btnAplicar.show();
                            self.accion = 'add';
                        }else{
                            if(vista.gplistadoreporte.getSelectionModel().getSelected()){
                                var regimentrabajo = vista.gplistadoreporte.getSelectionModel().getSelected().get('idregimentrabajo');
                                vista.combo.setValue(regimentrabajo);
                            }else{
                                vista.combo.setValue('');
                            }
                            vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
                            vista.winAdicionarGD.show();
                            self.accion1 = 'addGD';
                        }
                        break;
                    }
                    case 77:{ //m para modificar
                        if(vista.gplistadoreporte.focus()){
                            if(!vista.btnModificar.disabled){
                                var idregimentrabajo=vista.gplistadoreporte.getSelectionModel().getSelected().get('idregimentrabajo');
                                vista.fadicionarRT.getForm().loadRecord(vista.gplistadoreporte.getSelectionModel().getSelected());
                                vista.winAdicionarRT.setTitle(idioma.lbTitVentAddRegimen);
                                vista.winAdicionarRT.show();
                                vista.winAdicionarRT.doLayout();
                                self.accion = 'mod';
                            }
                        }else{
                            if(!vista.btnModificarP.disabled){
                                vista.fadicionarGD.getForm().reset();
                                var idregimentrabajo=vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('idgrupodescanso');
                                vista.fadicionarGD.getForm().loadRecord(vista.gpListadoGrupoDescanso.getSelectionModel().getSelected());
                                vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
                                vista.winAdicionarGD.show();
                                self.accion1 = 'modGD';
                            }
                        }

                        break;
                    }
                    case 88:{ //x para cancelar
                        if(vista.gplistadoreporte.focus()){
                            vista.fadicionarRT.getForm().reset();
                            vista.winAdicionarRT.hide();
                        }else{
                            vista.winAdicionarGD.hide();
                        }
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(vista.gplistadoreporte.focus()){
                    if(!vista.btnEliminar.disabled){
                        Eliminar();
                    }
                }else{
                    if(!vista.btnEliminarP.disabled){
                        EliminarGD();
                    }
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if(vista.gplistadoreporte.focus()){
                    if(vista.btnAceptar.isVisible()){
                        vista.btnAceptar.focus();
                        guardarDatos('ACP');
                    }
                }else{
                    if(vista.btnAceptarGD.isVisible()){
                        vista.btnAceptarGD.focus();
                        guardarDatosGD('ACP');
                    }
                }
            }
        },{
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'p',
            fn: function(){
                if(vista.gplistadoreporte.focus()){
                    if(vista.btnAplicar.isVisible()){
                        guardarDatos('APL');
                    }
                }else{
                    if(vista.btnAplicarGD.isVisible()){
                        guardarDatosGD('APL');
                    }
                }
            }
        }]);

        //Manipulador de HotKeys
       /* var teclaAltGD = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imx',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                        if(vista.gplistadoreporte.getSelectionModel().getSelected()){
                            var regimentrabajo = vista.gplistadoreporte.getSelectionModel().getSelected().get('idregimentrabajo');
                            vista.combo.setValue(regimentrabajo);
                        }else{
                            vista.combo.setValue('');
                        }
                        vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
                        vista.winAdicionarGD.show();
                        self.accion = 'addGD';
                        break;
                    }
                    case 77:{ //m para modificar
                        if(!vista.btnModificarP.disabled){
                            vista.fadicionarGD.getForm().reset();
                            var idregimentrabajo=vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('idgrupodescanso');
                            vista.fadicionarGD.getForm().loadRecord(vista.gpListadoGrupoDescanso.getSelectionModel().getSelected());
                            vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
                            vista.winAdicionarGD.show();
                            self.accion = 'modGD';
                        }
                        break;
                    }
                    case 88:{ //x para cancelar
                        vista.winAdicionarGD.hide();
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(!vista.btnEliminarP.disabled){
                    EliminarGD();
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){

                if(vista.btnAceptarGD.isVisible()){
                    vista.btnAceptarGD.focus();
                    guardarDatosGD('ACP');
                }
            }
        },{
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'p',
            fn: function(){
                if(vista.btnAplicarGD.isVisible()){
                    guardarDatosGD('APL');
                }
            }
        }]);*/
    }
}