Ext.ns("Configuracion.Especialidad");
	var nodoactual = null;
	var nivel = null;
	var oldvalue = null;
Configuracion.Especialidad.GestionarEspController = {
	init:function(idioma,Model,Vista){
		this.mvc = {
			idoma: idioma,
			vista: Vista,
			modelo: Model
		};
		this.EventosBotones();
		this.EventoTree();
	},
	EventosBotones: function(){
		this.mvc.vista.btnAdicionar.on("click",function(){
			this.GestionarEsp("add");
		},this);
		this.mvc.vista.btnModificar.on('click',function(){
			this.GestionarEsp("mod");
		},this);
	},
	GestionarEsp:function(opt){
		switch(opt){
			case 'add':
				this.mvc.vista.crearVentana("add");
				this.mvc.vista.btncancelar.on('click',function(){
					this.mvc.vista.win.close();	
				},this);
				Ext.getCmp('btnaceptar').on("click",function(){
					this.Aceptar();
				},this);
				Ext.getCmp('btnaplicar').on("click",function(){
					this.Aceptar('apl');
				},this);
				this.mvc.vista.win.keys = {
						key: Ext.EventObject.ENTER,
						handler: function() {
							this.Aceptar();
						},
						scope:this
					};

			break;
			case'mod':
				
				this.mvc.vista.crearVentana("mod");
				this.mvc.vista.pform.getForm().loadRecord(this.mvc.modelo.dameNodeInfoModificar(this.mvc.vista.trEE.getSelectionModel().getSelectedNode()));
				this.mvc.vista.btncancelar.on('click',function(){
					this.mvc.vista.win.close();	
				},this);
				Ext.getCmp('btnaceptar').on("click",function(){
					this.modificar(oldvalue);
				},this);
				Ext.getCmp('btnaplicar').hide();
				
			break;
		}
		if(this.mvc.vista.win)
			this.EventoCamposFecha();
	},
	//funcion aceptar de la accion del boton aceptar
	  /** * Insertando Nodo Raiz * */
	Aceptar: function (apl) {
        if (this.mvc.vista.pform.getForm().isValid()) {
            this.mvc.vista.pform.getForm().submit({
                url:'insertar',
                waitMsg:perfil.etiquetas.lbTAdicionando,
                params:{
                    idpadre:nodoactual, 
                    nivel:nivel+1
                },
                failure: function(form, action){
                    if(action.result.codMsg == 1){
                        mostrarMensaje(action.result.codMsg,perfil.etiquetas.lbTAdicionado)
                        pform.getForm().reset(); 
                        if(!apl) this.mvc.vista.win.close();
                        this.mvc.modelo.treeLoader.load(this.mvc.vista.trEE.getSelectionModel().getSelectedNode(), function(){
                            this.vista.trEE.getSelectionModel().getSelectedNode().expand();
                        },this);
                        this.mvc.vista.btnEliminar.disable();
                    }
                    else if (action.result.codMsg == 3){
                        mostrarMensaje(action.result.codMsg,action.result.mensaje,action.result.detalles);
                    }
                }
            });
        }else{
            mostrarMensaje(1,perfil.etiquetas.textVerifiqueNuevamente,function(){});
        }		
    },
	EventoTree:function(){
			this.mvc.vista.trEE.on('click', function(node, e) {
			nodoactual = node.attributes.id;
			nivel = node.getDepth();
			this.mvc.vista.btnAdicionar.enable();
				
			if (node.attributes.id !=0 ) 
			{
				this.mvc.vista.btnModificar.enable();
				this.mvc.vista.fpDetalles.getForm().loadRecord(this.mvc.modelo.dameNodeInfo(node));
				if (node.attributes.leaf == 1)
					this.mvc.vista.btnEliminar.enable(); 
				else 
					this.mvc.vista.btnEliminar.disable();
			}
			else 
			{
				this.mvc.vista.fpDetalles.getForm().reset();
				this.mvc.vista.btnModificar.disable();
				this.mvc.vista.btnEliminar.disable();
			}
		}, this);
	},
	EventoCamposFecha:function(){
		Ext.getCmp('fechaini').on('valid', function() {
		Ext.getCmp('fechafin').enable();
		Ext.getCmp('fechafin').setMinValue(Ext.getCmp('fechaini').getRawValue());

		});
		Ext.getCmp('fechaini').on('invalid', function() {
			Ext.getCmp('fechafin').disable();
			Ext.getCmp('fechafin').setRawValue(' ');
		});
		Ext.getCmp('fechaini').on('change', function() {
			Ext.getCmp('fechafin').setMinValue(Ext.getCmp('fechaini').getRawValue());
		});
	},
	//Modificar
	modificar:function() {
        var nodeSelect = this.mvc.vista.trEE.getSelectionModel().getSelectedNode();
        var padre = this.mvc.vista.trEE.getNodeById(nodeSelect.attributes.padre);
        if (this.mvc.vista.pform.getForm().isDirty()) {
            if (this.mvc.vista.pform.getForm().isValid()) {
                Ext.Ajax.request({
                    url: 'verificar',
                    method: 'POST',
                    params: {
                        fechaini: Ext.getCmp('fechaini').getRawValue(),
                        idespecialidad: this.mvc.vista.trEE.getSelectionModel().getSelectedNode().attributes.id,
                        abrevespecialidad: Ext.getCmp('abreviatura').getValue(),
                        denespecialidad: Ext.getCmp('denom').getValue(),
                        codespecialidad: Ext.getCmp('codigo').getValue(),
                        fechafin: Ext.getCmp('fechafin').getRawValue()
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.modifico == 'nomodifico') {
                            mostrarMensaje(responseData.codMsg, this.mvc.idioma.etiquetas.lbTNoModificado);
                        }
                        else
                        {
                            this.mvc.vista.pform.getForm().submit({
                                url: 'modificar',
                                waitMsg: this.mvc.idioma.etiquetas.lbTModificando,
                                params: {
                                    ov: oldvalue,
                                    nivel: nivel
                                            // idespecialidad:trEE.getSelectionModel().getSelectedNode().attributes.id
                                },
                                failure: function(form, action) {
                                    oldvalue = null;
                                    if (action.result.codMsg == 1) {
                                        mostrarMensaje(action.result.codMsg, this.mvc.idioma.etiquetas.lbTModificado);
                                        this.mvc.vista.pform.getForm().reset();
                                        win3.hide();
                                        this.mvc.modelo.treeLoader.load(padre, function() {
                                            padre.expand();
                                        });
                                        btnEliminar.disable();
                                    }
                                    else if (action.result.codMsg == 3) {
                                        mostrarMensaje(action.result.codMsg, action.result.mensaje, action.result.detalles);
                                    }
                                }
                            });
                        }
                    }
                });
            }
            else
                mostrarMensaje(3, etiquetas.textVerifiqueNuevamente);
        }
        else {
            mostrarMensaje(1, etiquetas.msgNoValorModif);
        }
    }
};
