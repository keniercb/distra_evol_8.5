Ext.ns('Pvd.Nomina.Recuperacion.Partidagasto');

//Modelo de la vista del componente Gestionar plantilla nominal.
Pvd.Nomina.Recuperacion.Partidagasto.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        this.stNominaPG = new Ext.data.GroupingStore({
             url: 'listarpornominapartidasgasto',
            groupField:'nomenclador',
            sortInfo:{field: 'nomenclador', direction: "DESC"},
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "dato",
                id: "idpartidagasto"
            }, [ {name: 'idpartidagasto'}
                ,{name: 'idtiponomina'}
                ,{name: 'nomenclador'}
                ,{name: 'partida'}
                ,{name: 'importe'}
                ,{name: 'cant'}

            ])
        });
        this.funstNominaPG = function(auxid, pidentidad,tipo){

            this.stNominaPG.removeAll();
            this.stNominaPG.baseParams.idelaborarpagos = Ext.encode(auxid);
            this.stNominaPG.baseParams.identidad = pidentidad;
            this.stNominaPG.baseParams.tipo = tipo;
            this.stNominaPG.load();

        };

        //Store del listado de plantillas nominales.


     	//Store del árbol de plantilla nominal.
		this.storeArbolPlantilla = new Ext.tree.TreeLoader({
            url:'obtenerEstructuraPlantillaNominal',
            baseParams: {idplantilla:0}
         });

        //Store del árbol de estructuras restantes.
        this.storeArbolRest = new Ext.tree.TreeLoader({
            url:'obtenerEstructuraRestante',
            baseParams: {identidad : 0}
         });

        //Store del árbol de estructuras insertadas.
        this.storeArbolInsert = new Ext.tree.TreeLoader({
            url:'obtenerEstructuraInsertadas',
            baseParams: {idplantilla : 0, identidad : 0 }
         });
		 
		//Store del cmbox area 
		this.cmbArea = new Ext.data.Store({
				url: 'obtenerArea',
				
				reader: new Ext.data.JsonReader(
					{root: "datos", id: "idarea"},
					[{name:'idarea'}, 
					{name:'area'}]
				),
				//autoLoad: true
		}); 
		 
   }
};