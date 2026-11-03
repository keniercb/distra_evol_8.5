Ext.ns('Pvd.ControlAsistencia.GestPlantilla');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.GestPlantilla.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() { 
	
		this.fuenteDatosListadoPersonacargo = new Ext.data.Store({
			url: 'getPersonasencargo',
			reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersona", totalProperty: "quantity"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'},{name:'denomcargo'},{name:'denomarea'}]
            )	
		});

        this.fuenteDatosListadoPFP = new Ext.data.Store({
			url: 'getPersonasfueraplantilla',
			reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersona", totalProperty: "quantity"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'},{name:'denomsituacion'}]
            )
		});

        this.fuenteDatosListadoPersonacargoWin = new Ext.data.Store({
			url: 'getPersonasencargo',
			reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersona", totalProperty: "quantity"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'},{name:'denomcargo'},{name:'denomarea'}]
            )
		});

        this.fuenteDatosListado = new Ext.data.GroupingStore({
            url: 'getPersonasporcargo',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'},{name:'idcargo'},{name:'denomcargo'},{name:'idestructuraasistencia'},{name:'subordinacion'}
                    ,{name:'denomarea'},{name:'bandera'},{name:'padres'}]
            ),
            sortInfo:{field: 'subordinacion', direction: "ASC"},
            groupField:'subordinacion'
        });

        this.recQrElement = new Ext.data.Record.create(
            {name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'},{name:'idcargo'},{name:'denomcargo'},{name:'idestructuraasistencia'},{name:'subordinacion'}
            ,{name:'denomarea'},{name:'bandera'}
        );
		
		this.fuenteDatos= new Ext.tree.TreeLoader({
            url:'/pvd/regimentrabajo/index.php/gestplantilla/obtenerPersonasAsistencia'
        });
   
        this.fuenteDatosCargo= new Ext.tree.TreeLoader({
                url:'/pvd/regimentrabajo/index.php/gestplantilla/obtenerCargosAsistencia'
        });


	}
	
};

