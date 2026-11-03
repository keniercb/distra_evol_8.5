Ext.ns("Ucid");

Ucid.dinamicForm = Ext.extend(Ext.Panel, {

				initComponent : function() {
				Ext.apply(this, {
							layout : "column",
							 padding: '0.5px',
							 autoHeight : true
						});
				Ucid.dinamicForm.superclass.initComponent.apply(this, arguments);
			},
			configureColumn:function(noCol,element){
				var columnWidth = (noCol > 0) ? '.' + 100/noCol : 1;
				return {
					columnWidth:columnWidth,
					layout: 'form',
					labelAlign:"top",
					padding: '10px',
					items:element
				}
					
			},
			hasConfig:function(){
				return (this.cantidad!=0);
			},
			
			getArrayItems : function(col) {
				var items = this.config.items;
				var len = items.length - 1;
				var cantidad = items.length;
				this.cantidad = cantidad;
				for (var i = 0 ;i < cantidad ; i++){
					if(items[i].xtype != "hidden"){
					if(items[i].store) 
						items[i].store = Ext.decode(items[i].store);
					if(items[i].xtype == "textarea"){
							this.add(this.configureColumn(1,items[i]));
						}
					else {
							this.add(this.configureColumn(col,items[i]));
						}
					}
				}
			}
		});
		

Ucid.Metadatos = function() {
	var EVENT_MANAGER =new  Ext.util.Observable();
	EVENT_MANAGER.addEvents({"configloaded":true});
	EVENT_MANAGER.addEvents({"gridconfigloaded":true});
	return {
		on:function(event,func,scope){
			EVENT_MANAGER.on(event,func,scope);
		},
		genUserInterfacesFromUrl : function(url,params) {
			this.loadFormConfig(url,params);
			var form ;
			EVENT_MANAGER.on("configloaded",function(config){
				form = new Ucid.dinamicForm({config:config});
				this.form = form ;
			},this)
			return {
				config : function(columnC) {
					EVENT_MANAGER.on("configloaded",function(){
						if(columnC.cantColumns)
							form.getArrayItems(columnC.cantColumns);
							
						return form;
					},this)
				}
			}
		},
		addTo : function(tocomponent) {
			EVENT_MANAGER.on("configloaded",function(){
				tocomponent.add(this.form);
				tocomponent.hasConfig = this.form.hasConfig();
			},this);
		},
		loadFormConfig : function(config_url,params) {
			this.loadMask("Cargando la configuración..")
			Ext.Ajax.request({
						url : config_url,
                                                params:params,
						callback : this.formConfigLoaded.createDelegate(this)
					});
		},

		formConfigLoaded : function(options, success, response) {
			var responseData = Ext.decode(response.responseText);
			if (responseData.items){
				Ext.apply(responseData,{
					config:true	
				});
				this.hideMask();
				EVENT_MANAGER.fireEvent("configloaded",responseData);
			}
		},
		
		loadGridConfig:function(config_url,params){
			this.loadMask("Cargando la configuración..")
			Ext.Ajax.request({
						url : config_url,
						params:params,
                                                callback : this.gridConfigLoaded.createDelegate(this)
					});
			var scope = this;
					return {
						insert_into:function(gridp){
							EVENT_MANAGER.on("gridconfigloaded",function(record,column){
								scope.reconfigureGrid(gridp,record,column);
							},scope)
						}
					}
		},
		gridConfigLoaded : function(options, success, response) {
			this.hideMask();
			var responseData = Ext.decode(response.responseText);
			for (var index = 0; index < responseData.cm.length; index++) {
                	if (responseData.cm[index].header=='Formato') {
                		responseData.cm[index].hidden=true;
                	}
                }
			EVENT_MANAGER.fireEvent("gridconfigloaded",responseData.rd,responseData.cm);
		},
		 loadMask : function(msj,cmp) {
			var componente = (!cmp) ? Ext.getBody() : cmp.body;
			this.lMask = new Ext.LoadMask(componente,{msg:msj});
			this.lMask.show();
 		},
 
 		hideMask : function() {
			this.lMask.hide();
 		},
		reconfigureGrid:function(gridp,rd,cm1){
                        var st = gridp.getStore();
			var fields = [] ;

			Ext.each(rd,function(rec){
				fields.push(rec);
			})
			var cm = gridp.getColumnModel();
			var ColModel = [];

			Ext.each(cm1,function(rec){
				ColModel.push(rec);
			});
			
			var resultado = new Array();
			resultado.push(fields);
			resultado.push(ColModel);
			reconfgrid(resultado);
		}

	}
};

