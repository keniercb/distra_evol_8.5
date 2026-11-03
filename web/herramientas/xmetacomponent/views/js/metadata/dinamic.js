
var perfil = window.parent.UCID.portal.perfil;
	perfil.etiquetas = {};
Ext.onReady(function(){
    var a = new Ext.Panel({
                    layout:"form",				
				    region:"north",				
				    items:[{
					    xtype:"textfield",
					    fieldLabel:"Insert"
				    }]
			    })
	var incidencia = new Ucid.xmetacomponent({
	    //optionalform:a,
		urlgridconfig:"cargargrid",		
		urlformconfig:"formconfig",
		sendData:{
			url:"crud",
		}
	});
	
	var combo = new Ext.form.ComboBox({
		  xtype:'combo',
			emptyText: 'Seleccione ...',
			displayField:'denom',
			valueField:'idtipo',
			hiddenName: 'idtipo',
			triggerAction: 'all',
			readOnly:true,
			mode:'remote',
			anchor:'95%',
			editable: false,
			listeners:{
				 select:function(cb){
					    incidencia.base_params = {tipo:cb.getValue()};
						incidencia.cargarConfGrid();
				}
			},
			store:new Ext.data.JsonStore({
								url:'cargartipo',
					      totalProperty: "total",
			          root: "data",
			          id: "idtipo",
							  fields:[{name:'idtipo'},{name:'denom'}]
		})
	});
	
	
	vpIncidencia = new Ext.Viewport({
		layout:'fit',
		
		items:new Ext.Panel({
			tbar:[{
				xtype:'tbtext', 
				text:'Tipo de incidencia: '
			},combo],
			layout:'fit',
			items:incidencia			
		})
	});
})