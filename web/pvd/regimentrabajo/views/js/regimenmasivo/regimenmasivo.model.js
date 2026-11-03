Ext.ns('Pvd.ControlAsistencia.RegimenMasivo');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.RegimenMasivo.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() { 
	
		this.fuenteDatosListado = new Ext.data.GroupingStore({
            remoteGroup: true,
            remoteSort: true,
			url: 'getPersonasporcargo',
			reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'},{name:'denomcargo'},{name:'idregimentrabajo'}
                    ,{name:'regimentrabajo'},{name:'idgrupodescanso'},{name:'grupotrabajo'},{name:'turnotrabajo'},{name:'idcargo'},{name:'idcargodrt'},{name:'denomentidadarea'},
                    {name:'path'},{name:'orden'},{name:'ordencargo'},{name:'fdesdert'},{name:'agrupador'}]
            ),
            sortInfo:{field: 'denomentidadarea', direction: "ASC"},
            groupField:'denomentidadarea'
		});

        this.storeRegimenTrabajo = new Ext.data.JsonStore({
            url: 'obtenerRegimenTrabajo',
            root: 'datos',
            fields:['idregimentrabajo','denominacion']
        });

        this.storeGrupoTrabajo = new Ext.data.JsonStore({
            url: 'obtenerGrupoTrabajo',
            root: 'datos',
            fields:['idgrupodescanso','denominacion']
        });

        this.storeTurnoTrabajo = new Ext.data.JsonStore({
            url: 'obtenerTurnoTrabajo',
            root: 'datos',
            fields:['idturnotrabajo','denominacion']
        });

        this.storeRegimenTrabajoBusq = new Ext.data.JsonStore({
            url: 'obtenerRegimenTrabajo',
            root: 'datos',
            fields: ['idregimentrabajo', 'denominacion']
        });

        this.storeGrupoTrabajoBusq = new Ext.data.JsonStore({
            url: 'obtenerGrupoTrabajo',
            root: 'datos',
            fields: ['idgrupodescanso', 'denominacion']
        });

        this.agrupador = [
            [1,'Área'],
            [2,'Régimen']
        ]

        this.storeagrupador = new Ext.data.SimpleStore({
            fields:[{name:'idagrupador'},{name:'denominacion'}]
        });
        this.storeagrupador.loadData(this.agrupador);

	}
	
};

