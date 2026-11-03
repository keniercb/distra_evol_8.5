
Ext.ns('Pvd.ControlAsistencia.Indicadores');

Pvd.ControlAsistencia.Indicadores.Modelo = {
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
				,{name: 'gestionable'}
				,{name: 'unidadmedida'}
				,{name: 'idexpresionmatematica'}
				,{name: 'denidexpresionmatematica'}
				,{name: 'formula'}
				,{name: 'orden'}
				])
			,
			sortInfo :{field: "orden", direction: "ASC"}
				
		});

		this.stIndicadores = new Ext.data.Store({
			url: 'getIndicadoresReporte',
			reader:new Ext.data.JsonReader({totalProperty: 'quantity', root: 'data', id: 'idindicador'},
				[
					{name: 'idindicador'}
					,{name: 'denominacion'}
					,{name: 'fdesde'}
					,{name: 'fhasta'}
					,{name: 'descripcion'}
					,{name: 'unidadmedida'}
					,{name: 'gestionable'}
					,{name: 'idexpresionmatematica'}
					,{name: 'denidexpresionmatematica'}
					,{name: 'formula'}
					,{name: 'orden'}
				])
			,
			sortInfo :{field: "orden", direction: "ASC"}

		});

		this.stGestIndicadores = new Ext.data.Store({
			url: 'getTodosIndicadores',
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