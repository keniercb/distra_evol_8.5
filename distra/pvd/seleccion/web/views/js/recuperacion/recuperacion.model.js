
/*
 * Recuperacion General.
 *
 * @author Ing. Orestes Rodríguez Lorenzo
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Recuperacion
 * @copyright XETID
 * @version 1.0
 */
 
Ext.ns('Pvd.Seleccion.Recuperacion');

Pvd.Seleccion.Recuperacion.Modelo = {
    init: function() {
        this.stRecCandidato = new Ext.data.GroupingStore({
            url: 'getRecCandidato',
            reader: new Ext.data.JsonReader({
                totalProperty : 'cantidad',
				root          : 'datos',
				id            : 'idcandidato'
            }, [{name: 'idcandidato'},
			    {name: 'nombre'},
			    {name: 'proceso'},
			    {name: 'fregistro'},
			    {name: 'estado'}
            ]),
			sortInfo   : {
							field: 'nombre',
							direction: "DESC"
						},
			groupField : 'nombre'
        });
		
		this.stProceso = new Ext.data.Store({
			url: 'getProcesoSeleccion',
			reader: new Ext.data.JsonReader(
                {root: "datos", id: "idproceso"},
                [{name:'idproceso'},{name:'denominacion'}]
            )	
		});
		
		this.stEstado = new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [
                ['0', 'En proceso'],
                ['1', 'Preseleccionado'],
                ['2', 'Seleccionado'],
                ['3', 'Excluido']
            ]
        });
    }
};