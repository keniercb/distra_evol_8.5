Ext.ns("Ext.competencia");
Ext.QuickTips.init();
//******************Global***************************************************************
var idcomptencia;
//******************Global***************************************************************
Ext.competencia.ValorEscala=Ext.extend(Ext.grid.GridPanel,{
	region:'center',
	frame:true,	
	split:true,			
	stripeRows:true,
	autoExpandColumn:'dec',
	initComponent:function(){
		var self=this;
		this.cm=new Ext.grid.ColumnModel([	
			new Ext.grid.RowNumberer(),						
			{header:'Valor de la escala',dataIndex:'valor',sortable:true},			
			{id: 'dec',header:'Descripcion',dataIndex:'descripcion',sortable:true},			
		]);
		this.store = new Ext.data.SimpleStore({
			fields:[				
				{name:'valor'},				
				{name:'descripcion'},
			]
		});	
		this.btnSave=new Ext.Button({
			id:self.id+'sav',
			text:labels.lbBtnGuardar,
			iconCls:'guardar',
			tooltip:labels.lbToolTipGuardar,
			disabled:true,
			handler:function(){				
			}
		});
		this.keys=[
/*alt-g*/	{
	        	key: 'g',
	        	alt:true,
	        	fn: function(){/*self.btnSave.handler();*/alert('guardando');}
			},
		]	
		this.tbar = [this.btnSave];
		this.pagina=new Ext.PagingToolbar({
			store:this.store,
			displayInfo:true,
			displayMsg:'{0} - {1} de {2} Valores de escala',
			emptyMsg:'No hay Datos Para Mostrar',
			pageSize:5
		});
		this.bbar=this.pagina;

		Ext.competencia.ValorEscala.superclass.initComponent.call(this);
	},
});

Ext.competencia.WinFormComp = Ext.extend(Ext.Window,{			
	resizable:false,
	modal:true,
	initComponent:function(){
		var self = this;
		
		var escala=new Ext.form.ComboBox({allowBlank:false,
			fieldLabel:'Escala',
			triggerAction:'all',
			forceSelection:true,
			editable:false,
			anchor:'100%',
			store:[],
		})

		var tfDenominacion = new Ext.form.TextField({
			fieldLabel:'Denominación de la clasificación',
			name:'denominacion',
			allowBlank:false,
			anchor:'100%'
		});
		var escala=new Ext.form.ComboBox({allowBlank:false,
			fieldLabel:'Escala',
			triggerAction:'all',
			forceSelection:true,
			editable:false,
			anchor:'100%',
			store:[],
		})
		var dfFechaInicio = new Ext.form.DateField({
			name:'fechainicio',			
			id:'fechainiciocc',			
			fieldLabel:'Fecha inicio',						
			anchor:'98%',
			allowBlank:false, 
			format:'d/m/Y',	
			value:new Date().format('d/m/Y'),
			vtype: 'daterange',
    	    endDateField: 'fechafincc'
		});
		var dfFechaFin = new Ext.form.DateField({
			name:'fechafin',
			id:'fechafincc',												
			fieldLabel:'Fecha fin',						
			anchor:'100%',
			format:'d/m/Y',						
			value:'',
			vtype: 'daterange',
        	startDateField: 'fechainiciocc',
		});
		var taDescripcion=new Ext.form.TextArea({
			name:'descripcion',
			fieldLabel:'Descripción de la clasificación',
			anchor:'100%',			 		
			height:90,
		});

		this.form = new Ext.form.FormPanel({			
			width:300,
			frame:true,
			region:'center',
			//split:true,
 			bodyStyle:'padding: 5px 5px 0',
 			border:false,
 			labelWidth: 80, //Con esto hacemos mas pequeñas las etiquetas
 			labelAlign :'top', 						
			items:[
            	tfDenominacion,escala,
				{
					layout:'column',
					items:[{
						columnWidth:.5,
						layout:'form',
						items:[dfFechaInicio]
					},{
						columnWidth:.5,
						layout:'form',
						items:[dfFechaFin]
					}]
				},taDescripcion
			]
		});		
		var ve=new Ext.competencia.ValorEscala({
			region:'east',
			width:500,
			height:278,			
			frame:true,
		});
		this.btnAdd=new Ext.Button({
			text:labels.lbBtnAplicar,			
			tooltip:labels.lbToolTipAceptar,
	        iconCls:'aplicar',
	         handler: this.accion =='add'? function(){
	        	if(self.form.getForm().isValid()){
		        	Ext.Ajax.request({
		        		//url:'adicionarCompetencia',
		        		params:{
		        			denominacion: tfDenominacion.getValue(),
		        			fechainicio:  dfFechaInicio.getRawValue(),
		        			fechafin:     dfFechaFin.getRawValue(),
		        			descripcion:  taDescripcion.getValue()
		        		},
		        		callback: function (options, success, response){
							PVD.ocultarMascara('idmskmodify');
							responseData = Ext.decode(response.responseText);
							if (responseData.exception == 1) {
	                        	Ext.MessageBox.show({
	                                title: 'Información',
	                            	buttons: Ext.MessageBox.OK,
	                                icon: Ext.MessageBox.INFO,
	                                //msg: labels.lbConceptoEnUso,
	                                fn: function() {
	                                	self.parent.parent.btnAdd.focus();
	                                }
	                            });
	                        }else {
	                        	self.close();
	                            mostrarMensaje(1, responseData.mensaje, function(btn){                            		
	                            	self.parent.store.reload();	
									self.parent.parent.btnUp.disable();
									self.parent.parent.btnDel.disable();
	                           	});
	                        }
							self.parent.parent.btnUp.disable();
							self.parent.parent.btnDel.disable();								
						},
		        	});	
				}
	        }: 	function(){
		        	if(self.form.getForm().isValid()){
		        		Ext.Ajax.request({
		        			//url:'modificarCompetencia',
		        			params:{
		        				idclasificacion:   idclasificacion,  
		        				denominacion: tfDenominacion.getValue(),
		        				fechainicio:  dfFechaInicio.getRawValue(),
		        				fechafin:     dfFechaFin.getRawValue(),
		        				descripcion:  taDescripcion.getValue()
		        			},
		        			callback: function (options, success, response){
								PVD.ocultarMascara('idmskmodify');
								responseData = Ext.decode(response.responseText);
								if (responseData.exception == 1) {
	                        		Ext.MessageBox.show({
	                                	title: 'Información',
	                            		buttons: Ext.MessageBox.OK,
	                                	icon: Ext.MessageBox.INFO,
	                                	//msg: labels.lbConceptoEnUso,
	                                	fn: function() {
	                                		self.parent.parent.btnAdd.focus();
	                                	}
	                            	});
	                        	}else {
	                        		self.close();
	                            	mostrarMensaje(1, responseData.mensaje, function(btn){                            		
	                            		self.parent.store.reload();	
										self.parent.parent.btnUp.disable();
										self.parent.parent.btnDel.disable();
	                           		});
	                        	}
								self.parent.parent.btnUp.disable();
								self.parent.parent.btnDel.disable();
							},
		        		});
		        	}
		        }    
		});
		this.btnAplicar = new Ext.Button({
			text:labels.lbBtnAplicar,			
			tooltip:labels.lbToolTipAplicar,
	        iconCls:'aplicar',
			hidden: this.accion == 'add' ? false : true,
			handler:function(){
				if(self.form.getForm().isValid()){
					Ext.Ajax.request({
		        		//url:'adicionarCompetencia',
		        		params:{
		        			denominacion: tfDenominacion.getValue(),
		        			fechainicio:  dfFechaInicio.getRawValue(),
		        			fechafin:     dfFechaFin.getRawValue(),
		        			descripcion:  taDescripcion.getValue()
		        		},
		        		success:function(response){	        			
							self.form.getForm().reset();
							tfDenominacion.focus(false, 300);
							self.parent.store.reload();	
						},
		        	});
				}
			} 
		});

		this.btnCnl=new Ext.Button({
			text:labels.lbBtnCancelar,
			tooltip:labels.lbToolTipCancelar,
	        iconCls:'cancelar',
			handler: function(){
				self.close();
				self.parent.parent.btnAdd.focus();
			}			
		});
		this.keys=[
/*alt-g*/	{
	        	key: 'g',
	        	alt:true,
	        	fn: function(){/*ve.btnSave.handler();*/alert('guardando');}
			},
		]
		this.buttons =[this.btnCnl,this.btnAplicar,this.btnAdd];
		this.items = [this.form, ve];

		Ext.competencia.WinFormComp.superclass.initComponent.call(this);
		this.on('show', function(){
			tfDenominacion.focus(false, 300);
		});
		this.on('destroy',function(){self.parent.parent.btnAdd.focus();});
	},
});

Ext.competencia.Grid_Competencia = Ext.extend(Ext.grid.GridPanel,{
	title:'Listado de competencias laborales',        
	region:'center',		
	split:true,			
	stripeRows:true,
	autoExpandColumn:'ec',	
	margins: '5 0 5 5',	 

	initComponent:function(){
		var self=this;

		var expander = new Ext.grid.RowExpander({
        	tpl : new Ext.Template(
           	 '<div><p><b>Nombre: </b>{nombre}</p><br><p><b>Descripcion: </b> <div style="white-space:normal">{descripcion}</div></p></div>'
        	)
    	});
		this.sm = new Ext.grid.RowSelectionModel({
			singleSelect:true,
			listeners:{
				rowselect:{
					fn:function(sm,index,record){
						idcomptencia=record.data.idcomptencia;
						var upd=document.getElementById(self.parent.id+'upd');
						var del=document.getElementById(self.parent.id+'del');
						if(upd!=undefined)
						Ext.getCmp(self.parent.id +'upd').enable();
						if(del!=undefined)
						Ext.getCmp(self.parent.id +'del').enable();						
					}

				}
			}
		});				 

		this.cm=new Ext.grid.ColumnModel([	
			new Ext.grid.RowNumberer(),			
			{header:'ID',hidden:true,dataIndex:'id',sortable:true},
			{id: 'ec', header:'Denominación de la competencia',dataIndex:'nombre',sortable:true},
			//{header:'Peso',width:45,dataIndex:'peso',sortable:true,},
			//{header:'Nivel basico',width:75,dataIndex:'nivel',sortable:true},			
			{header:'Fecha inicio',dataIndex:'finicio',sortable:true,},
			{header:'Fecha fin',dataIndex:'ffin',sortable:true,/*Ext.util.Format.dateRenderer('d-m-Y')*/},
			{header:'Descripcion',hidden:true,dataIndex:'descripcion',sortable:true},			
		]);		
		

		this.store = new Ext.data.JsonStore({
			//url:'getCompetencia',
			totalProperty:'total',
			root:'data',
			fields:[
				{name: 'idcomptencia'},
				{name:'nombre'},
				{name:'finicio',type:'date',dateFormat:'d-m-Y'},
				{name:'ffin',type:'date',dateFormat:'d-m-Y'},
				{name:'descripcion'},
			]
		});			
		this.pagina=new Ext.PagingToolbar({
			store:this.store,
			displayInfo:true,
			displayMsg:'{0} - {1} de {2} Competencias',
			emptyMsg:'No hay Datos Para Mostrar',
			pageSize:15
		});		
		this.pagina.on('beforechange',function(bar,params){
			self.parent.btnDel.disable();
			self.parent.btnUp.disable();			
		});					
		
		this.bbar = this.pagina;
		//this.store.load({params:{start:0,limit:15}});
		Ext.competencia.Grid_Competencia.superclass.initComponent.call(this);
		this.store.on('load',function(){
			self.parent.btnDel.disable();
			self.parent.btnUp.disable();			
			self.parent.btnAdd.focus();
		});
	},	
});

Ext.competencia.GestCompetencia = Ext.extend(Ext.Panel,{						
	layout:'border',
	gestionar:false,	

	initComponent:function(){
		var self=this;
		this.competence=new Ext.competencia.Grid_Competencia({
        	id:'ecompetencia', 
        	margins: '0 5 5 5',
        	gestionar: this.gestionar,
        	parent:self,          	
    	});
    
    	this.competence.getSelectionModel().addListener('selectionchange',function(sm){        
        	/*if (sm.hasSelection()) {	            
	        }
	        */
    	});		

    	//*************Buscar**********************
		var tfbuscar = new Ext.form.TextField({
			id:self.id+'tfbuscar',
			name:'tfbuscar',			
			allowBlank:true,
			anchor: '98%',
			fieldLabel: 'Denominación de la competencia',
			emptyText:'Criterio a buscar',
			regexp : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
			minLength: 3,
			enableKeyEvents: true, 
			listeners: {
				specialkey: function(t, e){ 
					if(e.keyCode == 13 && tfbuscar.isValid()){
						self.btnBuscar.handler();						
					} 
				}.createDelegate(this) 
			}
		});
		var dfFechaInicio = new Ext.form.DateField({
			name:'fechainicio',			
			//id:'fechainiciocc',			
			fieldLabel:'Fecha inicio',						
			anchor:'94%',			
			format:'d/m/Y',	
			enableKeyEvents: true, 
			listeners: {
				specialkey: function(t, e){ 
					if(e.keyCode == 13 && tfbuscar.isValid()){
						self.btnBuscar.handler();						
					} 
				}.createDelegate(this) 
			}
			//value:new Date().format('d/m/Y'),
			/*vtype: 'daterange',
    	    endDateField: 'fechafincc'*/
		});
		var dfFechaFin = new Ext.form.DateField({
			name:'fechafin',
			//id:'fechafincc',												
			fieldLabel:'Fecha fin',						
			anchor:'99%',
			format:'d/m/Y',						
			value:'',
			enableKeyEvents: true, 
			listeners: {
				specialkey: function(t, e){ 
					if(e.keyCode == 13 && tfbuscar.isValid()){
						self.btnBuscar.handler();						
					} 
				}.createDelegate(this) 
			}
			/*vtype: 'daterange',
        	startDateField: 'fechainiciocc',*/
		});
		this.btnBuscar=new Ext.Button({
			id:self.id+'buscar',
			text:labels.lbBtnBuscar,
			tooltip:labels.lbToolTipBuscar,
			iconCls:'buscar',
			handler : function() { 				
				if(tfbuscar.isValid()){
					self.competence.store.baseParams.denominacion = tfbuscar.getValue();
					self.competence.store.baseParams.fechainicio = dfFechaInicio .getRawValue();
					self.competence.store.baseParams.fechafin = dfFechaFin.getRawValue();
					self.competence.store.load({params:{start:0,limit:15}})					
				}
			}.createDelegate(this)
		});
		this.btnLimpiar=new Ext.Button({
			id:self.id+'lim',
			//hidden: !this.gestionar,
			tooltip:labels.lbToolTipLimpiar,
			text:labels.lbBtnLimpiar,
			iconCls:'limpiar',
			handler:function(){tfbuscar.setValue('');dfFechaFin.setValue('');dfFechaInicio.setValue(''); self.btnAdd.focus();}
		});
		//*************Buscar**********************
		//*************Botones*********************
		this.btnAdd=new Ext.Button({
			id:self.id+'add',
			hidden: !this.gestionar,
			tooltip:labels.lbToolTipAdicionar,
			text:labels.lbBtnAdicionar,
			iconCls:'adicionar',
			handler:function(){
				var win = new Ext.competencia.WinFormComp({
					title: 'Adicionar competencia',
					layout:'column',
					accion: 'add',
					parent:self.competence,
				});				
				win.show();				
			}
		});

		this.btnDel=new Ext.Button({
			id:self.id +'del',
			hidden: !this.gestionar,
			text:labels.lbBtnEliminar,
			tooltip:labels.lbToolTipEliminar,
			iconCls:'eliminar',
			disabled:true,
			handler:function(){
				Ext.Msg.show({
					title:'Confirmación',
					msg:'¿Está seguro que quiere eliminar la competencia seleccionada?',
					icon:Ext.Msg.QUESTION,
					buttons:Ext.Msg.OKCANCEL,
					fn:function(btn){
						if(btn =='ok'){
							//var seleccion=self.getSelectionModel().getSelected();
							PVD.mostrarMascara('idmskmodify', labels.lbMsgWait, "Eliminando clasificación de competencia...");        			
    						Ext.Ajax.request({
								//url:'eliminarCompetencia',		
								params:{								
									idcomptencia: idcomptencia//seleccion.data.idcomptencia
								},
								callback: function (options, success, response){
									PVD.ocultarMascara('idmskmodify');
									responseData = Ext.decode(response.responseText);
									if (responseData.exception == 1) {
                                		Ext.MessageBox.show({
                                    		title: 'Información',
                                    		buttons: Ext.MessageBox.OK,
                                    		icon: Ext.MessageBox.INFO,
                                    		//msg: labels.lbConceptoEnUso,
                                    		fn: function() {
                                        		self.btnAdd.focus();
                                    		}
                                		});
                            		}else {
			                            mostrarMensaje(1, responseData.mensaje, function(btn){
			                                self.competence.store.load({
			                                    params:{
			                                        limit:15,
			                                        start:0
			                                    },                                    
			                                });
			                            });
			                        }
									self.btnDel.disable();
									self.btnUp.disable();							
								},		
							});
						}//fin btn==ok
						self.focus();						
					}
				});
			}
		});

		this.btnUp=new Ext.Button({
			id:self.id+'upd',
			hidden: !this.gestionar,
			text:labels.lbBtnModificar,
			tooltip:labels.lbToolTipModificar,
			iconCls:'modificar',
			disabled:true,
			handler:function(){
				var win = new Ext.competencia.WinFormComp({
					title: 'Modificar competencia',
					layout:'column',
					accion: 'mod',
					parent:self.competence,
				});				
				win.show();
				
			}
		});

		this.btnHlp=new Ext.Button({
			id:self.id+'hlp',
			hidden: !this.gestionar,
			tooltip:labels.lbToolTipAyuda,
			text:labels.lbBtnAyuda,
			iconCls:'ayuda',
			handler:function(){
				alert('La funcion Ayuda esta en Construccion');
			}
		});
		//*************Botones*********************

    	this.tbar = [this.btnAdd,this.btnUp,this.btnDel,'->',this.btnHlp];
    	var pFiltros = new Ext.Panel({
        	layout: 'column',
        	cls: 'x-toolbar',
        	margins: '5 5 5 5',
        	frame:true,
        	defaults:{
            	layout:'form',
            	border:false,
            	labelAlign:'top',
            	buttonAlign:'right'
        	},
        	height:63,
        	autoShow:true,
	        region:'north',
	        items: [{
	            columnWidth:.3,
	            layout: 'form',
	            items:[tfbuscar]
	        },{
	        	columnWidth:.19,
	            layout: 'form',
	            items:[dfFechaInicio]
	        },{
	        	columnWidth:.18,
	            layout: 'form',
	            items:[dfFechaFin]
	        },{
	            layout:'form',
	            bodyStyle:'padding:19px 0 0 0;',
	            columnWidth:'35px',
	            items:[self.btnBuscar]
	        },{
	            layout:'form',
	            bodyStyle:'padding:19px 0 0 0;',
	            columnWidth:'35px',
	            items:[self.btnLimpiar]
	        }]
    	});
		this.items=[this.competence,pFiltros];
		this.keys=[
/*alt-i*/	{
	        	key: 'i',
	        	alt:true,
	        	fn: function(){self.btnAdd.handler();}
/*alt-m*/	},{
        		key: 'm',
		        alt:true,
		        fn: function(){
		            if(!self.btnUp.disabled ){
		                self.btnUp.handler();
		            }
		        }
/*DEL */	},{
		        key: 46,
		        fn: function(){
		            if(!self.btnDel.disabled ){
		                self.btnDel.handler();
		            }
		        }
/*alt-b*/	},{
		        key: 'b',
		        alt:true,
		        fn: function(){
		            if(!self.btnBuscar.disabled ){
		                self.btnBuscar.handler();
		            }
		        }
/*alt-l*/	},{
		        key: 'l',
		        alt:true,
		        fn: function(){
		            if(!self.btnLimpiar.disabled ){
		                self.btnLimpiar.handler();
		            }
		        }
/*alt-h*/	},{
		        key: 'h',
		        alt:true,
		        fn: function(){
		            self.btnHlp.handler();
		        }
    		},
    	];	
		
		Ext.competencia.GestCompetencia.superclass.initComponent.call(this);				
	},	
});
