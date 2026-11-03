
 Ext.ns('Pvd.RegimenTrabajo.PatronRotacionTurnos');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.RegimenTrabajo.PatronRotacionTurnos.Modelo = {
    /*
     * Inicializar el modelo de la vista.
     */
    init: function() {
	
		//Fuente de datos del listado.
		this.fuenteDatosListado = new Ext.data.Store({
			url: 'listarRotacionTurnos',
			reader: new Ext.data.JsonReader(
                {root: "datos", id: "idrotacionturno", totalProperty: "cantidad"},
                [{name:'idrotacionturno'},{name:'denominacion'}, {name:'descripcion'}, {name:'fdesde'}, {name:'fhasta'}]
            )	
		});
        this.recQrElement = new Ext.data.Record.create(
            {name: 'idturnotrabajo'},
            {name: 'denominacion'},
            {name: 'cantdias'}
        );

        // create the data store
        this.fuenterecQrElement = new Ext.data.JsonStore({
            fields : [
                {name: 'idturnotrabajo'},
                {name: 'denominacion'},
                {name: 'cantdias'}
            ]
        });

       this.fuenteDatosListadoTurnos = new Ext.data.Store({
            url: 'listarTurnosTrabajo',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idturnotrabajo"},
                [{name:'idturnotrabajo'},{name:'denominacion'}]
            )
        });


    }
};
