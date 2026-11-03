/*
 * Gestionar proceso de selección.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Gestionarprocesoseleccion
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Seleccion.Gestionarprocesoseleccion');

Pvd.Seleccion.Gestionarprocesoseleccion.Modelo = {
    init: function() {
				
		//Fuente de datos del listado.
		this.stProcesosSeleccion = new Ext.data.GroupingStore({
			url: 'getProcesosSeleccion',
			reader: new Ext.data.JsonReader(
                {root: "datos", id: "idproceso", totalProperty: "cantidad"},
                [{name:'idproceso'},{name:'tecnicasexpiradas'},{name:'estado'},{name:'comitesexpirados'},
                 {name:'cantd'},{name:'planillasexpiradas'},{name:'idexpresion'},{name:'cargos'},{name:'denominacion'},
                 {name:'descripcion'},{name:'recurso'}, {name:'fdesde'}, {name:'fhasta'}, {name:'idestructura'},
                 {name:'estructura'}, {name:'contratar'}, {name:'otro'}]
            ),
            sortInfo: {field: 'otro', direction: "ASC"},
            groupField: 'estado'
		});

        this.stEntidades = new Ext.data.Store({
            url: 'getEntidades',
            reader: new Ext.data.JsonReader(
                {root: "", id: "identidad", totalProperty: ""},
                [{name:'identidad'},{name:'denominacion'}]
            )
        });

		this.stCargos = new Ext.data.Store({
			url: 'getCargos',
			reader: new Ext.data.JsonReader(
                {root: "", id: "idcargo", totalProperty: ""},
                [{name:'idcargo'},{name:'denominacion'}, {name:'especializacion'}]
            ),
            sortInfo:  {field: 'denominacion', direction: 'ASC'}
        });
		
		this.stComite = new Ext.data.Store({
			url: 'getComite',
			reader: new Ext.data.JsonReader(
                {root: "", id: "idcomision", totalProperty: "cantidad"},
                [{name:'idcomision'},{name:'denominacion'}]
            )	
		});
		
		this.stTecnicasSeleccionAs = new Ext.data.Store({
            url: 'getTecPlanillaByProces',
            reader: new Ext.data.JsonReader({root: "datos",totalProperty: "cantidad"}, [
                {name: 'idprocesotecnica'},
                {name: 'planillasexp'},
                {name: 'modelomatematico'},
                {name: 'planilla'},
                {name: 'idmodelo'},
                {name: 'validez'},
				{name: 'unidad'},
                {name: 'idescala'},
                {name: 'idtecnica'},
                {name: 'fdesde'},
                {name: 'fhasta'},
                {name: 'orden'},
                {name: 'ordenOriginal', convert: function (val, arr){return arr.orden;}},
				{name: 'hito'},
                {name: 'condicion'},
				{name: 'valor'},
                {name: 'cantd'}
            ])
        });
		
		this.stPlanillas = new Ext.data.Store({
            url: 'getPlanillasevaluativas',
            reader: new Ext.data.JsonReader({
                root: "data"
            }, [{name: 'idplanilla'},
                {name: 'denominacion'},
                {name: 'descripcion'}
            ])
        });
		
		this.stModelos = new Ext.data.Store({
            url: 'getModelosbyPlanilla',
            reader: new Ext.data.JsonReader({
                root: ''
            }, [
                {name: 'idmodelo'},
                {name: 'denominacion'},
                {name: 'descripcion'},
                {name: 'idplanilla'},
                {name: 'idescala'}
            ])
        });
		
		this.stCondicion = new Ext.data.SimpleStore({
            fields: [
                {name: 'idcondicion'},
                {name: 'condicion'}
            ],
            data: [
                ['==', 'Igual'],
                ['>', 'Mayor que'],
                ['<', 'Menor que'],
                ['>=', 'Mayor igual que'],
                ['<=', 'Menor igual que']
            ]
        });
		
		this.stValor = new Ext.data.Store({
            url: 'getValoresbyIdEscala',
            reader: new Ext.data.JsonReader({
                root: 'datos',
				id: 'id'
            }, [
                {name: 'idescala'},
                {name: 'denominacion'},
                {name: 'id'}
            ])
        });
		
		this.stResponsableTecnica = new Ext.data.GroupingStore({
            url: 'getResponsableTecnicaSeleccion',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: 'idcomisionpersona'
            }, [
				{name: 'idcomisionpersona'},
				{name: 'comision'},
				{name: 'cargocomision'},
                {name: 'numid'},
                {name: 'nombreyapellidos'},
                {name: 'idprocesotecnica'}
            ]),			
			sortInfo: {field: 'comision', direction: "ASC"},
			groupField: 'comision'
        });
		
		this.stPersonas = new Ext.data.GroupingStore({
			url: ' getPersonasByProceso',
			reader:  new Ext.data.JsonReader(
			{totalProperty: 'cantidad', root: 'datos', id: 'idcomisionpersona'},
			[
				{name: 'idcomisionpersona'}
				,{name: 'idpersona'}
				,{name: 'cargocomision'}
				,{name: 'numid'}	
				,{name: 'nombreyapellidos'}
				,{name: 'comision'}
			]
		),			
			sortInfo: {field: 'comision', direction: "ASC"},
			groupField: 'comision'
		});	
		
		this.tlMenuSeleccion = new Ext.tree.TreeLoader({
            dataUrl: 'getMenuSeleccion',
            preloadChildren: true
        });

		this.stUnidad = new Ext.data.SimpleStore({
            fields: ['id','tipo'],
            data: [
                [1,'Día'],
                [2,'Mes'],
                [3,'Año']
            ]
        });

        //Fuente de datos del listado de competencias.
        this.stCompetencias = new Ext.data.Store({
            url: 'getCompetenciasByProceso',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idcompetencia", totalProperty: "cantidad"},
                [{name:'idcompetencia'},{name:'competencia'}]
            )
        });
    }
};
