var perfil = window.parent.UCID.portal.perfil;
UCID.portal.cargarEtiquetas('gesttablas', cargarInterfaz);
	//perfil.etiquetas = {};
var btnAdicionar, btnModificar, btnEliminar, btnAyuda, btnImportar, btnBuscar, btnLimpiar, nameFilter;
var stGpGestTabla, smGpGestTabla, gpTabla, vpTabla, stSfTabla;
var sfTabla, sfCampo;
var fpTabla,winAdd,winMod,winImp,winObt,winRelaciones,winAddRelaciones,winAddCampos,gpTablasNomencladas;
// Etiquetas para copiar para el fichero de lenguaje y temporalmente colocadas

// function CargarInterfaz
function cargarInterfaz(perfil,etiquetas){
// Botones btnAdicionar btnModificar btnEliminar btnAyuda
    btnMenu = new Ext.Button({
        id: 'btnayudamenu', // icon:dirpropia+'abrir.png',//perfil.dirImg+'adicionar.png',
        iconCls: 'ayuda',
        text: '<b>'+etiquetas.textAyuda+'</b>',
        disabled: false,
        toolTip: 'Ayuda de Metadata',
        //icon: perfil.dirImg + 'ayuda.png',
        menu:
            new Ext.menu.Menu({
                id: 'mainMenu',
                items: [
                        {
                            handler: function() {
                                cargarAyuda();
                            }, text: etiquetas.textAyuda,
                            id: 'btnAyuRel',
                            //icon: perfil.dirImg + 'ayuda.png',
                            iconCls: 'ayuda',
                            tooltip: etiquetas.tooltipAyuda
                        },
                    {
                        text: etiquetas.textAcercaDe,
                        id: 'acercade',
                        //icon: perfil.dirImg  + 'info.png',
                        iconCls: 'info',
                        tooltip: etiquetas.tooltipAcercaDe,
                        handler: function() {

                            var uri = "herramientas/xmetacomponent";
                            acercaDe.show(uri);
                        }}
                    ]
            })

    });
	btnAdicionar = new Ext.Button({handler:function(){winFp('Add');}, text: etiquetas.textAdicionar, disabled:false,id:'btnAdd', /*icon:perfil.dirImg+'adicionar.png',*/ iconCls:'adicionar',tooltip:etiquetas.textToolTipadicionar});
	btnModificar = new Ext.Button({handler:function(){winFp('Mod');}, text: etiquetas.textModificar, disabled:true,id:'btnMod', /*icon:perfil.dirImg+'modificar.png',*/ iconCls:'modificar',tooltip:etiquetas.textToolTipMod});
	btnEliminar = new Ext.Button({handler:function(){eliminarTabla();}, text: etiquetas.textEliminar,disabled:true,id:'btnEli', /*icon:perfil.dirImg+'eliminar.png',*/ iconCls:'eliminar',tooltip:etiquetas.textToolTipDel});
	btnImportar = new Ext.Button({handler:function(){winFp('Imp');}, text: etiquetas.textImportarTabla,disabled:false,id:'btnImp', /*icon:perfil.dirImg+'importar.png',*/ iconCls:'importar',tooltip:etiquetas.textToolTipImp});
	btnAyuda = new Ext.Button({handler:function(){}, text: etiquetas.textAyuda, id:'btnAyu', /*icon:perfil.dirImg+'ayuda.png',*/ iconCls:'ayuda',tooltip:etiquetas.textToolTipHelp});
	btnBuscar = new Ext.Button({handler:function(){buscarEnviadoPorFiltro();}, text: etiquetas.textBuscar, disabled:false, id:'btnSrch', iconCls:'buscar', tooltip:etiquetas.textToolTipSearch});
	btnLimpiar = new Ext.Button({handler:function(){limpiarFiltro();}, text: etiquetas.textLimpiar, disabled:true, id:'btnSrch', iconCls:'limpiar', tooltip:etiquetas.textToolTipLimpiar});
// Botones btnAddCampos btnModificar btnDelCampos btnAyuda
	btnAddCampos = new Ext.Button({handler:function(){addCampos();}, text: etiquetas.textAdicionar, disabled:true,id:'btnAddCampos', /*icon:perfil.dirImg+'adicionar.png',*/ iconCls:'adicionar',tooltip:etiquetas.textToolTipadicionarCmp});
	btnDelCampos = new Ext.Button({handler:function(){eliminarCampos();}, text: etiquetas.textEliminar ,disabled:true,id:'btnEliRel', /*icon:perfil.dirImg+'eliminar.png',*/ iconCls:'eliminar',tooltip:etiquetas.textToolTipDelCmp});
	btnOrdCampos = new Ext.Button({handler:function(){mostrarWindowOrdCampos()}, text: etiquetas.textOrdenarCmp,disabled:false,id:'btnImp', /*icon:perfil.dirImg+'ajustar.png',*/ iconCls:'ajustar',tooltip:etiquetas.textToolTipOrdCmp});
	//this.storeReference = this.gridReference.getStore() || null;

    nameFilter = new Ext.form.TextField({
    		enableKeyEvents: true,
            
            filterId: 'search',
            emptyText: 'Tabla a buscar...',
            fieldLabel: 'Buscar',
            id: 'filtro-tabla',
            colWidth: .30,
            anchor: '90%',
            vtype: 'alphanum',
            vtypeText: 'Este campo solo admite n&uacute;meros, letras y el caracter gui&oacute;n bajo.',
            listeners:{
            	keyup: function(){
    				if(this.getValue() != "")
    					btnLimpiar.enable();
    				else
    					btnLimpiar.disable();
    			}
            }         
        });

    btnAyuda = new Ext.Button({
        handler:function(){
            cargarAyuda();
        },
        text: etiquetas.textAyuda,
        id:'btnAyuRel',
        //icon:perfil.dirImg+'ayuda.png',
        iconCls:'ayuda',
        tooltip:etiquetas.textToolTipHelp
        });

function addCampos(){
    if (!winAddCampos)
        importarJS('../../views/js/gesttablas/gestcampostabla.js');
  else {
       winFpCampos('Add');
  }
}

	btnGestRelaciones = new Ext.Button({
          handler:function(){
              gestRelaciones();
          },
            text: etiquetas.textGetionarRelasiones,
            disabled:false,
            id:'gestrelaciones',
            //icon:perfil.dirImg+'cambiosdecuenta.png',
            iconCls:'cambiosdecuenta',
            tooltip:etiquetas.textToolTipGes
        }
    );
/***	Store del combo con los esquemas	***/
stCmbSquemas = new Ext.data.Store({
	url: 'cargaresquemas',
	reader:new Ext.data.JsonReader({
		root:'data',
		id:'esquema',
		totalProperty:'totalRecords'
		},[{name: 'esquema'}]
	)
});

//Store para los prefijos
stCmbPrefijo = new Ext.data.Store({
	url: 'cargarprefijos',
	reader:new Ext.data.JsonReader({
		root:'data'
		},[{name: 'idprefijo'},{name: 'denominacion'}]
	)
});
// Store combo stCmbRexExp
	stCmbRexExp =  new Ext.data.Store({
		url:'cargarexpresiones',
		reader:new Ext.data.JsonReader({
			root: "data",
			id: "idexpresionregular"
			},[{name:'idexpresionregular'},{name:'denominacion'}]
		)
});
// formulario fpTabla
	fpTabla = new Ext.FormPanel({
		labelAlign: 'top',
		frame:true,
		autoHeight:true,
		bodyStyle:'padding:5px 5px 0',
		reader:new Ext.data.JsonReader({
			totalProperty: "total",
			root: "data",
			id: "idTabla"
			},[{name:'idtabla'},{name:'esquema'},{name:'tabla'},{name:'arbol'},{name:'importada'},{name:'alias'}]
		),
		items: [{
			layout:'column',
			items:[{
				columnWidth:.5,
				layout: 'form',
				items: [{
					xtype:'textfield',
					fieldLabel: etiquetas.textDenominacion,
					id:'tabla',
					anchor:'95%',
                                        allowBlank:false,
                                        minLength: 1,
                                        maxLength:30,
                                        maskRe:/^[a-zA-Z0-9_]$/,
                                        regex:/^([A-Za-z0-9_]*)+$/,
                                        regexText: etiquetas.textOnliCaracterEspecial+" _"

				},{
					xtype: 'hidden',
					id: 'idtabla'
				}]
			},{
				columnWidth:.5,
				layout: 'form',
				items: [{
					displayField:'esquema',
					xtype:'combo',
					valueField:'esquema',
					triggerAction: 'all',
					readOnly:true,
					mode:'remote',
					anchor:'95%',
					id: 'esquema',
					fieldLabel: etiquetas.textEsquema,
					editable: false,
					store: stCmbSquemas,
					emptyText: etiquetas.textSelect,
					allowBlank: false
				}]
			},{
				columnWidth:.5,
				layout: 'form',
				items: [{
					xtype:'textfield',
					fieldLabel: etiquetas.textAlias,
                                        regex:/^([A-Za-z0-9]*)+$/,
					id:'alias',
					anchor:'95%',
                                        allowBlank:false,
                                        minLength: 1,
                                        maxLength:30
				}]
			},{
				columnWidth:.5,
				layout: 'form',
				items: [{
                                        valueField:'idprefijo',
					hiddenName:'idprefijo',
					displayField:'denominacion',
					xtype:'combo',
					triggerAction: 'all',
					readOnly:true,
					mode:'remote',
					anchor:'95%',
					id: 'prefijo',
					fieldLabel: etiquetas.textTipoTabla,
					typeAhead: true,
					store: stCmbPrefijo,
					emptyText: etiquetas.textSelect,
					allowBlank: false
				}]
			},{
				columnWidth:1,
				layout: 'column',
				items:[
						{
						columnWidth:.1,
						layout: 'form',
						items:[new Ext.form.Checkbox({
							boxLabel: etiquetas.textArbol,
							id:'arbol',
							hideLabel:true,
							listeners:{'check':function(th,ch){
								Ext.getCmp('cdenom').hide();
								if(ch)
									Ext.getCmp('cdenom').show();
								winAdd.center();
								winAdd.doLayout();
							}}
						})]
						},{
                columnWidth:1,
                layout: 'form',
                items:new Ext.form.FieldSet({
					layout: 'column',
					title:'',
					hidden:true,
					id:'cdenom',
					autoHeight:true,
					items:[{
						columnWidth:.4,
						layout: 'form',
						items: [{
							xtype:'textfield',
							fieldLabel: etiquetas.textEtiqueta,
							id:'tree_etiqueta',
							name:'etiqueta',
							anchor:'95%',
                            minLength:0,
                            maxLength:30
						}]
					},{ 
						columnWidth:.30,
						layout: 'form',
						items: [{							
							displayField:'denominacion',
							xtype:'combo',
							id: 'tree_expresion_regular',
							valueField:'idexpresionregular',
							triggerAction: 'all',
							readOnly:true,
							hiddenName: 'idexpresionregular',
							mode:'remote',
							anchor:'90%',
							//width:140,
							fieldLabel: etiquetas.textExpresioRegular,
							editable: false,
							store: stCmbRexExp,
							emptyText: etiquetas.textSelect
						}]
					},{
						columnWidth:.3,
						layout: 'form',
						items: [{
							xtype:'numberfield',
							fieldLabel: etiquetas.textLongitud,
							id: 'tree_longitud',
							name: 'longitud',
							maxLength:40,
							maskRe:/^([0-9]+ ?[0-9]*)+$/,
							regex:/^([0-9]+ ?[0-9]*)+$/,
							anchor:'95%'
						}]
					}]
				})
			}
				]
			}]
		}]
	});
	
	tpSchema = new Ext.tree.TreePanel({
					autoScroll:true,
					enableDD:false,
					border:false,
					height: 120,
					root:new Ext.tree.AsyncTreeNode({
						 text: etiquetas.textEsquema,
						 draggable: false,
						 id: '0'
					}),
					listeners:{'beforeclick':function(node,event){
						if(node.getDepth() != 2)
							node.unselect();
					}},
					margins:'2 2 2 2',
					loader: new Ext.tree.TreeLoader({
							dataUrl:'cargararbolesquemas',
							listeners : {'load':function(){ 
											if(winImp) {
												winImp.setHeight(365);
												winImp.center();	
											}
											if(winObt){
												 winObt.setHeight(365);
												 winObt.center();
											} 
											tpSchema.setHeight(290);
							}}
					})
				});
	
	fpImportar = new Ext.Panel({
		labelAlign: 'top',
		frame:false,
		autoHeight:true,
		bodyStyle:'padding:5px 5px 0',
		items: [tpSchema]
	});

	gpTablasNomencladas = new Ext.grid.GridPanel({
		sm : new Ext.grid.RowSelectionModel({singleSelect:true, listeners : {'rowselect':function(){Ext.getCmp('btnWinObtAceptar').enable()}}}),
        	store: new Ext.data.GroupingStore({
			url : 'cargartablasnomecladas',
			root : 'data',
            		reader: new Ext.data.JsonReader({
				//totalProperty: "total",
				root: "data"},
 				[{name: 'idtabla'},
       				{name: 'esquema'},
       				{name: 'tabla'},
       				{name: 'alias'}
    				]),
            		sortInfo:{field: 'tabla', direction: "ASC"},
            		groupField:'esquema'
        	}),
		loadMask:'Cargando...',
        columns: [
            {id:'esquema',header: etiquetas.textEsquemaSingular, width: 60, sortable: true, dataIndex: 'esquema'},
            {header: etiquetas.textTabla, width: 20, sortable: true, dataIndex: 'tabla'},
            {header: etiquetas.textAlias, width: 20, sortable: true, dataIndex: 'alias'}
        ],

        view: new Ext.grid.GroupingView({
            forceFit:true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
        }),

        frame:true,
        width: 700,
        height: 450,
        collapsible: true,
        animCollapse: false,
        iconCls: 'icon-grid'
    });
	
// Store grid stGpGestTabla
	stGpGestTabla =  new Ext.data.Store({
		url:'cargartablas',
		listeners:{'load':function(){smGpGestTabla.selectFirstRow();
            Ext.getCmp('btnAdd').focus(200);}},
		reader:new Ext.data.JsonReader({
			totalProperty: "total",
			root: "data",
			id: "idtabla"},
		[{name:'idtabla'},{name:'esquema'},{name:'tabla'},{name:'arbol'},{name:'importada'},{name:'alias'}]
		)
	});


// Selection Model grid smGpGestTabla
	smGpGestTabla = new Ext.grid.RowSelectionModel({singleSelect:true});
// Grid gestion gpTabla
	gpTabla = new Ext.grid.GridPanel({
		frame:true,  
		region:'center',
        id:'gpTabla',
		autoExpandColumn:'expandir',
		store:stGpGestTabla,
		margins:'2 2 2 -4',
		sm:smGpGestTabla,
		columns:[
			{hidden:true, hideable: false, dataIndex: 'idtabla'},
			{id:'expandir',header: etiquetas.textTabla, width:100, dataIndex: 'tabla'},
			{header: etiquetas.textAlias, width:200, dataIndex: 'alias'},
			{header: etiquetas.textEsquemaSingular, width:100, dataIndex: 'esquema'},
			{header: etiquetas.textArbol, width:100, dataIndex: 'arbol'}],		
		loadMask:{store: stGpGestTabla},
		tbar:[btnAdicionar,/*btnModificar, */btnEliminar, btnImportar, btnGestRelaciones,'-',nameFilter, btnBuscar, btnLimpiar/*new XMetaSearchField({
            width:200,
            id:'search',
            //maskRe:/^[a-zA-Z0-9_]$/,
            regex:/^([A-Za-z0-9_]*)+$/,
            regexText: etiquetas.textOnliCaracterEspecial+ " _",
            //baseParams:{start:0, limit:10},
            store: stGpGestTabla})*/,'->',btnMenu
			],
		bbar:new Ext.PagingToolbar({pageSize: 10, store: stGpGestTabla, displayInfo: true }),
        keys:
        [
          {
            key: 'i',
            alt: true,
            ctrl: false,
            shift: false,
            handler: function(k, e) {
                winFp('Add');
            }
          },
            {
                key: 'x',
                alt: true,
                ctrl: false,
                shift: false,
                handler: function(k, e) {
                    winFp('Imp');
                }
            },
            {
                key: 'g',
                alt: true,
                ctrl: true,
                shift: false,
                handler: function(k, e) {
                    gestRelaciones();
                }
            },
            {
                key: 46,
                alt: false,
                ctrl: false,
                shift: false,
                handler: function(k, e) {
                    eliminarTabla(etiquetas);
                }
            }, {
            	key: 'b',
            	alt: true,
            	ctrl: false,
            	shift: false,
            	handler: function(k, e){
            		buscarEnviadoPorFiltro();
            	}
            }, {
            	key: 'l',
            	alt: true,
            	ctrl: false,
            	shift: false,
            	handler: function(k, e){
            		limpiarFiltro();
            	}
            }, {
	            key: 'h',
	            alt: true,
	            ctrl: false,
	            shift: false,
	            handler: function(k, e) {
	                cargarAyuda();
	            }
        	}

        ]

    });
// Store grid stGpGestCampos
	stGpGestCampos =  new Ext.data.Store({
		url:'../gestcampos/cargarcampos',
		listeners:{load:function(){smGpGestCampos.selectFirstRow();},
				   beforeload:function(){stGpGestCampos.baseParams.idtabla = gpTabla.getSelectionModel().getSelected().data.idtabla}},
		reader:new Ext.data.JsonReader({
			totalProperty: "total",
			root: "data",
			id: "idcampo"
			},[{name:'idcampo'},{name:'denominacion'},{name:'tdato',mapping:'NomTipoDatoNomGestor.NomTipoDato.denominacion'},{name:'longitud'},{name:'llave_primaria'}]
		)
	});
// Selection Model grid smGpGestCampos
	smGpGestCampos = new Ext.grid.RowSelectionModel({singleSelect:true});
// Grid gestion gpCampos
	gpCampos = new Ext.grid.GridPanel({
		title: etiquetas.winCmpSeletc,
		frame:true,
		autoExpandColumn:'expandir',
		store:stGpGestCampos,
		loadMask: etiquetas.textCargar,
		region:'south',
		height:300,
		collapsible:true,
		collapsed:true,
		titleCollapse:true,
		margins:'2 2 2 -4',
		split:true,
		sm:smGpGestCampos,
		columns:[
			{hidden:true, hideable: false, dataIndex: 'idcampo'},
			{id:'expandir',header: etiquetas.textDenominacion, width:100, dataIndex: 'denominacion'},
			{header: etiquetas.textTIpoDato, width:200, dataIndex: 'tdato'},
			{header: etiquetas.textLongitud, width:100, dataIndex: 'longitud'}],
		//loadMask:{store: stGpGestCampos},
		tbar:[btnAddCampos, btnDelCampos, btnOrdCampos],
		bbar:new Ext.PagingToolbar({pageSize: 10, store: stGpGestCampos, displayInfo: true}),
        keys:
            [
                {
                    key: 'i',
                    alt: true,
                    ctrl: false,
                    shift: false,
                    handler: function(k, e) {
                        addCampos();
                    }
                },
                {
                    key: 46,
                    alt: false,
                    ctrl: false,
                    shift: false,
                    handler: function(k, e) {
                        eliminarCampos();
                    }
                },
                {
                    key: 'o',
                    alt: true,
                    ctrl: true,
                    shift: false,
                    handler: function(k, e) {
                        mostrarWindowOrdCampos()
                    }
                }
            ]
	});
// viewport principal de Gestionar Metadatas.
	vpTabla = new Ext.Viewport({
		layout:'border',
        //tbar:['->',btnAyuda],
		items:[gpTabla,gpCampos]

	})

// Evento Selection Model TreePanel rowselect
 tpSchema.getSelectionModel().on('selectionchange', function (smodel, node ){

		if(node && node.isLeaf()){

			if(Ext.getCmp('btnWinImpAceptar'))Ext.getCmp('btnWinImpAceptar').enable();
		}
		else{

			if(Ext.getCmp('btnWinImpAceptar'))Ext.getCmp('btnWinImpAceptar').disable();
		}		
	}, this);	
	
	/*tpSchema.getSelectionModel().on('beforeselect', function (smodel, newnode, oldnode ){
		if(newnode == oldnode)return false;
	}, this);*/
	
// Evento Selection Model grid rowselect
	gpTabla.getSelectionModel().on('rowselect', function (smodel, rowIndex, record ){
			btnModificar.disable();
			btnEliminar.enable();
			btnAddCampos.disable();
			btnGestRelaciones.disable();
		if(record.data.importada == 0) {
			btnModificar.enable();
			btnAddCampos.enable();
			btnGestRelaciones.enable();
		}
		gpCampos.expand();
		gpCampos.getStore().reload();
	}, this);
// Evento Selection Model grid rowselect
	gpCampos.getSelectionModel().on('rowselect', function (smodel, rowIndex, rc ){
		btnModificar.enable();		
		if (rc.data.llave_primaria == 0) btnDelCampos.enable(); else btnDelCampos.disable();
	}, this);

	stGpGestTabla.load({params:{start:0, limit:10}});
        function gestRelaciones(){
   // if(!winRelaciones)
        importarJS('../../views/js/gesttablas/gestrelaciones.js');
  //else winRelaciones.show('gestrelaciones');
}
// function adicionarTabla
function adicionarTabla(apl){
	if (fpTabla.getForm().isValid()){
		fpTabla.getForm().submit({
			url:'adicionartabla',
			waitMsg: etiquetas.textEsperar,
			failure: function(form, action){
				if(action.result.cod == 1 || action.result.cod == 3){
					mostrarMensaje(action.result.cod,action.result.mensaje)
					fpTabla.getForm().reset(); 
					if(!apl) winAdd.hide();
					gpTabla.getStore().reload();
					btnModificar.disable();
					btnEliminar.disable();
				}
			}
		});
	} else mostrarMensaje(1,etiquetas.msgObligatorioDET);
}

function importarTabla(apl,etiquetas){


        Ext.Ajax.request({
            url: 'importarTabla',
            params:{table:tpSchema.getSelectionModel().getSelectedNode().attributes.id, schema:tpSchema.getSelectionModel().getSelectedNode().parentNode.attributes.id},
            waitMsg: etiquetas.textEsperar,
            callback: function (options,success,response){
                responseData = Ext.decode(response.responseText);
                if(responseData.cod == 1 || responseData.cod == 3){
                    mostrarMensaje(responseData.cod,responseData.mensaje);
                    if(!apl||apl===null) 
                    {
                        winImp.hide();
                    }
                    gpTabla.getStore().reload();
                    btnModificar.disable();
                    btnEliminar.disable();
                }
            }
        });
        Ext.getCmp('btnWinImpAceptar').disable(true);

}

// function obtenerTabla

function obtenerTabla(apl,etiquetas){    
	stValueDisplay.reload({params:{idtabla:gpTablasNomencladas.getSelectionModel().getSelected().data.idtabla}});
	winAddCampos.el.mask(etiquetas.textEsperar);
	Ext.getCmp('tftabla').setValue((gpTablasNomencladas.getSelectionModel().getSelected().data.alias)?gpTablasNomencladas.getSelectionModel().getSelected().data.alias:gpTablasNomencladas.getSelectionModel().getSelected().data.esquema + "." + gpTablasNomencladas.getSelectionModel().getSelected().data.tabla)
	if(!apl) winObt.hide();	
}

// function eliminarTabla
function eliminarTabla(){
	
	mostrarMensaje(2,perfil.etiquetas.msgSeguridaDelete,elimina);
	function elimina(btnPresionado){
		if (btnPresionado == 'ok'){
			loadMask(perfil.etiquetas.textDeleteTablaEsperar);
			Ext.Ajax.request({
				url: 'eliminartabla',
				params:{idtabla:gpTabla.getSelectionModel().getSelected().data.idtabla},
				callback: function (options,success,response){
						responseData = Ext.decode(response.responseText);
						if(responseData.cod == 1 || responseData.cod == 3){
							mostrarMensaje(responseData.cod,responseData.mensaje);
							lMask.hide();
							gpCampos.getStore().removeAll();
							gpTabla.getStore().reload();
							btnModificar.disable();
							btnEliminar.disable();
						}
				}
			});
		}
	}
}
// function eliminarCampos
function eliminarCampos(){
	mostrarMensaje(2,perfil.etiquetas.msgSeguridadDeleteCmp,elimina);
	function elimina(btnPresionado){
		if (btnPresionado == 'ok'){
			loadMask(perfil.etiquetas.textDeleteCmpEsperar);
			Ext.Ajax.request({
				url: '../gestcampos/eliminarcampos',
				params:{idcampo:gpCampos.getSelectionModel().getSelected().data.idcampo},
				callback: function (options,success,response){
						responseData = Ext.decode(response.responseText);
						if(responseData.cod == 1 || responseData.cod == 3){
							mostrarMensaje(responseData.cod,responseData.mensaje);
							lMask.hide();
							gpCampos.getStore().reload();
							btnModificar.disable();
							btnDelCampos.disable();
						}
				}
			});
		}
	}
}

function winFp(opcion){
		switch(opcion){
			case 'Add':{
				if(!winAdd){
					winAdd = new Ext.Window({modal: true,closeAction:'hide',layout:'fit',
						title:'Adicionar tabla',width:650,autoHeight:true,
						buttons:[{/*icon:perfil.dirImg+'cancelar.png',*/iconCls:'cancelar',
								 	text: perfil.etiquetas.textCancelar,
									handler:function(){winAdd.hide();},
                                     tooltip:perfil.etiquetas.tooltipCancelarVen
								},{/*icon:perfil.dirImg+'aplicar.png',*/iconCls:'aplicar',
									text: perfil.etiquetas.textAplicar,
									handler:function(){adicionarTabla('apl');},
                                  tooltip:perfil.etiquetas.tooltipAplicarVen
								},{/*icon:perfil.dirImg+'aceptar.png',*/iconCls:'aceptar',
								text: perfil.etiquetas.textAceptar,
								handler:function(){adicionarTabla();},
                                tooltip:perfil.etiquetas.tooltipAceptarVen
                                }
						]
					});
				}
				fpTabla.getForm().reset();
				winAdd.show();
                winAdd.add(fpTabla);
                Ext.getCmp('tabla').focus(false,200);
				winAdd.doLayout();
			}break;
			case 'Imp':{                                
				if(!winImp){
					winImp = new Ext.Window({modal: true,closeAction:'hide',layout:'fit',
						title: etiquetas.textImportarTabla, width:400,height:120,
						buttons:[{/*icon:perfil.dirImg+'cancelar.png',*/iconCls:'cancelar',
								 	text: perfil.etiquetas.textCancelar,
									handler:function(){winImp.hide();},
                                                                        tooltip:perfil.etiquetas.tooltipCancelarVen
								},{/*icon:perfil.dirImg+'aceptar.png',*/iconCls:'aceptar',								
								text: perfil.etiquetas.textAceptar,
								id:'btnWinImpAceptar',
								disabled:true, 
								handler:function(){
                                                                    importarTabla(null,etiquetas);
                                                                },
                                                                tooltip:perfil.etiquetas.tooltipAceptarVen
                                }
						]
					});
				}
				tpSchema.getLoader().load(tpSchema.getRootNode(),function(){tpSchema.getRootNode().expand()});
				winImp.show();
				winImp.add(fpImportar);
				winImp.doLayout();
			}break;
			case 'Get':{
				if(!winObt){
					winObt = new Ext.Window({modal: true,closeAction:'hide',layout:'fit',
						title:'Tabla', width:700,height:320,
						buttons:[{/*icon:perfil.dirImg+'cancelar.png',*/iconCls:'cancelar',
								 	text: perfil.etiquetas.textCancelar,
                                                                        tooltip:perfil.etiquetas.tooltipCancelarVen,
									handler:function(){winObt.hide();}
								},{/*icon:perfil.dirImg+'aceptar.png',*/iconCls:'aceptar',								
								text: perfil.etiquetas.textAceptar,
								id:'btnWinObtAceptar',
                                                                tooltip:perfil.etiquetas.tooltipAceptarVen,
								disabled:true, 
								handler:function(){obtenerTabla();}}
						]
					});
				}
				gpTablasNomencladas.getStore().load();
				winObt.show();
				winObt.add(gpTablasNomencladas);
				winObt.doLayout();
			}break;
		}
}

function mostrarWindowOrdCampos(){
    gridStr =  new Ext.data.Store({
		url:'../gestcampos/obtenercamposparaordenar',
		reader:new Ext.data.JsonReader({
			id: "orderfields"
			},[{name:'idcampo'},{name:'idcomponente', mapping:'DatComponente.idcomponente'},{name:'etiqueta',mapping:'DatComponente.etiqueta'}]
		)
    });

    gridStr.load({params:{idtabla:gpTabla.getSelectionModel().getSelected().data.idtabla}});
    
    ordChangePanel = new Ext.OrderChangePanel({	    	    
		gridStore: gridStr,		
		gridColumns: [
			{header: perfil.etiquetas.textEtiqueta,  dataIndex: 'etiqueta', sortable: false}
		]
	});	
	winExample = new Ext.Window({
		title: perfil.etiquetas.textModificarCmp,		
		items:[ordChangePanel],
		buttons:[{
				text     : perfil.etiquetas.textCancelar,
				//icon     : perfil.dirImg+'cancelar.png',
				iconCls  : 'cancelar',				
				handler  : function(){
					this.ownerCt.hide();		
				},
                tooltip:perfil.etiquetas.tooltipCancelarVen
			},{
				text     : perfil.etiquetas.textAceptar,
				//icon     : perfil.dirImg+'aceptar.png',
				iconCls  : 'aceptar',                                
				handler  : function(){
                                        ordenarCampos();
					this.ownerCt.hide();  
				},
                tooltip:perfil.etiquetas.tooltipAceptarVen
                               
            }
		]
	}).show();
}
/*var progess = Ext.MessageBox.show({
                            msg: 'Instalando su aplicación, por favor espere...',
                            progressText: 'Instalando...',
                            width:350,
                            wait:true,
                            waitConfig: {interval:450}
                });*/

function ordenarCampos() {
    var arrOrden  = Array();
    for(var i=0; i<gridStr.getCount();i++)
        arrOrden.push(gridStr.getAt(i).data.idcomponente);
    
    
   Ext.Ajax.request({
            url: '../gestcampos/ordenarcampos',
           
            params:{orden:Ext.encode(arrOrden)}
          
            /*callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);
                            if(responseData.codMsg == 1 || responseData.codMsg == 3){
                                    mostrarMensaje(responseData.codMsg,responseData.mensaje);
                                    lMask.hide();
                                    gpCampos.getStore().reload();
                                    btnModificar.disable();
                                    btnDelCampos.disable();
                            }
                
            }*/
      
    });
    setTimeout("gpCampos.getStore().reload();",1000);
  
}
//buscar tabla por denominacion
function buscarEnviadoPorFiltro(){
	denom = nameFilter.getValue();
	if(denom){
		stGpGestTabla.filter('tabla', denom, true, false);
		stGpGestTabla.loadData(stGpGestTabla.data, false);                
	}
	else
		mostrarMensaje(6,"Debe introducir algún criterio de búsqueda. Verifique por favor.");
	
}
//limpiar el filtro de busqueda
function limpiarFiltro(){
	if(nameFilter.getValue() != ""){
		nameFilter.reset();
		btnLimpiar.disable();
		stGpGestTabla.filter('tabla', "", false, false);
			stGpGestTabla.load({
	                    params: {
	                        start: 0,
	                        limit: 20
	                    }
	        });    
	}              
}
function loadMask(message){
	lMask = new Ext.LoadMask(Ext.getBody(),{msg:message});
	lMask.show();
}
function cargarAyuda(){
    var title    = perfil.etiquetas.textMetadata;
    var referencia    = 'metadata';
    help.show(title, referencia);
}



}
//Ext.getCmp('btnAdd').focus(200);

// Endof cargarInterfaz
//cargarInterfaz();
// funcion gestionar relaciones
