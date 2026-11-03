
Utilidades.Cmp.Cmpgestionararc = function(opcionesConfig)
{
	var _this = this;
	
	//objeto de barra de paginado para el treegrid de elementos de la planificacion
	this.objclassPaginadoTreegrid = new ClassPaginadoTreegrid(20,_this.AccionTrasPaginar);
	
	//objeto CRUD-ARC inicializado
	//this.objCrudArc = new Utilidades.Cmp.Cmpcrudarc();
	
	//variables 
	this.opcionBusqueda = 3;
	this.arrayidplan = [];
	
	//botones para la gestion de los planes
	this.btnAdicionar = new Ext.Button({handler:function(){/*modificando = false;adicionarhijo = true;CrearVentanaGestionArc();*/}, text:'Adicionar', disabled:false,icon:perfil.dirImg+'adicionar.png', iconCls:'btn', tooltip:'Adicionar ARC'});
	this.btnModificar = new Ext.Button({handler:function(){/*modificando = true;adicionarhijo = false;CrearVentanaGestionArc();*/}, text:'Modificar', disabled:true,icon:perfil.dirImg+'modificar.png', iconCls:'btn', tooltip:'Modificar ARC'});
	this.btnEliminar = new Ext.Button({handler:function(){/*confirmarEliminar();*/},text:'Eliminar',disabled:true,icon:perfil.dirImg+'eliminar.png', iconCls:'btn', tooltip:'Eliminar ARC'});
	this.btnDesactivar = new Ext.Button({handler:function(){ /*confirmarDesactivar();*/ },  text:'Desactivar', icon:perfil.dirImg+'deshabilitar.png',iconCls:'btn',tooltip:'Suspender ARC',disabled:true});	
	this.btnActivar = new Ext.Button({handler:function(){/*confirmarActivar();*/ },text:'Activar',icon:perfil.dirImg+'habilitar.png',iconCls:'btn',tooltip:'Activar ARC',disabled:true});
	this.btnPanelBusqueda = new Ext.Button({ disabled:false, icon:perfil.dirImg+'buscar.png', iconCls:'btn', tooltip:'Buscar ARC por diferentes criterios',handler:function(){_this.pBuscarArc.expand();}});
	this.btnLimpiar = new Ext.Button({disabled:false, handler:function(){_this.opcionBusqueda = 2;_this.CargarArc();}, icon:perfil.dirImg+'limpiar.png', iconCls:'btn', tooltip:'Limpiar los criterios de búsqueda de las ARC'});
	this.btnActualizar = new Ext.Button({disabled:false, handler:function(){_this.opcionBusqueda = 3;_this.CargarArc();}, icon:perfil.dirImg+'actualizar.png', iconCls:'btn', tooltip:'Actualizar listado de ARC'});
	this.btnBusquedaSimple = new Ext.Button({handler:function(){_this.opcionBusqueda = 1;_this.CargarArc();}, text:'Buscar', icon:perfil.dirImg+'buscar.png', iconCls:'btn', tooltip:'Buscar'});
	this.btnSeleccionar = new Ext.Button({handler:function(){/*_this.RelacionarElementos();*/},disabled:true ,text:'Seleccionar', icon:perfil.dirImg+'aceptar.png', iconCls:'btn', tooltip:'Relacionar el(lass) &aacute;rea(s) seleccionada(s)',hidden:opcionesConfig.noUsarSeleccionarWinP});
	
	//store del treegrid donde se muestran las arc
	this.stTGCmpArc =  new Ext.ux.maximgb.treegrid.AdjacencyListStore({		
		url:'/planificacion/pdo/plan/index.php/cmpgestionararc/cargararc',
		listeners:{
			beforeload:function(st){
			},
			load :function(store,record,options)
			{  
				_this.objclassPaginadoTreegrid.ActualizarDatosBbar(store);
			}
		},
		reader:new Ext.data.JsonReader({
			id:'idarea',
			totalProperty: "total",
			root: "campos"		
			},[{name:'denom'},{name:'fdesde'},{name:'fhasta'},{name:'activo'},
			{name:'autor'},{name:'idarea'},{name:'descrip'},{name:'superior'},
			{name:'mod'},{name:'del'},{name:'_parent'},{name:'_is_leaf'}])
	});
	
	//modo de del treegrid donde se muestran las arc
	this.smTGCmpArc = new Ext.grid.CheckboxSelectionModel({
	singleSelect:false,
	listeners: {
		rowselect:function(sm, indiceFila, record)
		{
			
			/*if (_this.prevrow>=0 && _this.prevrow!=indiceFila){
				Ext.get(_this.TGCmpPlan.getView().getRow(_this.prevrow)).removeClass('superior2');
				Ext.get(_this.TGCmpPlan.getView().getRow(_this.prevrow)).addClass('superior');						
			} 
			if (record.data.superior==1) { 
				Ext.get(_this.TGCmpPlan.getView().getRow(indiceFila)).removeClass('superior');
				Ext.get(_this.TGCmpPlan.getView().getRow(indiceFila)).addClass('superior2');
				_this.prevrow = indiceFila;
			} else _this.prevrow = -1;	*/		
			//_this.ActualizarEstadoBarraHerramientas();		
		},
		rowdeselect:function(sm, indiceFila, record)
		{
			
			/*if (_this.prevrow>=0 && _this.prevrow!=indiceFila){
				Ext.get(_this.TGCmpPlan.getView().getRow(_this.prevrow)).removeClass('superior2');
				Ext.get(_this.TGCmpPlan.getView().getRow(_this.prevrow)).addClass('superior');						
			} 
			if (record.data.superior==1) { 
				Ext.get(_this.TGCmpPlan.getView().getRow(indiceFila)).removeClass('superior');
				Ext.get(_this.TGCmpPlan.getView().getRow(indiceFila)).addClass('superior2');
				_this.prevrow = indiceFila;
			} else _this.prevrow = -1;*/			
			//_this.ActualizarEstadoBarraHerramientas();		
		}
	}
	});
	
	//treegrid donde se muestran las arc
	this.TGCmpArc = new Ext.ux.maximgb.treegrid.GridPanel({
		store: _this.stTGCmpArc,
		master_column_id : 'expandir',
		autoExpandColumn:'expandir',
		stripeRows: true,
		region:'center',
		sm:_this.smTGCmpArc,
		margins:'3 3 3 3',
		loadMask:{msg :'Cargando &aacute;reas de resultados clave'},
		root_title: 'Registro de &aacute;reas de resultados clave',
		columns:[_this.smTGCmpArc,
				{hideable:false, header: '<center>CAR</center>',dataIndex: 'idarea', width:80},
				{hideable:false, id: 'expandir',header: 'Denominación',/*renderer:MostrarImagenTipoElemento ,*/dataIndex: 'denom'},
				{hideable:false, header: '<center>Fecha de inicio</center>', width:100, dataIndex: 'fdesde',/* renderer: renderFecha,*/ sortable:true },
				{hideable:false, header: '<center>Fecha de fin</center>', width:100, dataIndex: 'fhasta',/* renderer: renderFecha,*/  sortable:true },
				{hideable:false, header: '<center>Activo</center>', width:60 ,dataIndex: 'activo',/* renderer:MostrarImagenActivo ,*/sortable:true},
				{hideable:false, header: '<center>Autor</center>', width:90 ,dataIndex: 'autor', /*renderer:function(val){ return "<center>"+val+"</center>";},*/sortable:true},
				{hideable:false, hidden: true, dataIndex: 'idarea'}
		],		
		tbar:_this.objclassPaginadoTreegrid.barraNiveles,
		bbar:_this.objclassPaginadoTreegrid.barraPaginado
	});
	
	
	//campo de texto para la busqued a de planes por denominacion
	this.tfdenominacionBS = new Ext.form.TextField({
	    fieldLabel: 'Denominación',
		maskRe:/^([a-zA-Z0-9áéíóúñüÑ ,;()-_]+ ?[a-zA-Z0-9áéíóúñüÑ ,;()-_]*)+$/, 
		regex: /^([a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;\-/:,.?,-]+ ?[a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.?,-]*)+$/,
		maxLength:255,
	    anchor: '95%',
		allowBlank: true	
	});
	
	//campos de fecha para la busqueda de planes
	this.fechaInicioBS = new Ext.form.DateField({
		fieldLabel: 'Fecha de inicio',
		format:'d/m/Y',						                 
		width:100,
		allowBlank: true,
		readOnly:true		
	});
	this.fechaFinBS = new Ext.form.DateField({
		fieldLabel: 'Fecha de fin',
		format:'d/m/Y',						               																		
		width:100,
		readOnly:true		
	});
	
	//campo de texto para la busqueda por CAR(Codigo de Acceso Rapido)
	this.tfCAR = new Ext.form.TextField({
	    fieldLabel: 'CAR',
		maskRe:/^[0-9]+$/, 
		regex: /^[0-9]+$/,
	    width:130,
		allowBlank: true	
	});
	
	//arbol para la busqueda de arc por autores
	this.treeAutores = new Ext.tree.TreePanel(
	{	  
		autoScroll:true,
		autoWidth:true,
		height:390,
		title:'Autores',
		frame:false,
		tbar:['->',
		      {   	   iconCls:'x-btn-text-icon',
					   tooltip: 'Expandir todas las agrupaciones',
                       icon: '../../../comun/recursos/images/fam/expand-all.gif',
		         	   handler: function(){_this.treeAutores.root.expand(true);}       
				 },{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Contraer todas las agrupaciones ',
						icon: '../../../comun/recursos/images/fam/collapse-all.gif',
		                handler: function(){_this.treeAutores.root.collapse(true);}
				 }
				 ,{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Refrescar todas las agrupaciones ',
						icon: '../../../comun/recursos/images/fam/table_refresh.png',
		                handler: function(){_this.treeAutores.getRootNode().reload();}
				 }
		],
		root:{
	            text: 'Autores',
				expanded:true,
	            id:'rootNodoAutores',
				children: [
							{
								nodeType: 'async',
								id: 'nodo1',
								idgrupo: 'nodo1',
								text: 'Mi usuario',
								iconCls:'misgrupos',
								tipo: '2',
								leaf: false
							},{
								nodeType: 'async',
								id: 'nodo2',
								idgrupo: 'nodo2',
								text: 'Usuarios subordinados',
								iconCls:'misgrupos',
								tipo: '2',
								leaf: false
							}]	
							
        }, 	
		loader:new Ext.tree.TreeLoader({
			singleClickExpand:true, 
			dataUrl:'/planificacion/pdo/plan/index.php/cmpgestionararc/cargarautoresarc',
			listeners:{
			     'beforeload':function(atreeloader, anode){ 
                 atreeloader.baseParams = {tipo:anode.attributes.tipo, idgrupo:anode.attributes.idgrupo,idusuario:anode.attributes.idusuario};},
				 'load':function(atreeloader, anode){
				}
			}
		})			
	});
	
	//arbol para la busqueda de arc por involucrados
	this.treeInvol = new Ext.tree.TreePanel(
	{	  
		autoScroll:true,
		autoWidth:true,
		height:390,
		title:'Involucrados',
		frame:false,
		tbar:['->',
		      {   iconCls:'x-btn-text-icon',
					   tooltip: 'Expandir todas las agrupaciones',
                       icon: '../../../comun/recursos/images/fam/expand-all.gif',
		         	   handler: function(){_this.treeInvol.root.expand(true);}       
				 },{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Contraer todas las agrupaciones ',
						icon: '../../../comun/recursos/images/fam/collapse-all.gif',
		                handler: function(){_this.treeInvol.root.collapse(true);}
				 },{
						iconCls: 'icon-collapse-all',
		                tooltip: 'Refrescar todas las agrupaciones ',
						icon: '../../../comun/recursos/images/fam/table_refresh.png',
		                handler: function(){_this.treeInvol.root.reload();}
				 }
		],
		root:{
	            text: 'Involucrados',
				expanded:true,
	            id:'rootNodoAutores',
				children: [
							{
								nodeType: 'async',
								id: 'nodo1',
								idgrupo: 'nodo1',
								text: 'Mi usuario',
								iconCls:'misgrupos',
								tipo: '2',
								leaf: false
							},{
								nodeType: 'async',
								id: 'nodo2',
								idgrupo: 'nodo2',
								text: 'Mis grupos',
								iconCls:'misgrupos',
								tipo: '2',
								leaf: false
							},{
								nodeType: 'async',
								id: 'nodo3',
								idgrupo: 'nodo3',
								text: 'Usuarios subordinados',
								iconCls:'misgrupos',
								tipo: '2',
								leaf: false
							}]	
							
        }, 	
		loader:new Ext.tree.TreeLoader({
			singleClickExpand:true, 
			dataUrl:'/planificacion/pdo/plan/index.php/cmpgestionararc/cargarinvolarc',
			listeners:{
			     'beforeload':function(atreeloader, anode){ 
                 atreeloader.baseParams = {tipo:anode.attributes.tipo, idgrupo:anode.attributes.idgrupo,idusuario:anode.attributes.idusuario};},
				 'load':function(atreeloader, anode){
				}
			}
		})			
	});
	
	//panel donde se muestran las opciones de busqueda de arc
	this.pBuscarArc = new Ext.Panel({
		title:'Opciones de b&uacute;squeda',
		layout:'fit',
		width:300,
		activeTab:0,
		collapsible: true,
		collapsed: true,
		margins:'3 3 3 3',
		region: 'east',
		items:[
				new Ext.form.FormPanel({
					frame:true,
					labelAlign:'top',
					items:[
						_this.tfdenominacionBS,
						{
							layout:'column',
							items:[
							 {
								columnWidth:.5,
								layout: 'form',
								width:136,
								items:[_this.fechaInicioBS, _this.fechaFinBS]
							 },
							 {
								columnWidth:.5,
								layout: 'form',
								width:150,
								items:[_this.tfCAR]
							 }
							]
						},
					  new Ext.TabPanel({
						activeTab:0,
						 height:365,
						items:[_this.treeAutores,_this.treeInvol]
					  })
					]
				})
		],
		buttons:[_this.btnBusquedaSimple],
		listeners:{
		   expand: function(p)
		   {
		   }
		}
	});
	
	
	//panel principal de la vista
	this.PanPrincipal = new Ext.Panel({
		layout:'border',
		tbar:['-',_this.btnAdicionar,' ',_this.btnModificar,' ',_this.btnEliminar,'-',_this.btnActivar,' ',_this.btnDesactivar,'-',_this.btnPanelBusqueda,'-',_this.btnLimpiar,'-',_this.btnActualizar,'-'],
		items:[_this.TGCmpArc,_this.pBuscarArc]
	});
		
	//ventana principal de la vista
	this.WinPrincipal = new Ext.Window({
		title:'<center>Registro de &aacute;reas de resultados clave</center>',
		layout:'fit',
		closable:false,
		graggable:false,
		maximized:opcionesConfig.maxWinPrincipal,
		modal:true,
		width:1000,
		height:510,
		items:[_this.PanPrincipal],
		buttons:[
			{
				text:'Cerrar',
				tooltip:'Cerrar ventana',
				hidden:opcionesConfig.noUsarCerrarWinP,
				icon:perfil.dirImg+'cerrar.png', 
				iconCls:'btn',
				handler:function()
				{
					_this.WinPrincipal.hide();
				}
			},
			_this.btnSeleccionar
		]
	});
	
	
	
	
	
	//funcion donde se procede a cargar la plantilla
	this.CargarCmpArc = function(idelementopadre,tipoelementopadre)
	{	
		_this.idelementopadre = idelementopadre;
		_this.tipoelementopadre = tipoelementopadre;
		_this.CargarArc();
		_this.WinPrincipal.show();		
	}
	
	//funcion donde se procede a cargar el treegrid con las arc
	this.CargarArc = function()
	{
		denom = _this.tfdenominacionBS.getValue();
		fdesde = Ext.encode(_this.fechaInicioBS.getValue());
		fhasta = Ext.encode(_this.fechaFinBS.getValue());
		car = _this.tfCAR.getValue();
		
		if(_this.opcionBusqueda == 1)
		{			
			var autoresCheckeados = _this.treeAutores.getChecked() ;
			var arrayautores = [];
			var autor = {};
			var involCheckeados = _this.treeInvol.getChecked() ;
			var arrayinvolucrados = [];
			var invol = {};
			
			if(autoresCheckeados.length > 0)
			{
				for (var i=0; i<autoresCheckeados.length; i++)
				{
					if(autoresCheckeados.id != 'nodo1' && autoresCheckeados.id != 'nodo2' && autoresCheckeados.id != 'nodo3') 
					{
						autor = {idusuario:autoresCheckeados[i].attributes.idusuario,
								idgrupo:autoresCheckeados[i].attributes.idgrupo,
								tipo:autoresCheckeados[i].attributes.tipo};
						arrayautores.push(autor);
					}
				}
			}				 
			if(involCheckeados.length > 0)
			{
				for (var i=0; i<involCheckeados.length; i++)
				{
					if(involCheckeados.id != 'nodo1' && involCheckeados.id != 'nodo2' && involCheckeados.id != 'nodo3') 
					{
						invol = {idusuario:involCheckeados[i].attributes.idusuario,
								idgrupo:involCheckeados[i].attributes.idgrupo,
								tipo:involCheckeados[i].attributes.tipo};
						arrayinvolucrados.push(invol);
					}	
				}
			}
		
			if(_this.tfdenominacionBS.getValue() != '' || _this.fechaInicioBS.getValue() != '' || _this.fechaFinBS.getValue() != '' 
			|| _this.tfCAR.getValue() != ''|| autoresCheckeados.length > 0 || involCheckeados.length > 0)
			{			
				_this.objclassPaginadoTreegrid.offset = 0;
				_this.objclassPaginadoTreegrid.limit = 20;
				_this.objclassPaginadoTreegrid.countpag = 0;
				_this.stTGCmpArc.removeAll();
				_this.stTGCmpArc.reload({params:{limit: _this.objclassPaginadoTreegrid.limit,
					offset:_this.objclassPaginadoTreegrid.offset,
					denom: denom, 
					fdesde: fdesde,
					fhasta: fhasta,	
					car:car,
					arrayautores:Ext.encode(arrayautores),
					arrayinvolucrados:Ext.encode(arrayinvolucrados)}});
			}
			else
			{mostrarMensaje(1,"Debe seleccionar al menos un criterio de búsqueda."); return;}
		}
		if(_this.opcionBusqueda == 2 || _this.opcionBusqueda == 3)
		{		
			_this.objclassPaginadoTreegrid.offset = 0;
			_this.objclassPaginadoTreegrid.limit = 20;
			_this.tfdenominacionBS.reset();
			_this.fechaInicioBS.reset();
			_this.fechaFinBS.reset();
			_this.tfCAR.reset();
			if(_this.treeAutores.getRootNode().rendered) {_this.treeAutores.getRootNode().reload();}
			if(_this.treeInvol.getRootNode().rendered) {_this.treeInvol.getRootNode().reload();}
			_this.objclassPaginadoTreegrid.countpag = 0;
			_this.stTGCmpArc.removeAll();
			_this.stTGCmpArc.reload({params:{offset:_this.objclassPaginadoTreegrid.offset,limit:_this.objclassPaginadoTreegrid.limit}});
		}
	}
	
}