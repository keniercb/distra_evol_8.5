Ext.ns("Ext.component.persona");
var idconcepto;
///////// GRID PANEL DE CONCEPTO////////
Ext.component.persona.gpConcepto = Ext.extend(Ext.grid.GridPanel,{
	title:'Listado de conceptos',
	split:true,
	loadMask: true,
	stripeRows:true,
	autoExpandColumn:'expandir',
	initComponent: function(){
	var self=this;
	var expander = new Ext.grid.RowExpander({
        	tpl : new Ext.Template(
           	 '<div><b>Descripcion: </b> {descripcion}</div>'
        	)
    });
	this.cm=new Ext.grid.ColumnModel({
	columns: [
			expander,
			{id:'expandir',header: "Denominaci&oacute;n ",sortable: true, dataIndex: 'denominacion'},
			{header: "Icono",sortable: true, dataIndex: 'icono'},
			{header: "Referencia",sortable: true, dataIndex: 'referencia'}
		]
	});

	this.store = new Ext.data.JsonStore({
        url:'/pvd/persona/index.php/configurarconcepto/getConceptos',
		root:'data',
		totalProperty:'total',
		fields: [
		    {name: 'idconcepto'},
		    {name: 'denominacion'},
		    {name: 'icono'},
		    {name: 'referencia'},
		    {name: 'descripcion'}
		]
	});
	this.tfBuscar = new Ext.app.SearchField({
            store: this.store,
            emptyText: 'Criterio a buscar...'
        });
	
	this.plugins = expander;
	this.sm = new Ext.grid.RowSelectionModel({
		singleSelect:true,
		listeners:{
			rowselect:{
				fn:function(sm,index,record){
					self.btnModificar.enable();
					self.btnEliminar.enable();
					self.btnAdicionar.focus();
				}
			}
		}
	});	
	this.store.load({
		params:{
			start:0,
			limit:15
		}
	});
	this.pbConceptos = new Ext.PagingToolbar({
	  pageSize: 15,
	  store: this.store,
	  displayInfo: true,
	  displayMsg: 'Resultados {0} - {1} de {2}',
	  emptyMsg: 'No hay elementos para mostrar'
	});
	this.btnAdicionar=new Ext.Button({
		text:'Ad<u>i</u>cionar',
		hidden:this.gestionar == 'true' ? false:true,
		tooltip:'Adicionar concepto <b>(Alt+I)</b>',
		iconCls:'adionar',
		handler : function(){
			var winAddConceptos=new Ext.component.persona.winGestionarConceptos({
				accion:'add',
				title:'Adicionar concepto',
				parent:self
			});
			winAddConceptos.show();
		} 
	});
	this.btnModificar=new Ext.Button({
		text:'<u>M</u>odificar',
		tooltip:'Modificar concepto <b>(Alt+M)</b>',
		hidden:this.gestionar == 'true' ? false:true,
		iconCls: 'modificar',
		disabled:true,
		handler : function(){
			var winModConceptos=new Ext.component.persona.winGestionarConceptos({
				accion:'mod',
				title:'Modificar concepto',
				parent:self
			});
			winModConceptos.show();
			winModConceptos.fAdicionar.getForm().loadRecord(self.getSelectionModel().getSelected());
		}
	});
	this.btnEliminar = new Ext.Button({
		text: 'Eliminar',
		tooltip: 'Eliminar concepto <b>(DEL)</b>',
		iconCls: 'eliminar',
		hidden:this.gestionar == 'true' ? false:true,
		disabled:true,
		handler:function(){
			Ext.Msg.show({
				title:'Confirmaci&oacute;n',
				msg:'¿Está seguro que quiere eliminar el concepto seleccionado?',
				icon:Ext.Msg.QUESTION,
				buttons:Ext.Msg.OKCANCEL,
				fn:function(btn){
					if(btn =='ok'){
    					  Ext.Ajax.request({
					    url:'eliminarConcepto',		
					    params:{	
						  id:idconcepto
					    },
					    callback: function (options, success, response){
						  responseData = Ext.decode(response.responseText);
						  if (responseData.exception == 1) {
							    Ext.MessageBox.show({
							      title: 'Información',
							      buttons: Ext.MessageBox.OK,
							      icon: Ext.MessageBox.INFO,
							      msg: 'El concepto seleccionado no se puede eliminar debido a que est&aacute; en uso.',
							      fn: function() {
								    self.btnAdicionar.focus();
							      }
							    });
						  }else {
							  mostrarMensaje(1,'El concepto ha sido eliminado satisfactoriamente.', function(btn){
							  self.store.reload();				
							  });
						  }						
					    }		
					 });
					}//fin btn==ok
				      }
			});
		}
	});
	
	this.tbar=[this.btnAdicionar,this.btnModificar,this.btnEliminar,this.tfBuscar];
	this.bbar=this.pbConceptos;
	this.keys=[{
				key:'i',
				alt:true, 
				fn:function(){self.btnAdicionar.handler();}
			},{
				key:'m',
				alt:true,
				fn:function(){
					if(!self.btnModificar.disabled ){
						self.btnModificar.handler();
            		}
				}
			},{ 
				key:46,
				alt:true,
				fn:function(){
				if(!self.btnEliminar.disabled){
					self.btnEliminar.handler();
					}
				}
			}
		];
	Ext.component.persona.gpConcepto.superclass.initComponent.call(this);
	  this.store.on('load',function(){
			  self.btnAdicionar.focus();
			  self.btnEliminar.disable();
			  self.btnModificar.disable();
	  });
	}
}
);
/***********************************************************************/
////// VENTANA DE ADICIONAR CONCEPTO//////////
Ext.component.persona.winGestionarConceptos=Ext.extend(Ext.Window,{
	modal:true,
	initComponent: function(){
		var self=this;
		this.fAdicionar=new Ext.component.persona.fpConcepto();
		this.btnAceptar = new Ext.Button({
			iconCls:'aceptar',
			text:'Aceptar',
			tooltip: 'Guardar datos y cerrar ventana <b>(ENTER)</b>',
			handler :this.accion == 'add'?
			    function(){				
				if(self.fAdicionar.getForm().isValid()){
					Ext.Ajax.request({
					    url:'adicionarConcepto',
					    params:{
						    dirimagen:self.fAdicionar.getForm().findField('dirimagen').getValue(),
						    denominacion: self.fAdicionar.getForm().findField('denominacion').getValue(),
						    icono:        self.fAdicionar.getForm().findField('icono').getValue(),
						    referencia:   self.fAdicionar.getForm().findField('referencia').getValue(),
						    descripcion:  self.fAdicionar.getForm().findField('descripcion').getValue()
					    },
					    callback: function (options, success, response){
							    responseData = Ext.decode(response.responseText);
							    if(responseData.codMsg==1){
										    if (responseData.exception == 1) {
								    Ext.MessageBox.show({
								    title: 'Información',
								    buttons: Ext.MessageBox.OK,
								    icon: Ext.MessageBox.INFO,
								    fn: function() {
									    self.parent.btnAdicionar.focus();
									    self.parent.btnModificar.disable();
									    self.parent.btnEliminar.disable();
								    }
								});
							    }else{
								self.close();
								if(responseData.existe){
								    mostrarMensaje(1,'El concepto que quiere adicionar ya existe.', function(btn){
									self.parent.getSelectionModel().clearSelections();
									self.parent.btnAdicionar.focus();
									self.parent.btnModificar.disable();
								      self.parent.btnEliminar.disable();
								    });
								}else{
								    mostrarMensaje(1,'El concepto ha sido adicionado satisfactoriamente.',function(btn){                            
									    self.parent.store.reload();	
									    self.parent.btnAdicionar.focus();
									    self.parent.btnModificar.disable();
									    self.parent.btnEliminar.disable();
								    });
							      }
							    }
						    }   					
					    }	      		
					});
				}
				
			}:function(){				
				if(self.fAdicionar.getForm().isValid()){
					Ext.Ajax.request({
					    url:'modificarConcepto',
					    params:{
						    id:idconcepto,
						    dirimagen:self.fAdicionar.getForm().findField('dirimagen').getValue(),
						    denominacion: self.fAdicionar.getForm().findField('denominacion').getValue(),
						    icono:        self.fAdicionar.getForm().findField('icono').getValue(),
						    referencia:   self.fAdicionar.getForm().findField('referencia').getValue(),
						    descripcion:  self.fAdicionar.getForm().findField('descripcion').getValue()
					    },
					    callback: function (options, success, response){
						responseData = Ext.decode(response.responseText);
						if(responseData.codMsg==1){
							if (responseData.exception == 1) {
							    Ext.MessageBox.show({
							      title: 'Información',
							      buttons: Ext.MessageBox.OK,
							      icon: Ext.MessageBox.INFO,
							      fn: function() {
								    self.parent.btnAdicionar.focus();
								    self.parent.btnModificar.disable();
								    self.parent.btnEliminar.disable();
							      }
							  });
							}else{
							    self.close();
							    if(responseData.existe){
		                        			mostrarMensaje(1, 'El concepto ya existe.', function(btn){
		                        				self.parent.getSelectionModel().clearSelections();
									self.parent.btnAdicionar.focus();
									self.parent.btnModificar.enable();
									self.parent.btnEliminar.enable();
			                           		});
							    }else{
								mostrarMensaje(1,'El concepto ha sido adicionado satisfactoriamente.',function(btn){                            
									self.parent.store.reload();	
									self.parent.btnAdicionar.focus();
									self.parent.btnModificar.enable();
									self.parent.btnEliminar.enable();
				                           	});
							      }
							}
						}     					
					    }	      		
					});
				}
				
			}
		});
		this.btnAplicar=new Ext.Button({
			iconCls:'aplicar',
			hidden:this.accion == 'add' ? false:true,
			text: 'Aplicar', 
			tooltip:'Guardar datos y limpiar los campos <b>(Ctrl+Alt+P)</b>',
			handler : function(){
				if(self.fAdicionar.getForm().isValid()){
					Ext.Ajax.request({
					    url:'adicionarConcepto',
					    params:{
						     dirimagen:self.fAdicionar.getForm().findField('dirimagen').getValue(),
						    denominacion: self.fAdicionar.getForm().findField('denominacion').getValue(),
						    icono:        self.fAdicionar.getForm().findField('icono').getValue(),
						    referencia:   self.fAdicionar.getForm().findField('referencia').getValue(),
						    descripcion:  self.fAdicionar.getForm().findField('descripcion').getValue()
					    },
		        		callback: function (options, success, response){
						responseData = Ext.decode(response.responseText);
						if(responseData.codMsg==1){
							if (responseData.exception == 1) {
							    Ext.MessageBox.show({
								title: 'Información',
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.INFO,
								fn: function() {
								    self.parent.btnAdicionar.focus();
								    self.parent.btnModificar.disable();
								    self.parent.btnEliminar.disable();
								}
							    });
							}else{
							    self.fAdicionar.getForm().reset();
							    if(responseData.existe){
								mostrarMensaje(1,'El concepto que quiere adicionar ya existe.', function(btn){
								  self.parent.getSelectionModel().clearSelections();
								  self.parent.btnAdicionar.focus();
								  self.parent.btnModificar.disable();
								  self.parent.btnEliminar.disable();
								});
							}else{
							    mostrarMensaje(1,'El concepto ha sido adicionado satisfactoriamente.', function(btn){                            
								self.parent.store.reload();
								self.parent.btnAdicionar.focus();
								self.parent.btnModificar.disable();
								self.parent.btnEliminar.disable();					
							     });
							}
						}
						}   					
						}	      		
		        	});
					}
				}
		});
		this.btnCancelar=new Ext.Button({
			iconCls:'cancelar',
			text:'Cancelar',
			tooltip:'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
			handler : function(){
				self.close();
				self.fAdicionar.winCargarImagen.destroy();
				self.parent.btnAdicionar.focus();
				if(self.accion == 'mod'){
				self.parent.btnModificar.enable();
				self.parent.btnEliminar.enable();
				}
				else{
				self.parent.btnModificar.disable();
				self.parent.btnEliminar.disable();
				}
			}
		});
		this.keys=[
		{
			key:Ext.EventObject.ENTER,
			fn:function(){self.btnAceptar.handler();}
		},{
			key:'p',
			alt:true,
			ctrl:true,
			fn:function(){self.btnAplicar.handler();}
		},{
			key:'x',
			alt:true,
			fn:function(){self.btnCancelar.handler();}
		}
		];
		this.buttons=[this.btnCancelar,this.btnAplicar,this.btnAceptar]; 
		
		this.items=[this.fAdicionar];
		Ext.component.persona.winGestionarConceptos.superclass.initComponent.call(this);
	}
}
);
/***********************************************************************/
///////// FORMULARIO ///////////////////////////
Ext.component.persona.fpConcepto=Ext.extend(Ext.form.FormPanel,{
	labelAlign: 'top',
	frame:true,	
	region:'center',
	width: 300,
	autoHeight:true,
	autoShow:true,
	initComponent: function(){
		var self=this;
		this.winAddImg= new Ext.component.persona.winAdicionarImg({
			title:'Adicionar icono',
			parent:self
		});
		this.denominacion=new Ext.form.TextField({
			fieldLabel:'Denominacion',
			name: 'denominacion',
			anchor:'99%',	
			maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,   
			regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,      
			regexText:'Solo se admiten valores alfanuméricos', 
			allowBlank:false,
			maxLength:250
		});
		
		this.btnCancelar=new Ext.Button({
			iconCls:'cancelar',
			text:'Cancelar',
			tooltip:'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>'
		});
		
		this.btnAceptar=new Ext.Button({
			iconCls:'aceptar',
			text:'Aceptar',
			tooltip: 'Guardar datos y cerrar ventana <b>(ENTER)</b>'
		});
		
		this.btnAddImg = new Ext.Button({
			iconCls:'adionar',
			text:'Adicionar',
			tooltip: 'Adicionar imagen',
			handler :function(){				
				self.winAddImg.show();
			}
		});
		
		
		this.winCargarImagen = new Ext.Component.Catalogoimagenes.GestionarImagenes({
		   url:'getIcons',
		   buttons:[this.btnCancelar,this.btnAceptar],
		   tbar:[this.btnAddImg]
		});
		
		// TriggerField de cargar la imagenes
		this.Icono = new Ext.form.TriggerField({
		      fieldLabel: 'Icono',
		      emptyText:'Seleccione...',
		      name: 'icono',
		      readOnlye:true,
		      allowBlank: true,
		      readOnly:true,
		      triggerClass: 'x-form-search-trigger',
		      anchor: '97%'
		  });
		this.Icono.onTriggerClick=function(){
			self.winCargarImagen.setTitle('Cat&aacute;logo de iconos');
		    self.winCargarImagen.show();
		};
		
		this.referencia=new Ext.form.TextField({
			fieldLabel:'Referencia',
			name: 'referencia',
			anchor:'99%',	
			maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,   
			regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,      
			regexText:'Solo se admiten valores alfanuméricos', 
			allowBlank:false,
			maxLength:250
		});
		
		this.dirImagen=new Ext.form.TextField({
			name: 'dirimagen',
			anchor:'99%',	     
			hidden:true,
			hideLabel:true
		});
		
		this.descripcion=new Ext.form.TextArea({
			fieldLabel:'Descripcion',
			name: 'descripcion',
			anchor:'99%',
			maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,   
			regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,      
			regexText:'Solo se admiten valores alfanuméricos', 
			maxLength:250
		});
		
		this.btnCancelar.on('click',function(){
		    self.winCargarImagen.hide();
			self.winCargarImagen.dvCatalogoImagenes.clearSelections();
		},this);
		
		this.btnAceptar.on('click',function(){  
		  var record=self.winCargarImagen.dvCatalogoImagenes.getSelectedRecords();
		  var realReecord=record[0];
		  var arr= realReecord.data.denominacion.split(".");
		  var result = "";
		  for(i=0; i<arr.length-1; i++){
		      result = result+arr[i];
		  }
		  self.Icono.setValue(result);
		  self.dirImagen.setValue(realReecord.data.denominacion);
		  self.winCargarImagen.hide();
		},this);
		
		this.items=[this.denominacion,this.referencia,this.Icono,this.dirImagen,this.descripcion];
		Ext.component.persona.fpConcepto.superclass.initComponent.call(this);	
	}
}
);

/////// VENTANA PARA CARGAR LA IMAGEN/////
Ext.component.persona.winAdicionarImg=Ext.extend(Ext.Window,{
	modal:true,
	layout:'fit',
	width:300,
	closeAction:'hide',
	initComponent: function(){
		var self=this;
		/**/
		//////BOTON DE SUBIR IMAGEN ////////
		var btnSubirImagen = new Ext.Button({
			text:'Aceptar',
			tooltip:'Subir imagen',
			iconCls:'aceptar',
			disabled: false,
 			handler : function(){
 				if(fpImagen.getForm().isValid()){
 					var valor = Ext.getCmp('tfimagen').getValue();
					var arr= valor.split(".");
					var result = arr[0];
					var longitud = arr.length;
					for(i=1; i<arr.length-1; i++){
						result = result+'.'+arr[i];
					}
 					extension = valor.substr(valor.lastIndexOf('.'));
 					fpImagen.getForm().submit({
 						url: 'guardarImagen',
 						params: {
							nombre:result,
 							extension:extension
 						},
 						waitMsg: 'Guardando datos de la imagen.',
 						success: function(formPwindow, o){
 							fpImagen.getForm().reset();
 							if(o.result.exception){
								Ext.MessageBox.show({
							      title: 'Información',
							      buttons: Ext.MessageBox.OK,
							      icon: Ext.MessageBox.INFO,
							      msg: 'La imagen no se ha podido adicionar.',
							      fn: function() {
									  fpImagen.getForm().reset();
									  self.hide();
							      }
							    });
 							}else {
								Ext.MessageBox.show({
							      title: 'Información',
							      buttons: Ext.MessageBox.OK,
							      icon: Ext.MessageBox.INFO,
							      msg: 'La imagen ha sido adicionada satisfactoriamente.',
							      fn: function() {
									  fpImagen.getForm().reset();
									  self.hide();
									  self.parent.winCargarImagen.stCatalogoImagenes.reload();
							      }
							    });
							}
 						},
 						callback: function (options,success,response){
 							fpImagen.getForm().reset();
							self.parent.winCargarImagen.stCatalogoImagenes.reload();
 						}
 					});
 
 				}
 			}
		});
		
		////////FORMULARIO PARA CARGAR IMAGENES//////
		 var fpImagen = new Ext.FormPanel({
			fileUpload : true,
			frame:true,
			region:'center',
			border : false,
			bodyBorder: false,
			id : 'fpImagen',
			labelAlign : 'top',
			labelWidth : 100,
			height: 100,
			margins: '5 5 0 5',
			bodyStyle : 'padding: 10px',
			items: [{
						xtype : 'fileuploadfield',
						id : 'tfimagen',
						anchor : '100%',
						padding:'0 0 0 0',
						margins: '5 0 5 5',
						allowBlank:false,
						emptyText : 'Seleccione',
						fieldLabel : 'Icono',
						regex : /^.+\.(jpg|png|jpeg|gif|bmp)$/i,
						regexText :'El archibo escogido no es una imagen',
						name : 'nombreimagen',
						buttonCfg : {
							iconCls : 'buscar'
						}
					}
					/*,btnSubirImagen*/
				   ]
				
			
		});

		this.btnCancelarAddImg=new Ext.Button({
			iconCls:'cancelar',
			text:'Cancelar',
			tooltip:'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
			handler : function(){
				self.hide();
				fpImagen.getForm().reset();
				self.parent.winCargarImagen.stCatalogoImagenes.reload();
			}
		});
		this.keys=[
		{
			key:Ext.EventObject.ENTER,
			fn:function(){self.btnAceptar.handler();}
		},{
			key:'x',
			alt:true,
			fn:function(){self.btnCancelar.handler();}
		}
		];
		this.buttons=[this.btnCancelarAddImg,btnSubirImagen]; 
		
		this.items=[fpImagen];
		Ext.component.persona.winAdicionarImg.superclass.initComponent.call(this);
	}
}
);
/////// COMPONENTE QUE PERMITE CARGAR LAS IMAGENES DEL DIRECTORIO SELECCIONADO /////////////
Ext.component.persona.FileUploadField = Ext.extend(Ext.form.TextField,{
    buttonOnly: false,
    buttonOffset: 3,
    readOnly: true,
    autoSize: Ext.emptyFn,

    // private
    initComponent: function(){
        Ext.component.persona.FileUploadField.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event fileselected
             * Fires when the underlying file input field's value has changed from the user
             * selecting a new file from the system file selection dialog.
             * @param {Ext.component.persona.FileUploadField} this
             * @param {String} value The file value returned by the underlying file input field
             */
            'fileselected'
        );
    },

    // private
    onRender : function(ct, position){
        Ext.component.persona.FileUploadField.superclass.onRender.call(this, ct, position);

        this.wrap = this.el.wrap({cls:'x-form-field-wrap x-form-file-wrap'});
        this.el.addClass('x-form-file-text');
        this.el.dom.removeAttribute('name');
        this.createFileInput();

        var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
            text: this.buttonText
        });
        this.button = new Ext.Button(Ext.apply(btnCfg, {
            renderTo: this.wrap,
            cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-icon' : '')
        }));

        if(this.buttonOnly){
            this.el.hide();
            this.wrap.setWidth(this.button.getEl().getWidth());
        }

        this.bindListeners();
        this.resizeEl = this.positionEl = this.wrap;
    },
    
    bindListeners: function(){
        this.fileInput.on({
            scope: this,
            mouseenter: function() {
                this.button.addClass(['x-btn-over','x-btn-focus'])
            },
            mouseleave: function(){
                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click'])
            },
            mousedown: function(){
                this.button.addClass('x-btn-click')
            },
            mouseup: function(){
                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click'])
            },
            change: function(){
                var v = this.fileInput.dom.value;
                this.setValue(v);
                this.fireEvent('fileselected', this, v);    
            }
        }); 
    },
    
    createFileInput : function() {
        this.fileInput = this.wrap.createChild({
            id: this.getFileInputId(),
            name: this.name||this.getId(),
            cls: 'x-form-file',
            tag: 'input',
            type: 'file',
            size: 1
        });
    },
    
    reset : function(){
        this.fileInput.remove();
        this.createFileInput();
        this.bindListeners();
        Ext.component.persona.FileUploadField.superclass.reset.call(this);
    },

    // private
    getFileInputId: function(){
        return this.id + '-file';
    },

    // private
    onResize : function(w, h){
        Ext.component.persona.FileUploadField.superclass.onResize.call(this, w, h);

        this.wrap.setWidth(w);

        if(!this.buttonOnly){
            var w = this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset;
            this.el.setWidth(w);
        }
    },

    // private
    onDestroy: function(){
        Ext.component.persona.FileUploadField.superclass.onDestroy.call(this);
        Ext.destroy(this.fileInput, this.button, this.wrap);
    },
    
    onDisable: function(){
        Ext.component.persona.FileUploadField.superclass.onDisable.call(this);
        this.doDisable(true);
    },
    
    onEnable: function(){
        Ext.component.persona.FileUploadField.superclass.onEnable.call(this);
        this.doDisable(false);

    },
    
    // private
    doDisable: function(disabled){
        this.fileInput.dom.disabled = disabled;
        this.button.setDisabled(disabled);
    },


    // private
    preFocus : Ext.emptyFn,

    // private
    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    }

});

Ext.reg('fileuploadfield', Ext.component.persona.FileUploadField);