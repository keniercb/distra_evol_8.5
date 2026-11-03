//var perfil = window.parent.UCID.portal.perfil;
UCID.portal.cargarEtiquetas('gesttablas', cargarInterface);
function cargarInterface(perfil,etiquetas){
// Botones btnAddRelaciones btnDelRelaciones btnAyuda
	btnAddRelaciones = new Ext.Button({handler:function(){winFpRelaciones('Add'); }, text:etiquetas.textAdicionar, disabled:false,id:'btnAddRel', iconCls:'adicionar',tooltip: etiquetas.tootipAdicionarRelacion});
	btnDelRelaciones = new Ext.Button({handler:function(){eliminarRelacion();}, text: etiquetas.textEliminar,disabled:true,id:'btnEliRel', iconCls:'eliminar',tooltip: etiquetas.tooltipEliminar});
	btnAyuda = new Ext.Button({handler:function(){}, text: etiquetas.textAyuda, id:'btnAyuRel', /*icon:perfil.dirImg+'ayuda.png', */iconCls:'ayuda'});
	var cmbDisplayField = null;	
// Store grid stGpGestRelacion
	stGpGestRelacion =  new Ext.data.Store({
		url:'cargarrelaciones',
		listeners:{'load':function(){smGpGestRelacion.selectFirstRow();}},
		reader:new Ext.data.JsonReader({
			totalProperty: "total",
			root: "data"
			},[{name:'idcorigen'},
			   {name:'torigen'},
			   {name:'campoorigen'},
			   {name:'idcdestino'},
			   {name:'tdestino'},
			   {name:'campodestino'},
			   {name:'eliminarcascada'},
			   {name:'actualizarcascada'}] //prueba
		)
	});
	
//Store combo Torigen
	stCmbTorigen =  new Ext.data.Store({
		url:'cargarcmbtablas',
		reader:new Ext.data.JsonReader({
			totalProperty: "total",
			root: "data",
			id: "idtabla"
			},[{name:'idtabla'},{name:'tabla'}]
		)
	});
	
	stCmTipoComponente = new Ext.data.Store({
			url:'cargarcmbtiposcompuestos',
			autoLoad:true,
			reader:new Ext.data.JsonReader({
					//totalProperty:'',
					root:'datos',
					id:'idtipocomponentecompuesto'
			},
			[
				{name:'idtipocomponentecompuesto'},
				{name:'denominacion'}
			]
		)
	});
//Store combo displayField stCmbDField
	stCmbDField =  new Ext.data.Store({
		url:'../gestcampos/cargarcmbcampos',		
		listeners: {
				load:function(st,rcs){
					winAddRelaciones.el.unmask();										
					addCmbDisplayField();																									
				}				
		},
		reader:new Ext.data.JsonReader({			
			root: "data",			
			id: "idcampo"
			},[{name:'idcampo'},{name:'denominacion'}]
		)
	});
	
	
	addCmbDisplayField = function(){
		if(!cmbDisplayField){
			cmbDisplayField = {
					fieldLabel: etiquetas.textCmpVisible,
					displayField:'denominacion',
					valueField:'denominacion',
					id:'cmbdisplayfield',
					hiddenName: 'displayfield',					
					xtype:'combo',					
					triggerAction: 'all',	
					editable:false,				
					mode:'local',
					anchor:'100%',					
					allowBlank: false,
					store: stCmbDField,					
					emptyText: etiquetas.textSelect
			}			
			fpRelacion.add(cmbDisplayField);
			fpRelacion.doLayout();
		}
	};
	
	rmCmbDisplayField = function(){
		if(cmbDisplayField){
			fpRelacion.remove(Ext.getCmp('cmbdisplayfield'),true);
			cmbDisplayField = null;
			fpRelacion.doLayout();
		}
	};
//Store combo campo origen stCmbCorigen
	stCmbCorigen =  new Ext.data.Store({
		url:'../gestcampos/cargarcmbcampos',
                listeners:{load:function(st,rcs){
                        Ext.getCmp('cmbcampoo').reset();
			winAddRelaciones.el.unmask();
			if (rcs.length<=0){
				mostrarMensaje(1,etiquetas.msgconfirmacion);
                                Ext.getCmp('cmbcampoo').disable();
            }else{
				//Ext.getCmp('cmbcampoo').enable();
				Ext.getCmp('cmbcampoo').setValue(stCmbCorigen.getAt(stCmbCorigen.find('llaveprimaria',1)).data.idcampo);
			}
		}},
		reader:new Ext.data.JsonReader({
			totalProperty: "total",
			root: "data",
			id: "idcampo"
			},[{name:'idcampo'},{name:'denominacion'},{name:'llaveprimaria'}]
		)
	});
// formulario fpRelacion
	fpRelacion = new Ext.FormPanel({
		labelAlign: 'top',
		frame:true,
        autoHeight:true,
		bodyStyle:'padding:5px 5px 0',
		items: [{
				columnWidth:0.33,
				layout: 'form',
				items: [{
					fieldLabel: etiquetas.textTablaOrigen,
					displayField:'tabla',
					valueField:'idtabla',
					id:'cmbtablaorigen',
					hiddenName: 'torigen',
					xtype:'combo',
					triggerAction: 'all',
					readOnly:true,
					listeners:{select:function(cmb){
							stCmbCorigen.reload({params:{idtabla: Ext.getCmp('cmbtablaorigen').getValue()}});														
							Ext.getCmp('checkboxEsVisible').reset();
							Ext.getCmp('cmbcampoo').reset();
							Ext.getCmp('cbtipocomponente').reset();							
							Ext.getCmp('checkboxEsVisible').enable();
							Ext.getCmp('cmbcampoo').disable();														
							rmCmbDisplayField();
							winAddRelaciones.el.mask(' Por favor espere ... ');
					}},
					mode:'remote',
					anchor:'100%',
					editable: false,
					allowBlank: false,
					store: stCmbTorigen,
					emptyText: etiquetas.textSelect
				},{
					fieldLabel: etiquetas.textCmpOrigen,
					displayField:'denominacion',
					valueField:'idcampo',
					id:'cmbcampoo',
					hiddenName: 'idcorigen',
					disabled:true,
					xtype:'combo',
					triggerAction: 'all',
					readOnly:true,
					mode:'local',
					anchor:'100%',
					editable: false,
					allowBlank: false,
					store: stCmbCorigen,
					emptyText: etiquetas.textSelect
				},{
					layout: 'column',
					items:[{
							columnWidth: .3,
							layout:"form",
							items:[{
								hideLabel: true,
								boxLabel: etiquetas.textIsVisible,
								xtype:'checkbox',
								id:'checkboxEsVisible',
								disabled:true,
								listeners:{check:function(checkbox,newvalue){
									if(!newvalue){		
										Ext.getCmp('cbtipocomponente').reset();								
										Ext.getCmp('cbtipocomponente').disable();										
										rmCmbDisplayField();										
									}
									else 
										Ext.getCmp('cbtipocomponente').enable();
								}}
							}]
						},{
							layout:"form",
							columnWidth: .7,
							items:[{
								xtype: 'combo',
								hideLabel: true,
								anchor:'100%',
								displayField:'denominacion',
								valueField:'idtipocomponentecompuesto',
								id:'cbtipocomponente',
								hiddenName: 'idtipocomponentecompuesto',
								triggerAction: 'all',
								mode:'local',
								editable: false,
								disabled: true,
								allowBlank: false,
								store: stCmTipoComponente,
								listeners:{
									select:function(cmb){										
										if(cmb.getValue() == 3){
											winAddRelaciones.el.mask(etiquetas.textCargando);
											stCmbDField.load({
												params:{idtabla: Ext.getCmp('cmbtablaorigen').getValue()}
											});												
										}
										else{
											rmCmbDisplayField();
										}
								}},
								emptyText: etiquetas.textSelect							
							}]
						}]
				}]
			
		}]
	});
// Selection Model grid smGpGestRelacion
	smGpGestRelacion = new Ext.grid.RowSelectionModel({singleSelect:true});
// Grid gestion gpRelacion
	gpRelacion = new Ext.grid.GridPanel({
		frame:true,
		autoExpandColumn:'expandir',
		store:stGpGestRelacion,
		margins:'2 2 2 -4',
		sm:smGpGestRelacion,
		columns:[
			{hidden:true, hideable: false, dataIndex: 'idtorigen'},
			{hidden:true, hideable: false, dataIndex: 'idtdestino'},
			{id:'expandir',header: etiquetas.textTablaOrigen, width:100, dataIndex: 'torigen'},
			{header: etiquetas.textTablaDestino, width:100, dataIndex: 'tdestino'},
			{header: etiquetas.textCmpOrigen, width:90, dataIndex: 'campoorigen'},
			{header: etiquetas.textCmpDestino, width:90, dataIndex: 'campodestino'},
			{header: etiquetas.textUdateCascade, width:110, dataIndex: 'actualizarcascada'},
                        {header: etiquetas.textDeleteCascade, width:100, dataIndex: 'eliminarcascada'}],
		loadMask:{store: stGpGestRelacion},
		tbar:[btnAddRelaciones, btnDelRelaciones],
        keys:[
            {
                key: 'i',
                alt: true,
                ctrl: false,
                shift: false,
                handler: function(k, e) {
                    winFpRelaciones('Add');
                }
            },
            {
                key: 46,
                alt: false,
                ctrl: false,
                shift: false,
                handler: function(k, e) {
                    eliminarRelacion();
                }
            }

        ]

	});

// Ventana para el grid de gestion de relaciones

winRelaciones = new Ext.Window({
	title: etiquetas.textGestrelaciones,
	layout:'fit',
	width:680,
	height:260,
	modal:true,
	items:gpRelacion,
        listeners:{show:function(){
            gpRelacion.getStore().baseParams.idtabla = gpTabla.getSelectionModel().getSelected().data.idtabla;
            gpRelacion.getStore().reload();
        }},
	closeAction:'hide'
});
winRelaciones.show('gestrelaciones');
// Evento Selection Model grid rowselect
	gpRelacion.getSelectionModel().on('rowselect', function (smodel, rowIndex, keepExisting, record ){
		btnDelRelaciones.enable();
	}, this);
// Ventanas para formulario winFpRelaciones(opcion)
	function winFpRelaciones(opcion){
		switch(opcion){
			case 'Add':{
				if(!winAddRelaciones){
					winAddRelaciones = new Ext.Window({modal: true,closeAction:'hide',layout:'fit',
						title: etiquetas.textAdicionarRelacion,width:400,autoHeight:true,
						buttons:[
                                {
                                    //icon:perfil.dirImg+'cancelar.png',
                                    iconCls:'cancelar',
                                    text: etiquetas.textCancelar,
                                    handler:function(){
                                        winAddRelaciones.hide();
                                    },
                                    tooltip:perfil.etiquetas.tooltipCancelarVen
                                },{
                                    //icon:perfil.dirImg+'aplicar.png',
                                    iconCls:'aplicar',
                                    text: etiquetas.textAplicar,
                                    handler:function(){
                                        adicionarRelacion(true);
                                    },
                                    tooltip:perfil.etiquetas.tooltipAplicarVen
                                },{
                                    //icon:perfil.dirImg+'aceptar.png',
                                    iconCls:'aceptar',
                                    text: etiquetas.textAceptar,

                                    handler:function(){adicionarRelacion(false);},
                                    tooltip:perfil.etiquetas.tooltipAceptarVen
                                }
						]
					});
				}
				fpRelacion.getForm().reset();
				Ext.getCmp('checkboxEsVisible').disable();
				winAddRelaciones.show();
				winAddRelaciones.add(fpRelacion);
				winAddRelaciones.doLayout();
			}break;
		}
	}
// function adicionarRelacion
function adicionarRelacion(apl){
	if (fpRelacion.getForm().isValid()){
		Ext.getCmp('cmbcampoo').enable();
		fpRelacion.getForm().submit({
			url:'adicionarrelacion',
            params:{idtdestino:gpTabla.getSelectionModel().getSelected().data.idtabla},            
			//waitMsg:' Por favor espere ... ',			
			failure: function(form, action){
				if(action.result.codMsg == 1 || action.result.codMsg == 3){
					Ext.getCmp('cmbcampoo').disable();
					mostrarMensaje(action.result.codMsg,action.result.mensaje)
					fpRelacion.getForm().reset(); 
					if(!apl) winAddRelaciones.hide();
					gpRelacion.getStore().reload();
					btnDelRelaciones.disable();
				}
			}
		});
	} else mostrarMensaje(6,etiquetas.msgCmpOblegatorio);
}
// function eliminarRelacion
function eliminarRelacion(){
	mostrarMensaje(2,etiquetas.msgConfirmSelect,elimina);
	function elimina(btnPresionado){        
		if (btnPresionado == 'ok'){
			Ext.Ajax.request({
				url: 'eliminarrelacion',
				params:{idcdestino:gpRelacion.getSelectionModel().getSelected().data.idcdestino},
				callback: function (options,success,response){
						responseData = Ext.decode(response.responseText);
						if(responseData.codMsg == 1 || responseData.codMsg == 3){
							mostrarMensaje(responseData.codMsg,responseData.mensaje);
							gpRelacion.getStore().reload();
							btnDelRelaciones.disable();
						}
				}
			});
		}
	}
}
}