 Ext.ns('Pvd.RegimenTrabajo.TurnoTrabajo');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.RegimenTrabajo.TurnoTrabajo.Modelo = {
    /*
     * Inicializar el modelo de la vista.
     */
    init: function() {
	
		//Fuente de datos del listado.
		this.fuenteDatosListado = new Ext.data.Store({
			url: 'listarTurnoTrabajo',
			reader: new Ext.data.JsonReader(
                {root: "datos", id: "idturnotrabajo", totalProperty: "cantidad"},
                [{name:'idturnotrabajo'},{name:'denominacion'}, {name:'descripcion'}, {name:'fdesde'}, {name:'fhasta'}, {name:'horainicio'}, {name:'horafin'}, {name:'toleranciaentrada'}, {name:'toleranciasalida'}, {name:'horarioalmuerzo'}, {name:'tiempodescanso'}, {name:'otrodia'} ]
            )	
		});

        this.estructurapadre = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructura',
            preloadChildren: false
        });
	}
};
