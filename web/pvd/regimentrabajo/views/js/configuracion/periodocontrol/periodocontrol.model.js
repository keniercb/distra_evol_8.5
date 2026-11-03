
 Ext.ns('Pvd.RegimenTrabajo.PeriodoControl');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.RegimenTrabajo.PeriodoControl.Modelo = {
    /*
     * Inicializar el modelo de la vista.
     */
    init: function() {
	
		//Fuente de datos del listado.
		this.fuenteDatosListado = new Ext.data.Store({
			url: 'listarPeriodoControl',
			reader: new Ext.data.JsonReader(
                {root: "datos", id: "idperiodocontrol", totalProperty: "cantidad"},
                [{name:'idperiodocontrol'}, {name:'descripcion'}, {name:'periodo'}, {name:'fdesde'}, {name:'fhasta'}]
            )	
		});
	}
};
