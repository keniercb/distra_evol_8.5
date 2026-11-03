
Ext.ns('RegimenTrabajo.Nomregimentrabajoasist');

RegimenTrabajo.Nomregimentrabajoasist.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
	
		this.stListadoGrupoDescanso = new Ext.data.Store({
			url: 'getGrupoDescansoRegimenTrabajo',
			reader:new Ext.data.JsonReader({totalProperty: 'quantity', root: 'data', id: 'idgrupodescanso'}, 
			[
				{name: 'idregimentrabajo'}
				,{name: 'idgrupodescanso'}
				,{name: 'denominacion'}	
				,{name: 'fdesde'}			
				,{name: 'fhasta'}	
				,{name: 'descripcion'}
                ,{name: 'idestructura'}
                ,{name: 'estructura'}
                ,{name : 'predeterminado'}
            ])
				
		});
		
	
		this.stTregimen = new Ext.data.Store({
			url: 'getTipoRegimenTrabajo',
			reader:  new Ext.data.JsonReader(
			{totalProperty: 'quantity', root: 'data', id: 'idregimentrabajo'}, 
			[
				{name: 'idregimentrabajo'}
				,{name: 'denominacion'}	
				,{name: 'fdesde'}			
				,{name: 'fhasta'}	
				,{name: 'descripcion'}	
				,{name: 'horastrabajo'}
                ,{name : 'tipofondotiempo'}
                ,{name : 'fondotiempo'}
                ,{name : 'diaslaborables'}
				/*,{name: 'idestructura'}
                ,{name: 'estructura'}*/

			]
		)			
			
		});				

        //Store Tipo de Fondo de Tiempo
        this.stTipoFondoTiempo = new Ext.data.SimpleStore({
            fields: ['tipofondotiempo', 'denomtipofondotiempo','descripcion'],
            data : [[1,'Fondo de tiempo mensual','Fondo de tiempo laborable del mes']
				,[2,'Fondo de tiempo promedio anual','Promedio del fondo de tiempo laborable del año.']
				,[3,'Fondo de tiempo fijo','Fondo de tiempo fijo para el mes.']
                ,[4,'Fondo de tiempo límite','Fondo de tiempo límite para el mes.']]
        });

		this.stListadoTurnoTrabajo = new Ext.data.Store({
			url: 'obtenerTurnoTrabajo',
			reader: new Ext.data.JsonReader(
				{root: "datos", id: "idturnotrabajo", totalProperty: "cantidad"},
				[{name:'idturnotrabajo'},{name:'denominacion'}, {name:'descripcion'}, {name:'fdesde'}, {name:'fhasta'}, {name:'horainicio'}, {name:'horafin'}, {name:'toleranciaentrada'}, {name:'toleranciasalida'}, {name:'horarioalmuerzo'}, {name:'tiempodescanso'} ]
			)
		});

        this.estructurapadre = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructura',
            preloadChildren: false
        });
		
	}
}