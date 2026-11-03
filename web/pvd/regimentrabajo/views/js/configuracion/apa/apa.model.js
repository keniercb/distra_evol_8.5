
Ext.ns('Pvd.ControlAsistencia.Apa');

Pvd.ControlAsistencia.Apa.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
	
		this.stListadoGrupoDescanso = new Ext.data.Store({
			url: 'getIndicadoresReporte',
			reader:new Ext.data.JsonReader({totalProperty: 'quantity', root: 'data', id: 'idindicador'},
			[
				{name: 'idindicador'}
				,{name: 'denominacion'}
				,{name: 'fdesde'}
				,{name: 'fhasta'}
				,{name: 'descripcion'}
				,{name: 'unidadmedida'}
				,{name: 'idexpresionmatematica'}
				,{name: 'formula'}
				,{name: 'orden'}
				]),
			sortInfo :{field: "orden", direction: "ASC"}
				
		});

		this.stIndicadores = new Ext.data.Store({
			url: 'getIndicadoresReporte',
			reader:new Ext.data.JsonReader({totalProperty: 'quantity', root: 'data', id: 'id'},
				[
					{name: 'idindicador'}
					,{name: 'denominacion'}
					,{name: 'fdesde'}
					,{name: 'fhasta'}
					,{name: 'descripcion'}
					,{name: 'unidadmedida'}
					,{name: 'idexpresionmatematica'}
					,{name: 'formula'}
					,{name: 'orden'}
				]),
			sortInfo :{field: "orden", direction: "ASC"}

		});

		this.stIndicadoresReportesVisualizar = new Ext.data.Store({
			url: 'getVistaReporte',
			reader:new Ext.data.JsonReader({totalProperty: 'quantity', root: 'data', id: 'idindicador'},
				[
					{name: 'idindicador'}
					,{name: 'denominacion'}
					,{name: 'fdesde'}
					,{name: 'fhasta'}
					,{name: 'descripcion'}
					,{name: 'formula'}
					,{name: 'orden'}
					,{name: 'causa'}
				]),
			sortInfo :{field: "orden", direction: "ASC"}

		});

		this.stGestIndicadores = new Ext.data.Store({
			url: 'getTodosIndicadores',
			reader:new Ext.data.JsonReader({totalProperty: 'quantity', root: 'data', id: 'id'},
				[
					{name: 'idindicador'}
					,{name: 'denominacion'}
					,{name: 'fdesde'}
					,{name: 'fhasta'}
					,{name: 'descripcion'}
					,{name: 'unidadmedida'}
					,{name: 'idexpresionmatematica'}
					,{name: 'formula'}
					,{name: 'causa'}
				])

		});
		
	
		this.stTregimen = new Ext.data.Store({
			url: 'getReporte',
			reader:  new Ext.data.JsonReader(
			{totalProperty: 'quantity', root: 'data', id: 'idreporte'},
			[
				{name: 'idreporte'}
				,{name: 'denominacion'}
				,{name: 'fdesde'}
				,{name: 'fhasta'}
				,{name: 'descripcion'}
				,{name: 'fechainicio'}
				,{name: 'fechafin'}
				,{name: 'estructura'}
				,{name: 'idestructura'}
			]
		)
		});

		this.stgpReporte = new Ext.data.Store({
			url: 'obtenerReporte',
			reader:  new Ext.data.JsonReader(
			{totalProperty: 'quantity', root: 'data'/*, id: 'idreporte'*/},
			[
				{name: 'idreporte'}
				,{name: 'denominacion'}
				,{name: 'fdesde'}
				,{name: 'fhasta'}
				,{name: 'descripcion'}


			]
		)

		});
		
		
		this.stListadoEventos= new Ext.data.Store({
			//url: 'getListadoEventosActivos',
			reader:new Ext.data.JsonReader({
				totalProperty: "cantidad",
				root: "datos",
				id: "idevento" 
			}, [{name: 'idevento'}			
				,{name: 'denominacion'}																
				])
		});	
		
	}
}