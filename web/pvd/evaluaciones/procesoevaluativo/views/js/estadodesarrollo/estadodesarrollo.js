Ext.QuickTips.init();
labels = Object();
UCID.portal.cargarEtiquetas('estadodesarrollo', cargarInterfaz);
Ext.ns('Ext.components.Evaluaciones');
var idestadodesarrollo;
///////// GRID PANEL DE ESTADO DE DESARROLLO////////
Ext.components.Evaluaciones.gpEstadoDesarrollo = Ext.extend(Ext.grid.GridPanel,{
	title:'Listado de estados de desarrollo',
	region:'center',
	loadMask: true,
	stripeRows:true,
	 autoExpandColumn:'den',
	initComponent: function(){
	var self=this;
	var expander = new Ext.grid.RowExpander({
        	tpl : new Ext.Template(
           	 '<div><b>Descripcion: </b> {descripcion}</div>'
        	)
    });
	this.cm=new Ext.grid.ColumnModel({
	columns: [expander,
			{id:'den',header: "Denominaci&oacute;n ",sortable: true, dataIndex: 'denominacion'},
			{header: "Fecha de Inicio ",sortable: true,width:110 , dataIndex: 'fechainicio'},
			{header: "Fecha de Fin",sortable: true,width:110 , dataIndex: 'fechafin'}
		]
	});
	this.store = new Ext.data.JsonStore({
        url:'getEstadodesarrollo',
		root:'data',
		totalProperty:'total',
		fields: [
		   {name: 'idestadodesarrollo'},
           {name: 'denominacion'},
           {name: 'fechainicio'},
           {name: 'fechafin'},
		   {name: 'descripcion'},
        ]
    });
	this.plugins = expander;
	this.tfBuscar=new Ext.app.SearchField({
		store:this.store,
		emptyText:labels.TextBuscar,
	});
	
	this.sm = new Ext.grid.RowSelectionModel({
			singleSelect:true,
			listeners:{
				rowselect:{
					fn:function(sm,index,record){
						idestadodesarrollo=record.data.idestadodesarrollo;
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
	this.pbacceso = new Ext.PagingToolbar({
        pageSize: 15,
        store: this.store,
        displayInfo: true,
        displayMsg: 'Resultados {0} - {1} de {2}',
        emptyMsg: labels.lbPagdinVacio,
    });
	this.btnAdicionar=new Ext.Button({
		text:labels.btnAdicionar,
		tooltip:labels.lbBtnAdicionarAcceso,
		iconCls:'btn',
		handler : function(){
			var winAdd=new Ext.components.Evaluaciones.wAdicionar({
				accion:'add',
				title:'Adicionar estado de desarrollo',
				parent:self
			});
			winAdd.show();
			winAdd.on('show',function(){
				winAdd.btnAceptar.focus();
			},this)
		} 
	});
	this.btnModificar=new Ext.Button({
		text:labels.btnModificar,
		id:'btnMod',
		tooltip:labels.lbBtnModificarAcceso,
		iconCls: 'modificar',
		handler : function(){
			var winMod=new Ext.components.Evaluaciones.wAdicionar({
				accion:'mod',
				title:'Modificar estado de desarrollo',
				parent:self
			});
			winMod.show();
			winMod.fAdicionar.getForm().loadRecord(self.getSelectionModel().getSelected());
			winMod.on('show',function(){
				winMod.btnAceptar.focus();
			},this)
		}
	});
	this.btnEliminar = new Ext.Button({
		text:labels.btnEliminar,
		id:'btnEliminar',
		tooltip:labels.lbBtnEliminarAcceso,
		iconCls: 'eliminar',
		handler:function(){
				Ext.Msg.show({
					title:'Confirmaci&oacute;n',
					msg:labels.lbDelEstadoD,
					icon:Ext.Msg.QUESTION,
					buttons:Ext.Msg.OKCANCEL,
					fn:function(btn){
						if(btn =='ok'){
							PVD.mostrarMascara('idmskmodify',labels.lbMsgWait, labels.lbEnAccionEstadoD);        			
    						Ext.Ajax.request({
								url:'eliminarEstadoDesarrollo',		
								params:{								
									id:idestadodesarrollo
								},
								callback: function (options, success, response){
											PVD.ocultarMascara('idmskmodify');														
											responseData = Ext.decode(response.responseText);
												if (responseData.success) {
													Ext.Notification.show({
														title: 'Informaci&oacute;n',
														msg: labels.lbDelSatisfactoriamenteEstadoD,
														time: 3
													});
													self.store.load({
													params:{
														limit:15,
														start:0
													}
													});		
												}else{
													self.close();
													Ext.Notification.show({
														title: 'Informaci&oacute;n',
														msg: labels.lbDelEnUsoEstadoD,
														time: 3
													});
												}
												self.btnAdicionar.focus();
												self.btnModificar.disable();
												self.btnEliminar.disable();  
										}		
											});
										}//fin btn==ok
									}
								});
			}
	});
	
	this.tbar=[this.btnAdicionar,this.btnModificar,this.btnEliminar,this.tfBuscar];
	this.bbar=this.pbacceso;
	this.keys=[
			{
				key:'l',
				alt:true, 
				fn:function(){self.tfBuscar.setRawValue("")}
			},{
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
	Ext.components.Evaluaciones.gpEstadoDesarrollo.superclass.initComponent.call(this);
	this.store.on('load',function(){
			self.tfBuscar.focus();
			self.btnEliminar.disable();
			self.btnModificar.disable();
		});
	}
}
);
/***********************************************************************/
////// VENTANA DE ADICIONAR ESTADO DE DESARROLLO//////////
Ext.components.Evaluaciones.wAdicionar=Ext.extend(Ext.Window,{
	modal:true,
	initComponent: function(){
		var self=this;
		
		this.fAdicionar=new Ext.components.Evaluaciones.fpAsistencia();
		 this.btnAceptar = new Ext.Button({
			iconCls:'aceptar',
			id:'aceptar'+self.id,
			nextTab:self.fAdicionar.denominacion.id,
			prevTab:'aplicar'+self.id,
			text:labels.BtnAceptar,
			tooltip:labels.lbBtnAceptar,
			handler :this.accion == 'add'?
			    function(){				
					if(self.fAdicionar.getForm().isValid()){
					PVD.mostrarMascara('idmskmodify',labels.lbMsgWait, labels.lbMsgBarraEstadoD); 
					Ext.Ajax.request({
		        		url:'adicionarEstadoDesarrollo',
		        		params:{
		        			denominacion: self.fAdicionar.getForm().findField('denominacion').getValue(),
		        			fechainicio:  self.fAdicionar.getForm().findField('fechainicio').getRawValue(),
		        			fechafin:     self.fAdicionar.getForm().findField('fechafin').getRawValue(),
		        			descripcion:  self.fAdicionar.getForm().findField('descripcion').getValue(),
		        		},
		        		callback: function (options, success, response){
							PVD.ocultarMascara('idmskmodify');														
							responseData = Ext.decode(response.responseText);
								if (responseData.existe) {
									self.close();
		                        	Ext.Notification.show({
										title: 'Informaci&oacute;n',
										msg: labels.lbAddSatisfactoriamenteEstadoD,
										time: 3
									});
									self.parent.store.load({
									params:{
										limit:15,
										start:0
									}
									});		
		                        }else{
									self.close();
		                        	Ext.Notification.show({
										title: 'Informaci&oacute;n',
										msg: labels.lbAddsExisteEstadoD,
										time: 3
									});
		                        }
								self.parent.tfBuscar.focus();
								self.parent.btnModificar.disable();
								self.parent.btnEliminar.disable();  
						}	      		
		        	});
					}
				
			}:   function(){				
					if(self.fAdicionar.getForm().isValid()){
					PVD.mostrarMascara('idmskmodify',labels.lbMsgWait,labels.lbMsgBarraEstadoD);
					Ext.Ajax.request({
		        		url:'modificarEstadoDesarrollo',
		        		params:{
							id:idestadodesarrollo,
		        			denominacion: self.fAdicionar.getForm().findField('denominacion').getValue(),
		        			fechainicio:  self.fAdicionar.getForm().findField('fechainicio').getRawValue(),
		        			fechafin:     self.fAdicionar.getForm().findField('fechafin').getRawValue(),
		        			descripcion:  self.fAdicionar.getForm().findField('descripcion').getValue(),
		        		},
		        		callback: function (options, success, response){
								PVD.ocultarMascara('idmskmodify');
								responseData = Ext.decode(response.responseText);
								if (responseData.existe) {
									self.close();
		                        	Ext.Notification.show({
										title: 'Informaci&oacute;n',
										msg: labels.lbModSatisfactoriamenteEstadoD,
										time: 3
									});
									self.parent.store.load({
									params:{
										limit:15,
										start:0
									}
									});		
		                        }else{
									self.close();
		                        	Ext.Notification.show({
										title: 'Informaci&oacute;n',
										msg: labels.lbModExisteEstadoD,
										time: 3
									});
		                        }
								self.parent.tfBuscar.focus();
								self.parent.btnModificar.disable();
								self.parent.btnEliminar.disable();  
						    					
							}	      		
		        	});
					}
				
			}
		});
		this.btnAplicar=new Ext.Button({
			iconCls:'aplicar',
			id:'aplicar'+self.id,
			hidden:this.accion == 'add' ? false:true,
			text:labels.BtnAplicar, 
			tooltip:labels.lbBtnAplicar,
			handler : function(){
				if(self.fAdicionar.getForm().isValid()){
					PVD.mostrarMascara('idmskmodify',labels.lbMsgWait, labels.lbMsgBarraEstadoD);
					Ext.Ajax.request({
		        		url:'adicionarEstadoDesarrollo',
		        		params:{
		        			denominacion: self.fAdicionar.getForm().findField('denominacion').getValue(),
		        			fechainicio:  self.fAdicionar.getForm().findField('fechainicio').getRawValue(),
		        			fechafin:     self.fAdicionar.getForm().findField('fechafin').getRawValue(),
		        			descripcion:  self.fAdicionar.getForm().findField('descripcion').getValue(),
		        		},
		        		callback: function (options, success, response){
							PVD.ocultarMascara('idmskmodify');														
							responseData = Ext.decode(response.responseText);
								if (responseData.existe) {
		                        	Ext.Notification.show({
										title: 'Informaci&oacute;n',
										msg: labels.lbAddSatisfactoriamenteEstadoD,
										time: 3
									});
									self.parent.store.load({
									params:{
										limit:15,
										start:0
									}
									});	
									self.fAdicionar.getForm().reset();
		                        }else{
		                        	Ext.Notification.show({
										title: 'Informaci&oacute;n',
										msg: labels.lbAddsExisteEstadoD,
										time: 3
									});
									self.fAdicionar.getForm().reset();
		                        }
						}	      		
		        	});
					}
				}
		});
		this.btnCancelar=new Ext.Button({
			iconCls:'cancelar',
			id:'cancelar'+self.id,
			text:labels.BtnCancelar,
			tooltip:labels.lbBtnCancelar,
			handler : function(){
				self.close();
				self.parent.tfBuscar.focus();
				self.parent.btnModificar.disable();
				self.parent.btnEliminar.disable();
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
		Ext.components.Evaluaciones.wAdicionar.superclass.initComponent.call(this);
	}
}
);
/***********************************************************************/
					///////// FORMULARIO ///////////////////////////
Ext.components.Evaluaciones.fpAsistencia=Ext.extend(Ext.form.FormPanel,{
	labelAlign: 'top',
	frame:true,	
	region:'center',
	width: 400,
	autoHeight:true,
	autoShow:true,
	initComponent: function(){
		var self=this;
		this.denominacion=new Ext.form.TextField({
			fieldLabel:labels.lbDenominacion,
			name: 'denominacion',
			id:'denominacion'+self.id,
			nextTab:'fechainicio'+self.id,
			anchor:'99%',	
			maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,   
			regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,      
			regexText:'Solo se admiten valores alfanuméricos', 
			allowBlank:false,
			maxLength:250,
			blankText:labels.lbCampoVacio	
		});
		this.fechaI=new Ext.form.DateField({
			fieldLabel:labels.lbFechaInicio, 
			name: 'fechainicio',
			emptyText:'Seleccione',
			id:'fechainicio'+self.id,
			prevTab:'denominacion'+self.id,
			nextTab:'fehcafin'+self.id,
			allowBlank:false,
			maxText : labels.lbFechaMaxima,
			minText : labels.lbFechaMinima,
			endDateField:'fehcafin'+self.id,
			hiddenname:'fechaI',
			anchor:'99%',
			format:'d/m/Y',
			readOnly : false,
			msgTarget: 'qtip',
			invalidText: labels.invalidTextFecha, 
			vtype:'daterange',
		});
		this.fechaF=new Ext.form.DateField({
			fieldLabel:labels.lbFechaFin, 
			name: 'fechafin',
			emptyText:'Seleccione',
			id: 'fehcafin'+self.id,
			prevTab:'fechainicio'+self.id,
			nextTab:'descripcion'+self.id,
			maxText : labels.lbFechaMaxima,
			minText : labels.lbFechaMinima,
			stratDateField:'fechainicio'+self.id,
			hiddenname:'fechaF',
			anchor:'99%',
			format:'d/m/Y',
			readOnly : false,
			msgTarget: 'qtip',
			invalidText: labels.invalidTextFecha, 
			vtype:'daterange',
			listeners:{change: function(tf, n,o){cambio = 1;}},
		});

		this.descripcion=new Ext.form.TextArea({
			fieldLabel:labels.lbDescripcion,
			name: 'descripcion',
			id:'descripcion'+self.id,
			prevTab:'fehcafin'+self.id,
			anchor:'99%',
			maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,   
			regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,      
			regexText:'Solo se admiten valores alfanuméricos', 
			maxLength:250
		});

		this.items=[this.denominacion,
		{
    		layout:'column',
			items:[{
			columnWidth:.5,
			layout: 'form',
			items:[this.fechaI]
			},{
			columnWidth:.5,			
			layout: 'form',
			items: [this.fechaF]
			}]
		},
		this.descripcion];
		Ext.components.Evaluaciones.fpAsistencia.superclass.initComponent.call(this);	
	}
}
);

function cargarInterfaz(){   

	labels = arguments[1];
	
	var gpEstadoDesarrollo= new Ext.components.Evaluaciones.gpEstadoDesarrollo({
		height:'100%',
		width:'100%',
		margins:'5 5 5 5',
	});

	var viewport=new Ext.Viewport({
		layout:'border',
		items:[gpEstadoDesarrollo]
	});
};

