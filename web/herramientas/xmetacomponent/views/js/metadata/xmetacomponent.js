Ext.ns("Ucid");
var perfil = {dirImg:""};
Ucid.xmetacomponent= Ext.extend(Ext.grid.GridPanel,{
	
	 urlgridconfig:"",
	
	 urlformconfig:"",
		
	 sendData:{
		  url:""
		},		
		initComponent:function(){	
		   this.addEvents({
		    "formcreated":true
		   })
		  this.store = new Ext.data.Store();
            Ext.applyIf(this.sendData,{
			    params:{
			    "create":"create",
				"update":"update",
				"delete":"delete",
				"load":"load"	
						}
			});		
			this.dinamic;
			Ext.apply(this, {
				store:this.store,
				tbar:this.createToolbar(),
				loadMask:{store: this.store},
			    bbar:new Ext.PagingToolbar({
						pageSize: 10, 
						store: this.store, 
						displayInfo: true
				}),
				frame:true,  			   
				viewConfig: {forceFit: true},
				cm:new Ext.grid.ColumnModel({})
			});
			this.form_reader = new Ext.data.JsonReader();
			this.createForm();
			this.createWindow();
			this.winMetaCmp.add(this.form);
			Ucid.xmetacomponent.superclass.initComponent.apply(this, arguments);
		},
		
		onRender:function() {
		
		Ucid.xmetacomponent.superclass.onRender.apply(this, arguments);
		this.getSelectionModel().on('rowselect', function (smodel, rowIndex, keepExisting, record ){
				Ext.getCmp("btnUpd").enable();
				Ext.getCmp("btnDel").enable();
		}, this);
		//this.store.load({params:{start:0,limit:10}});

	   },
		
		createToolbar:function(){
			var tbar =[{
				text:'Ad<U>i</U>cionar',
				disabled:true,
				id:'btnAdd', 
				//icon:perfil.dirImg+'adicionar.png', 
				iconCls:'adicionar',
				listeners:{
					click:{
						scope:this,
						fn:this.onBtnAddClick
					}
				}					
			},{
				text:'Modificar',
				disabled:true,
				id:'btnUpd', 
				//icon:perfil.dirImg+'actualizar.png', 
				iconCls:'actualizar',
				listeners:{
					click:{
						scope:this,
						fn:this.onBtnModClick
					}
				}					
			},{
				text:'Eliminar',
				disabled:true,
				id:'btnDel', 
				//icon:perfil.dirImg+'eliminar.png', 
				iconCls:'eliminar',
				listeners:{
					click:{
						scope:this,
						fn:this.onBtnDelClick
					}
				}					
			}];
			 return tbar;
		},
		
		createForm:function(){			
			this.form = new Ext.FormPanel({
								labelAlign: 'top',
								frame:true,
		                        reader:this.form_reader,
								//height:114,
								autoHeight:true,
								//layout:"border",								
								bodyStyle:'padding:5px 5px 0'
								}); 
			if(this.optionalform){
				this.form.add(this.optionalform)
			}           
		},
		
		cargarconfform:function(){
			var params = this.base_params;
			this.fireEvent("beforeloadform",this,params)
				Ext.Ajax.request({
					url: this.urlformconfig,
					params:params,					
					callback:this.formConfigLoaded.createDelegate(this)
				});
		},
		
		formConfigLoaded : function(options,success,response){
				responseData = Ext.decode(response.responseText);
				if(responseData.cf){
					this.createDinamicColumn(responseData);							
				}
		},
		
		createDinamicColumn:function(data){
		    var h2 = 0,h3 = 0;;			
			if(this.dinamic){
				this.form.remove(this.dinamic,true);
			}
            this.dinamic = this.form.add({
                xtype:"panel",			   
				layout:"column",
				region:"center",				
				items:this.dameArrayItems(data.items)
			});	
            this.winMetaCmp.show(this);	
            /* se necesita cal
            *
            *
              */         		
			var h1 = this.form.getSize().height;
        	h2 = this.dinamic.getSize().height;			
			if(this.optionalform){
			    h3 = this.optionalform.getSize().height;
			}			
			this.form.setHeight(h1+h2+h3);
			this.fireEvent("formcreated",this,this.form);
			this.winMetaCmp.doLayout();			
		},
		
		dameArrayItems:function (objitems){
			     var len = objitems.length - 1;
				objitems[len].col = objitems[len].cantidad;
				for (var i=0;i<objitems[len].cantidad;i++){
					(objitems[i].xtype == 'hidden')?(objitems[len].col-=1):objitems[len]
				}
				var arrayItems = new Array();
				for (var i=0;i<objitems[len].cantidad;i++){
					arrayItems.push(this.dameColumn(objitems,objitems[len].col,i))
				}
				
				return arrayItems;
		},
		
		dameColumn:function (objitems,noCol,pos){
			if (noCol == 1) return {columnWidth:1,  layout: 'form',items:this.dameItemForm(objitems[pos])};
			if (noCol == 2) return {columnWidth:.5, layout: 'form',items:this.dameItemForm(objitems[pos])};
			return {columnWidth:.33,layout: 'form',items:this.dameItemForm(objitems[pos],pos)};
		},		
		
		dameItemForm:function (objitem,pos){
			 var p = {
					fieldLabel: "(objitem.fieldLabel)?objitem.fieldLabel:''",
					hideLabel:"(objitem.fieldLabel)?false:true",
					maxLength:"(objitem.maxLength)?objitem.maxLength:''",
					regex:"(objitem.regex)?eval(objitem.regex):''",
					anchor:"(objitem.anchor)?objitem.anchor:'95%'",
					allowBlank:"(objitem.allowBlank)?objitem.allowBlank:false",
					format:"(objitem.format)?objitem.format:'d/m/Y'",
					tabIndex:pos,
					readOnly:"(objitem.readOnly)?objitem.readOnly:false"
				};
			if (objitem.xtype == 'numberfield') 
				return {
					xtype:'numberfield',
					fieldLabel: eval(p.fieldLabel),
					hideLabel:eval(p.hideLabel),
					id: objitem.id,
					tabIndex:p.tabIndex,
					maxLength:objitem.maxLength,
					name:objitem.name,
					regex:(objitem.regex)?eval(objitem.regex):'',
					anchor:eval(p.anchor),
					allowBlank:eval(p.allowBlank),
					readOnly:eval(p.readOnly)
				};
			if (objitem.xtype == 'datefield')  	
				return {
					xtype:'datefield',
					fieldLabel: eval(p.fieldLabel),
					hideLabel:eval(p.hideLabel),
					id: objitem.id,
					tabIndex:p.tabIndex,
					name:objitem.name,
					format:eval(p.format),
					regex:(objitem.regex)?eval(objitem.regex):'',
					anchor:eval(p.anchor),
					allowBlank:eval(p.allowBlank),
					readOnly:eval(p.readOnly)
				};
			if (objitem.xtype == 'hidden')
				return {
					xtype:'hidden',
					id: objitem.id,
					name:objitem.name
				};
			if (objitem.xtype == 'combo')
				return {
					xtype:'combo',
					fieldLabel: eval(p.fieldLabel),
					hideLabel:eval(p.hideLabel),
					maxLength:objitem.maxLength,
					mode:'local',
					tabIndex:p.tabIndex,
					displayField:objitem['displayField'],
					triggerAction: 'all',
					hiddenName:objitem.id,
					emptyText:'[Seleccionar]',
					anchor:eval(p.anchor),
					allowBlank:eval(p.allowBlank),
					readOnly:eval(p.readOnly),
					valueField:objitem['displayField'],
					store:new Ext.data.JsonStore({fields:[objitem['displayField'],objitem['valueField']],data:objitem.data})
				};
			if(objitem.xtype == 'textfield')
                            return;
			return {
				xtype:'textfield',
				fieldLabel: eval(p.fieldLabel),
				hideLabel:eval(p.hideLabel),
				id: objitem.id,
				tabIndex:p.tabIndex,
				maxLength:objitem.maxLength,
				name:objitem.name,
				regex:eval(objitem.regex),
				anchor:eval(p.anchor),
				allowBlank:eval(p.allowBlank),
				readOnly:eval(p.readOnly)
			};
		},		
		
		cargarConfGrid:function (params){
			Ext.Ajax.request({
				url: this.urlgridconfig,				
				params:this.base_params || params,
				callback:this.configLoaded.createDelegate(this)
			});
		},
		
		configLoaded:function(options,success,response){		
					responseData = Ext.decode(response.responseText);
					if(responseData.cf){
						this.reconfigureGrid(responseData);
					}
					this.enableAdd();
					
		},
		
		reconfigureGrid:function(configuration){
			var stXmetaComponent =  new Ext.data.JsonStore({
					url:this.sendData.url,
					baseParams:{"comand":this.sendData["params"]["load"]},
					totalProperty: "total",
				    root: "data",
					fields:configuration.rd
			});
	    this.reconfigure(stXmetaComponent,new Ext.grid.ColumnModel(configuration.cm));
		var params ={start:0, limit:10};
		//params["comand"] = this.sendData["load"];
	    stXmetaComponent.load({params:params});
		},
		
		enableAdd:function(){		
			if(Ext.getCmp("btnAdd"))Ext.getCmp("btnAdd").enable();
		},
		
		enableMod:function(){		
			if(Ext.getCmp("btnUpd"))Ext.getCmp("btnUpd").enable();
		},
		
		enableDel:function(){		
			if(Ext.getCmp("btnDel"))Ext.getCmp("btnDel").enable();
		},
		
		onBtnAddClick:function(){
		    this.action = "create";
			this.cargarconfform();			
	    },
		
		onBtnModClick:function(){
		    var scope = this;
		    if(!this.action){
				this.action = "update";
				this.cargarconfform();
				this.on("formcreated",function(cmp,form){
				mostrarModificar();
				},this);
			}
			else{
			   mostrarModificar();
			}
			
			function mostrarModificar(){
				 scope.form.getForm().loadRecord(scope.getSelect());
				scope.winMetaCmp.show();
			}		    
		},
		
		onBtnDelClick:function(){
				mostrarMensaje(2,'¿Est� seguro que desea eliminar el dato seleccionado?',elimina);
				var scope = this;
				this.fireEvent()
				var params = {"comand":this.sendData["delete"]};
				this.fireEvent("beforedelete",this,params);
				function elimina(btnPresionado){
					if (btnPresionado == 'ok'){
						Ext.Ajax.request({
							url: scope.sendData.url,
							params:params,
							scope:this,
							callback: function (options,success,response){
									responseData = Ext.decode(response.responseText);
									if(responseData.codMsg == 1 || responseData.codMsg == 3){
										mostrarMensaje(responseData.codMsg,responseData.mensaje);
										this.getStore().reload();
										this.getSelectionModel().clearSelectionModel();
										Ext.getCmp("btnUpd").disable();
										Ext.getCmp("btnDel").disable();
									}
							}
						});
					}
				}
		},
		
		send:function(){
             var scope = this;
			 var comand = "";
			(this.action=="create")? comand = this.sendData.params["create"]:comand = this.sendData.params["update"]
			if (this.form.getForm().isValid()){
				this.form.getForm().submit({
					url:this.sendData.url,
					waitMsg:'Salvando datos ...',
					params:{comand:comand},
					failure: function(form, action){
						if(action.result.codMsg == 1 || action.result.codMsg == 3){
							mostrarMensaje(action.result.codMsg,action.result.mensaje)
							scope.form.getForm().reset(); 
							scope.getStore().reload();
							Ext.getCmp("btnUpd").disable()
							Ext.getCmp("btnDel").disable();
							scope.fireEvent("datasave",scope);
						}
					}
				});
			} 
			else mostrarMensaje(1,'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s)');
		},
		
		createWindow:function(){
			this.btnCancelar = new Ext.Button({
						          //icon:perfil.dirImg+'cancelar.png',
						          iconCls:'cancelar',
							      text:'Cancelar',
								  scope:this,
							      handler:function(){
								         this.winMetaCmp.hide();
								  }
								});
			this.btnAplicar = new Ext.Button({
								  //icon:perfil.dirImg+'aceptar.png',iconCls:'btn',
								  iconCls:'aplicar',
								  text:'Aplicar',
								  scope:this,
								  handler:function(){								      
									  this.send();
								  }
								});
			this.btnAceptar = new Ext.Button({
							      //icon:perfil.dirImg+'aceptar.png',
							      iconCls:'aceptar',
								  text:'Aceptar',
								  scope:this,
								  handler:function(){ 
									  this.send();
									  this.on("datasave",function(){this.winMetaCmp.hide();},this)
								  }
								})
				
			this.winMetaCmp = new Ext.Window({
						      modal: true,
						      closeAction:'hide',
						      layout:'fit',							  
						      title:'XmetaComponent',
						      width:500,
							  //height:500,
						      autoHeight:true,
						      buttons:[this.btnCancelar,this.btnAplicar,this.btnAceptar]
					});
		  
		},
		
		getSelect:function(multi){
		    var sm = this.getSelectionModel();
			if(!multi)	return sm.getSelected();
			else return sm.getSelections();
		}
});
