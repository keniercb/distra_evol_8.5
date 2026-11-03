
Utilidades.Cmp.Cmpgestionarelementos = function()
{
	var _this = this;
	
	
	
	this.opcionBusqueda = 4;		
	
	//barra de paginado para el treegrid de elementos de la planificacion
	this.objclassPaginadoTreegrid = new ClassPaginadoTreegrid(10);
	
	//inicializando el objeto menu dinamico 
	this.objcmpmenurelacionesdin = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();
	
	
	this.arrayidelementos = [];


	//botones para la gestion de elementos de la planificacion
	this.btnAdicionar = new Ext.Button({text:'Adicionar', disabled:false,handler:function(){_this.MenuInicAccionClick();}, menu:_this.objcmpmenurelacionesdin.menuinicial,id:'btnAdicionar', /*icon:perfil.dirImg+'adicionar.png',*/ iconCls:'adicionar', tooltip:'Adicionar elementos de la planificaci&oacute;n',
        key: {
            alt: true ,
            key: 'I'
        },
        scope: this
    });
	this.btnEliminar = new Ext.Button({text:'Eliminar', disabled:true,handler: function(){},  id:'btnEliminar', /*icon:perfil.dirImg+'eliminar.png',*/ iconCls:'eliminar', tooltip:'Eliminar elementos de la planificaci&oacute;n',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
	this.btnModificar = new Ext.Button({text:'Modificar', disabled:true,handler:function(){},id:'btnModificar',/* icon:perfil.dirImg+'modificar.png',*/ iconCls:'modificar', tooltip:'Modificar elementos de la planificaci&oacute;n',
        key: {
            alt: true ,
            key: 'M'
        },
        scope: this
    });
	this.btnActivar = new Ext.Button({text:'Activar', disabled:true,handler:function(){}, id:'btnActivar', /*icon:perfil.dirImg+'habilitar.png',*/ iconCls:'habilitar', tooltip:'Activar elementos de la planificaci&oacute;n',
        key: {
            alt: true ,
            key: 'X'
        },
        scope: this
    });
	this.btnDesactivar = new Ext.Button({text:'Desactivar', disabled:true,handler:function(){},id:'btnDesactivar', /*icon:perfil.dirImg+'deshabilitar.png',*/ iconCls:'deshabilitar', tooltip:'Desactivar elementos de la planificaci&oacute;n',
        key: {
            alt: true ,
            key: 'F'
        },
        scope: this
    });


	//store del combo de estados
	this.stestados = new Ext.data.Store(
	{
		url:'cargarcmbestados',
		reader:new Ext.data.JsonReader(
		{
			id:'idestado',
			root: "data"		
		},
		[{name:'idestado'},{name:'denominacion'}])
	});
	//combo de estados
	this.cbestados = new Ext.form.ComboBox({
		fieldLabel: 'Estado',
		name:'cbestados', 
		id:'cbestados', 
		store: _this.stestados,
		valueField:'idestado',
		displayField:'denominacion',		                                                                                                                                                 
		triggerAction:'all',
		mode:'remote',	
		editable:false,
		disabled:true,
		emptyText: 'Seleccione...',
		width:717 ,
		listeners:{
		  select :function(cb,record,index)	{
		  
		 }
		}       
	});


	//store del combo de aprobacion-conciliacion
	this.stcbaprob_conc = new Ext.data.SimpleStore({
			id:'stcbaprob_conc',
			fields: ['idac', 'denac'],
			data :[
				[1, 'Sí'],
				[0, 'No']
			]
	});	
	//combo de aprobacion-conciliacion	
	this.cbaprob_conc = new Ext.form.ComboBox({
		id : 'cbaprob_conc',
		name: 'cbaprob_conc',
		value:0,
		store: _this.stcbaprob_conc,
		displayField:'denac',
		typeAhead: true,
		mode: 'local',
		forceSelection: true,
		triggerAction: 'all',
		selectOnFocus:true,
		hiddenName: 'idac',
		valueField: 'idac',
		width:80,
		emptyText:'Seleccionar',
		listeners:{
		  select :function(cb,record,index)	{
		  
		 }
		}
	});


	//modo de seleccion del treegrid de elementos de la planificacion
	this.smTGElementosPlanificacion = new Ext.grid.CheckboxSelectionModel({
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
				_this.ActualizarEstadoBarraHerramientas();		
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
				_this.ActualizarEstadoBarraHerramientas();		
			}
		}
	});

	//Store del treegrid de elementos de la planificacion
	this.storeTGElementosPlanificacion = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
		id:'TGElementosPlanificacion',
		url: 'cargarelementos',
		listeners:{
			load :function(store,record,options)
			 {  		
				
				_this.objclassPaginadoTreegrid.ActualizarDatosBbar(store);
			 }

		},
		reader: new Ext.data.JsonReader(
		{
			id: 'idelemento' ,
			root: 'campos',
			totalProperty: 'total' 
			},
			[
			   {name: 'categoriaactividad'},
			   {name: 'tipoactividad'},
			   {name: 'estadocumplimiento'},
			   {name: 'estadoaprobacion'},
			   {name: 'grado'},
			   {name: 'fechainicio'},
			   {name: 'fechafin'},
			   {name: 'lugar'},
			   {name: 'horainicio'},
			   {name: 'horafin'},
			   {name: 'descelemento'},
			   {name: 'participantes'},
			   {name: 'dirigente'},
			   {name: 'denelemento'},
			   {name: 'idelemento'},
			   
			   {name: 'intervalo'},
			   {name: 'pordias'},
			   {name: 'porsemana'},
			   {name: 'cantidaddias'},
			   {name: 'terminarEl'},
			   
			   {name: 'llevahistorial'},
			   {name: 'activo'},
			   {name: 'tiporepeticion'},
			   
			   {name: '_parent'},
			   {name: '_is_leaf'},
			   {name: '_is_expand'},
			   {name: 'idautor'},
			   {name: 'nombreautor'},
			   {name: 'superior'},
			   
			   {name: 'leer'},
			   {name: 'adicionar'},
			   {name: 'modificar'},
			   {name: 'eliminar'},
			   {name: 'idestadoaprob'},
			   {name: 'subordinado'}
			]			
		)
	});


	//treegrid de elementos de la planificacion
	this.gdTGElementosPlanificacion = new Ext.ux.maximgb.treegrid.GridPanel({
		store: _this.storeTGElementosPlanificacion,
		id:'gdTGElementosPlanificacion',
		region: 'center',
		margins:'3 0 3 3',
		master_column_id : 'expandir',
		autoExpandColumn:'expandir',
		stripeRows: true,
		sm:_this.smTGElementosPlanificacion,
		root_title:'->',
		loadMask:{msg :'Cargando elementos de la planificaci&oacute;n'},
		columns: [
			_this.smTGElementosPlanificacion,
			{header:'<center>CAR</center>' , dataIndex: 'idelemento',width:80},
			{id:'expandir',header: '<center>Denominación</center>',dataIndex: 'denelemento'},
			{header: '<center>Fecha de inicio</center>', width:80,  type:'date',dataIndex: 'fechainicio'},
			{header: '<center>Fecha de fin</center>', width:80,  type:'date',dataIndex: 'fechafin'},			
			{header: '<center>Autor</center>',width:80,dataIndex: 'nombreautor'},
			{header: '<center>Estado de aprobaci&oacute;n</center>',width:150,dataIndex: 'estadoaprobacion'},
			{header: '<center>Estado de cumplimiento</center>',width:165, dataIndex: 'estadocumplimiento'}
		],
		bbar:_this.objclassPaginadoTreegrid.barraPaginado,
		listeners:
		{			   
		}
	});


	//panel lateral derecho para la busqueda de elementos
	this.pBusquedaElementos = new Ext.Panel({
		title:'Opciones de b&uacute;squeda',
		id:'pBusquedaElementos',
		layout:'fit',
		width:300,
		collapsible: true,
		collapsed: true,
		margins:'3 3 3 3',
		region: 'east'
		//buttons:[btnBuscarActSeg]
	});


	//Panel contenedor del grid de actividades  
	this.psubCentral = new Ext.Panel({
		layout:'border',
		id:'psubCentral',
        usarKeymap:true,
        botonesKeymap:[btnAdicionar, btnModificar, btnEliminar],
		tbar:['-',_this.btnAdicionar, _this.btnModificar, _this.btnEliminar,'-'],
		items:[_this.gdTGElementosPlanificacion,_this.pBusquedaElementos]
	});

		
		
	// viewport de la plantilla
	this.WinPrincipal = new Ext.Window({
		//id:'WinPrincipal',
		title:'<center>Registro de elementos de la planificaci&oacute;n</center>',
		layout:'fit',
		closable:false,
		graggable:false,
		maximized:true,
		tbar:['-','Aprobaci&oacute;n-conciliaci&oacute;n :',' ',_this.cbaprob_conc,' ','Estado :',' ',_this.cbestados],
		items:[ _this.psubCentral]
	})
	
	
	
	//funcion donde se procede a cargar el tree grid con los elementos de la planificacion
	this.CargarElementosPlanificacion = function()
	{
		if(_this.opcionBusqueda == 3 || _this.opcionBusqueda == 4)
		{

			
			if(_this.opcionBusqueda == 4)
			{
			}
			_this.storeTGElementosPlanificacion.removeAll();
			_this.storeTGElementosPlanificacion.reload();
		}	
	}
	
	
	//funcion que se ejecuta luego de ser seleccionado un elemento en el menu inicial
	this.MenuInicAccionClick = function()
	{
		_this.objcmpmenurelacionesdin.CrearMenuConceptosIniciales(_this.PostAccionesGestionar,_this.arrayidelementos);
		//WinPrincipal.show();
	}
	

	//funcion para cargar la interfaz de gestionar elementos
	this.CargarInterfazCmpgestionarElementos = function()
	{
		_this.opcionBusqueda = 4;
		_this.CargarElementosPlanificacion();
		 _this.WinPrincipal.show();
	}
	
	
	//funcion que se ejecuta luego de gestionar algun elemento
	this.PostAccionesGestionar = function()
	{
	
	}


	
	this.ActualizarEstadoBarraHerramientas = function()
	{
		
	}
	
	this.CargarInterfazCmpgestionarElementos();
}
