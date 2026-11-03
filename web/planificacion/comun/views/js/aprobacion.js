//Workflow
Ext.menuAprob = {};
Ext.menuAprob.init = function(){	
	
	//forma inicial que va a tener el sub-menu  "Cambiar estado a"
	Ext.menuAprob.menuaprob= new Ext.menu.Menu({
		text: 'Por favor espere ...',
		//icon:perfil.dirImg  + 'abrirventana.png',
		iconCls:'abrirventana',
		id:'cargandomenu'
	});

	//definiendo  la  funci�n  que  actualiza  el  sub-menu  "Cambiar estado a"
	Ext.menuAprob.reload = function( errormessage, gridpanel, gridmenu, idelem, estadoaprob, menu){		
		if (menu=='') {	//No hay opciones para cambiar el estado	
			gridmenu.hide();
			mostrarMensaje(1, errormessage);			
		} 
		
		//si el menu no est� definido cargarlo
		if( menu==undefined ){
			Ext.menuAprob.menuaprob.removeAll();
			//poner mensaje de esperar mientras carga el menu
			Ext.menuAprob.menuaprob.add({
				text: 'Por favor espere ...',
				icon:perfil.dirImg  + '../grid/loading.gif',
				iconCls:'btn',
				id:'cargandomenu'
			});	
			
			//llamar de nuevo la funcion actual pero en el par�metro menu el json de estados
			Ext.Ajax.request({
				url: 'damemenuaprobacion',
				params:{ 
					idelem: idelem,
					idestadoi: estadoaprob
				},
				callback: function (options,success,response){
					responseData = Ext.decode(response.responseText);
                    if (responseData.codigo==3) {		
						mostrarMensaje(3, responseData.mensaje,function(){
						 gridmenu.hide();
						 gridpanel.getStore().reload();
						});	
					} else{				
					Ext.menuAprob.reload(
					    errormessage,
					    gridpanel,
						gridmenu,
						idelem, 
						estadoaprob,
						((responseData.data!=undefined && responseData.data.length>0)?responseData.data:'')  //estados a los que cabiar, ''  si no hay
					);}
				}
			});
			
		} else {
			Ext.menuAprob.menuaprob.removeAll();
			for( s=0; s<menu.length; s++)
				Ext.menuAprob.menuaprob.add({
					text: menu[s].text,
					//icon:perfil.dirImg  + '',
					iconCls:'btn',
					id: menu[s].id,
					handler : function(b){
						Ext.Ajax.request({
							url: 'cambiaestadoaprob',
							params:{ 
								idelem: idelem , 
								idestadof: b.id, 
								idestadoi: estadoaprob
							},
							callback: function (options,success,response){
								responseData = Ext.decode(response.responseText);
								mostrarMensaje(responseData.codigo, responseData.mensaje, function(){gridpanel.getStore().reload();});															
							}
						});
					}
				});
		}			
	}		
}