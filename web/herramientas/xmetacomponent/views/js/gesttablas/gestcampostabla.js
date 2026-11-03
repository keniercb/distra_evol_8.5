UCID.portal.cargarEtiquetas('gesttablas', cargarInterfaz);
function  cargarInterfaz(perfil, etiquetas){
var check=false;

//Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
Ext.apply(Ext.form.VTypes, {
	daterange : function(val, field) {
	    var date = field.parseDate(val);
	
	    if(!date){
	        return;
	    }
	    if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
	        var start = Ext.getCmp(field.startDateField);
	        start.setMaxValue(date);
	        start.validate();
	        this.dateRangeMax = date;
	    } 
	    else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
	        var end = Ext.getCmp(field.endDateField);
	        end.setMinValue(date);
	        end.validate();
	        this.dateRangeMin = date;
	    }     
	    return true;
	}
});
// Store combo stGpGestCampos
	stCmbTipoDato =  new Ext.data.Store({
		url:'../gestcampos/cargartdatos',
		listeners:{'load':function(){smGpGestCampos.selectFirstRow();}},
		reader:new Ext.data.JsonReader({
			totalProperty: "total",
			root: "data",
			id: "idtipodato"
			},[{name:'idtipodato'},{name:'denominacion'}]
		)
	});
// Store combo stCmbTabla
	stCmbTabla =  new Ext.data.Store({
		url:'cargarcmbtablas',
		reader:new Ext.data.JsonReader({
			root: "data",
			id: "idtabla"
			},[{name:'idtabla'},{name:'tabla'}]
		)
	});
	stValueDisplay =  new Ext.data.Store({
		url:'../gestcampos/cargarcampostabla',
		listeners:{load:function(st,rcs){
			winAddCampos.el.unmask();
			if (rcs.length<=0){
				mostrarMensaje(1,etiquetas.msgVerificar,function(){Ext.getCmp('cmbtabla').reset();});
				Ext.getCmp('cmbcampovf').reset();
				Ext.getCmp('cmbcampodf').reset();
				Ext.getCmp('cmbcampovf').disable();
				Ext.getCmp('ccmbcampovf').hide();
				Ext.getCmp('cmbcampodf').disable();
			}else{
				Ext.getCmp('ccmbcampovf').show();
				Ext.getCmp('cmbcampodf').enable();
				Ext.getCmp('ccmbcampodf').show();
				
				var index  = st.find('llave_primaria',1);
				var record = st.getAt(index);
				Ext.getCmp('cmbcampovf').setValue(record.data.idcampo);
				Ext.getCmp('cmbcampovf').fireEvent('select',Ext.getCmp('cmbcampovf'),record,index);
				winAddCampos.doLayout();
			}
		}},
		reader:new Ext.data.JsonReader({
			root: "data",
			id: "idcampo"
			},[{name:'idcampo'},{name:'denominacion'},{name:'llave_primaria'}]
		)
	});
// formulario fpCampos
	fpCampos = new Ext.FormPanel({
		labelAlign: 'top',
		frame:true,
		id:'fpCampos',
		autoHeight:true,
		bodyStyle:'padding:5px 5px 0',
		reader:new Ext.data.JsonReader({
			totalProperty: "total",
			root: "data",
			id: "idcampo"
			},[{name:'idcampo'},{name:'denominacion'},{name:'tdato'},{name:'longitud'}]
		),
		items: [{
			layout:'column',
			items:[{
				columnWidth:0.33,
				layout: 'form',
				items: [{
					xtype:'textfield',
					fieldLabel: etiquetas.textdenominacion,
					id:'denominacion',
					enableKeyEvents:true,
					vtype:'alphanum',
					anchor:'95%',
                    allowBlank:false,
                    minLength: 1,
                    maxLength:30
                    //regex:/^([a-z]+ ?[A-Z]*)|([0-9]+ ?[0-9]*)| ([a-z]+ ?[A-Z]*)+([0-9]+ ?[0-9]*) + _*$/
				},{
					xtype: 'hidden',
					id: 'idcampo'
				}]
			},{
				columnWidth:0.33,
				layout: 'form',
				items: [{
                        displayField:'denominacion',
                        xtype:'combo',
						id:'tipo',
                        valueField:'idtipodato',
                        hiddenName: 'idtipodato',
                        triggerAction: 'all',
                        readOnly:true,
                        mode:'remote',
                        anchor:'95%',
						listeners:{select:function(cmb){
							LlenarFieldSet(cmb.getValue());
						}},
                        fieldLabel: etiquetas.textTipo,
			allowBlank:false,
                        editable: false,
                        store: stCmbTipoDato,
                        //allowBlank: false,
                        emptyText: etiquetas.textSelect
                    }]
			},{
				columnWidth:0.33,
				layout: 'form',
				items: [{
					xtype:'textfield',
					fieldLabel: etiquetas.textEtiqueta,
					id:'etiqueta',
					anchor:'100%',
                    enableKeyEvents:true,
                    vtype:'alphanum',
                    allowBlank:false,
                    minLength:0,
                    maxLength:30
                    //regex:/^([a-z]+ ?[A-Z]*)|([0-9]+ ?[0-9]*)| ([a-z]+ ?[A-Z]*)+([0-9]+ ?[0-9]*) +$/
				}]
			},{ 
				columnWidth:.33,
				layout: 'form',
				items: [
					new Ext.form.Checkbox({
					boxLabel:etiquetas.textvalorenulos,
					id:'permite_nulo',
					hideLabel:true
					})
				]
			},{
                columnWidth:1,
                layout: 'form',
                items:new Ext.form.FieldSet({
					layout: 'column',
					title:'',
					id:'fs_fieldset',
					autoHeight:true,
					items:[{
						columnWidth:.33,
						id:'clongitud',
						hidden: true,
						layout: 'form',
						items: [{
							xtype:'numberfield',
							fieldLabel: etiquetas.textLongitud,
							id: 'longitud',
							maxLength:40,
							maskRe:/^([0-9]+ ?[0-9]*)+$/,
							regex:/^([0-9]+ ?[0-9]*)+$/,
							anchor:'95%'
						}, {
							layout: 'column',
							items:[{
									columnWidth:.5,
									id:'cdecimal',
									hidden: true,
									layout: 'form',
									items: [
											new Ext.form.Checkbox({
											fieldLabel: etiquetas.textdecimal,
											id:'decimales',
											//hideLabel:true,
											listeners:{'check':function(th,ch) {
													Ext.getCmp('cprecision').hide();
													if(ch)
														Ext.getCmp('cprecision').show();
												}}
											})]
									},{
									columnWidth:.5,
									id:'cprecision',
									hidden: true,
									layout: 'form',
									items: [{
												xtype:'numberfield',
												fieldLabel: etiquetas.textprecision,
												id: 'precision',
												maskRe:/^([0-9]+ ?[0-9]*)+$/,
												regex:/^([0-9]+ ?[0-9]*)+$/,
												width:70
											}]	
							}]
						}]
					},{ 
						columnWidth:.33,
						id: 'ccmbtabla',
						hidden: true,
						layout: 'form',
						items: [{
								xtype:'textfield',
								fieldLabel: etiquetas.textTabla,
								id:'tftabla',
								anchor:'95%',
								listeners:{
									focus:function() {
										winFp('Get');										
									}
								}
						},new Ext.form.Checkbox({
							boxLabel: etiquetas.textFiltado,
							id:'filtro',
							hideLabel:true
							})
						]
					},{ 
						columnWidth:.33,
						id: 'ccmbcampovf',
						hidden: true,
						layout: 'form',
						items: [{							
							displayField:'denominacion',
							valueField:'idcampo',
							hiddenName: 'idcampovf',
							id: 'cmbcampovf',
							fieldLabel: etiquetas.textValufield,
							xtype:'combo',
							triggerAction: 'all',
							readOnly:true,
							allowBlank:false,
							mode:'local',
							anchor:'95%',
							editable: false,
							store: stValueDisplay,
							emptyText: etiquetas.textSelect,
							listeners:{select:function(cmb,r,i){
								if(stValueDisplay.getCount()>1) 	Ext.getCmp('cmbcampodf').setValue(stValueDisplay.getAt((i-1<0)?i+1:i-1).data.denominacion);
								if(stValueDisplay.getCount()==1) 	Ext.getCmp('cmbcampodf').setValue(stValueDisplay.getAt(i).data.denominacion);
							}}
						}]
					},{ 
						columnWidth:.33,
						id: 'ccmbcampodf',
						hidden: true,
						layout: 'form',
						items: [{							
							displayField:'denominacion',
							valueField:'denominacion',
							hiddenName: 'idcampodf',
							id: 'cmbcampodf',
							fieldLabel: etiquetas.textDisplayField,
							xtype:'combo',
							triggerAction: 'all',
							readOnly:true,
							allowBlank:false,
							mode:'local',
							anchor:'95%',
							editable: false,
							store: stValueDisplay,
							emptyText: etiquetas.textSelect
						}]
					},{
						columnWidth:0.66,
						id: 'rgex',
						hidden: true,
						layout: 'form',
						items: [{
							displayField:'denominacion',
							xtype:'combo',
							id: 'expresion_regular',
							valueField:'idexpresionregular',
							triggerAction: 'all',
							readOnly:true,
							hiddenName: 'idexpresionregular',
							mode:'remote',
							anchor:'95%',
							//width:140,
							fieldLabel: etiquetas.textexpresionR,
							editable: false,
							store: stCmbRexExp,
							emptyText: etiquetas.textSelect
						}]
					},{
						columnWidth:0.33,
						id:'mini',
						hidden: true,
						layout: 'form',
						items: [{
							xtype:'numberfield',
							fieldLabel: etiquetas.textlimiteinferior,
							id:'limite_inferior',
							minValue: 0,
							anchor:'95%'
						}]
					},{
						columnWidth:0.33,
						id:'maxi',
						hidden: true,
						layout: 'form',
						items: [{
							xtype:'numberfield',
							fieldLabel: etiquetas.textLiniteSuperior,
							id:'limite_superior',
							minValue: 1,
							anchor:'95%'
						}]
					},{
						columnWidth:0.33,
						id:'fini',
						hidden: true,
						layout: 'form',
						items:new Ext.form.DateField({
							fieldLabel: etiquetas.textfechaIni,
							format:'d/m/Y',
							name: 'fecha_inicio',
							id:'fecha_inicio',
							anchor:'95%',
							vtype: 'daterange',
							endDateField: 'fecha_fin'
						})
					},{
						columnWidth:0.33,
						id:'ffin',
						hidden: true,
						layout: 'form',
						items: new Ext.form.DateField({
							fieldLabel: etiquetas.textfechafin,
							format:'d/m/Y',						               
							name: 'fecha_fin',
							id:'fecha_fin',
							vtype: 'daterange',
							startDateField: 'fecha_inicio',
							anchor:'95%',
							allowBlank:false
						})
					}]
				})
			}]
		}]
	});

	function LlenarFieldSet(op){
			Ext.getCmp('expresion_regular').disable();
			Ext.getCmp('rgex').hide();
			Ext.getCmp('expresion_regular').disable();
			Ext.getCmp('rgex').hide();
			Ext.getCmp('longitud').disable();
			Ext.getCmp('clongitud').hide();
			Ext.getCmp('cdecimal').hide();
			Ext.getCmp('decimales').hide();
			Ext.getCmp('limite_inferior').disable();
			Ext.getCmp('mini').hide();
			Ext.getCmp('limite_superior').disable();
			Ext.getCmp('maxi').hide();
			Ext.getCmp('longitud').disable();
			Ext.getCmp('clongitud').hide();
			Ext.getCmp('fecha_inicio').disable();
			Ext.getCmp('fini').hide();
			Ext.getCmp('fecha_fin').disable();
			Ext.getCmp('ffin').hide();
			Ext.getCmp('tftabla').disable();
			Ext.getCmp('ccmbtabla').hide();
			Ext.getCmp('filtro').disable();
			Ext.getCmp('filtro').hide();
			Ext.getCmp('cmbcampovf').disable();
			Ext.getCmp('ccmbcampovf').hide();
			Ext.getCmp('cmbcampodf').disable();
			Ext.getCmp('ccmbcampodf').hide();
		//	numero: 1  texto: 2  date: 3  chkbob: 4  nomenclador: 5 
			if(op==1){
				Ext.getCmp('maxi').show();
				Ext.getCmp('cdecimal').show();
				Ext.getCmp('limite_superior').enable();
				Ext.getCmp('mini').show();
				Ext.getCmp('decimales').show();
				Ext.getCmp('limite_inferior').enable();
				Ext.getCmp('clongitud').show();
				Ext.getCmp('longitud').enable();
			}
			if(op==2){
				Ext.getCmp('rgex').show();
				Ext.getCmp('expresion_regular').enable();
				Ext.getCmp('clongitud').show();
				Ext.getCmp('longitud').enable();
			}
			if(op==3){
				Ext.getCmp('fini').show();
				Ext.getCmp('fecha_inicio').enable();
				Ext.getCmp('ffin').show();
				Ext.getCmp('fecha_fin').enable();
			}
			if(op==5){
				Ext.getCmp('ccmbtabla').show();
				Ext.getCmp('tftabla').enable();
				Ext.getCmp('ccmbcampovf').show();
				Ext.getCmp('filtro').enable();
				Ext.getCmp('filtro').show();
			}
			if(op==6){
				Ext.getCmp('clongitud').show();
				Ext.getCmp('longitud').enable();
			}
		winAddCampos.doLayout();
		  /*
			*/
	}
// Ventanas para formulario winFpCampos(opcion)
	winFpCampos = function (opcion){
		switch(opcion){
			case 'Add':
				if(!winAddCampos){
                    
					winAddCampos = new Ext.Window({modal: true,closeAction:'hide',layout:'fit',
						title: etiquetas.textAdicionarCmp,width:650,autoHeight:true,
						buttons:[{iconCls:'cancelar',
								 	text: etiquetas.textCancelar,
									handler:function(){winAddCampos.hide();},
                                    tooltip:perfil.etiquetas.tooltipCancelarVen

								},{iconCls:'aplicar',
									text: etiquetas.textAplicar,
									handler:function(){adicionarCampos('apl');},
                                    tooltip:perfil.etiquetas.tooltipAplicarVen
								},{iconCls:'aceptar',
									text: etiquetas.textAceptar,
									handler:function(){adicionarCampos();},
                                	tooltip:perfil.etiquetas.tooltipAceptarVen
                                }
						]
					});
				}
				fpCampos.getForm().reset();
				LlenarFieldSet(-1);
				winAddCampos.show();
                                winAddCampos.add(fpCampos);
                Ext.getCmp('denominacion').focus(false,200);
				winAddCampos.doLayout();
			break;
		}
	}
	
	//stGpGestCampos.load({params:{start:0, limit:10}});
// function adicionarCampos
function adicionarCampos(apl){
    
    if (fpCampos.getForm().isValid()){
		
		if(Ext.getCmp('tipo').getValue() == 5)
			Ext.getCmp('cmbcampovf').enable();
		
		var filtrado = (Ext.getCmp('filtro').getValue() == true) ? 1 : 0;
		var decimal  = (Ext.getCmp('decimales').getValue() == true) ? 1 : 0;
		fpCampos.getForm().submit({
			url:'../gestcampos/adicionarcampos',
			params: {
				idtabla: gpTabla.getSelectionModel ().getSelected ().data.idtabla, 
				filtrado : filtrado,
				decimal  : decimal//,denominacion:'Campo 1',idexpresionregular:1/*,tipodato:1,llave_primaria:0,
																				 //secuencia:'0',permite_nulo:1,longitud:20
			},
			waitMsg: etiquetas.textAddcmp,
			success: function(form, action){                            
				if(action.result.cod == 1 || action.result.cod == 3){
					mostrarMensaje(action.result.codMsg,action.result.mensaje)
					fpCampos.getForm().reset(); 
					if(!apl)
						winAddCampos.hide();
					gpCampos.getStore().reload();
					btnModificar.disable();
					btnDelCampos.disable();
				}
			}
		});
	} else mostrarMensaje(6,etiquetas.textCmpObligatorio);
}
winFpCampos('Add');
}
