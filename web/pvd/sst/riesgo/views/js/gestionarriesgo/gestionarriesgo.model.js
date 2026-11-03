
/*
 * Gestionar riesgo.
 *
 * @author Ing. Eddy Santana Navarro
 * @package Pvd.Riesgo
 * @uses Pvd.Riesgo.Gestionarriesgo
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Riesgo.Gestionarriesgo');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Riesgo.Gestionarriesgo.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        //Fuente de datos del listado de valores del nomenclador de riesgo.
        this.stNomRiesgo = new Ext.data.Store({
            url: 'getNomRiesgo',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idnriesgo"},
                [{name:'idnriesgo'},{name:'denominacion'},{name:'descripcion'}]
            )
        });
        
        //Fuente de datos del listado de estados de riesgo.
        this.stFrecuencia = new Ext.data.Store({
            url: 'getFrecuenciaRiesgo',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idfrecuencia"},
                [{name:'idfrecuencia'},{name:'denominacion'},{name:'descripcion'}]
            )
        });
        
        //Fuente de datos del listado de probabilidad.
        this.stProbabilidad = new Ext.data.Store({
            url: 'getProbabilidad',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idprobabilidad"},
                [{name:'idprobabilidad'},{name:'denominacion'},{name:'descripcion'}]
            )
        });
        
        //Fuente de datos del listado de nivel de riesgo.
        this.stNivelRiesgo = new Ext.data.Store({
            url: 'getNivelRiesgo',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idnivelriesgo"},
                [{name:'idnivelriesgo'},{name:'denominacion'},{name:'descripcion'}]
            )
        });

        //Fuente de datos del listado de riesgos.
        var connObj = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getRiesgo',
            method : 'POST'
        });

        this.stRiesgos = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObj),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idriesgo", totalProperty: "cantidad"},
                [{name:'idriesgo'},{name:'idnriesgo'}, {name:'idestructura'}, {name:'descripcion'}, {name:'fdeteccion'}, {name:'idfrecuencia'},
                 {name:'idprobabilidad'}, {name:'idnivelriesgo'}, {name:'idaccmejoramiento'}, {name:'denomriesgo'}, {name:'frecuencia'}, {name:'probabilidad'},
                 {name:'nivelriesgo'}, {name:'accmejoramiento'}, {name:'estructura'}, {name: 'gradopeligrosidad'}, {name: 'magnitud'}, {name: 'idsistema'}, {name: 'sistema'},
                  {name: 'idpartesistema'}, {name: 'partesistema'}]
            ),
            sortInfo   : {
                field: 'estructura',
                direction: "DESC"
            },
            groupField : 'estructura',
            remoteGroup: true
        });
        
        //Fuente de datos del listado de medidas.
        this.stMedidas = new Ext.data.Store({
            url: 'getMedidas',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idmedida", totalProperty: "cantidad"},
                [{name:'idmedida'},{name:'idriesgo'}, {name:'medida'}, {name:'responsable'}, {name:'fcumplimiento'}]
            )
        });
        
        //Fuente de datos del listado de recursos.
        this.stRecursos = new Ext.data.Store({
            url: 'getRecursos',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "iddrecurso", totalProperty: "cantidad"},
                [{name:'iddrecurso'},{name:'idriesgo'}, {name:'idrecurso'}, {name:'recurso'}, {name:'descripcion'}, {name:'fdesde'}, {name:'fhasta'}]
            )
        });
        
        //Fuente de datos del listado de valores del nomenclador de recurso.
        this.stNomRecurso = new Ext.data.Store({
            url: 'getNomRecurso',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idrecurso"},
                [{name:'idrecurso'},{name:'denominacion'},{name:'descripcion'}]
            )
        });


        //Fuente de datos del listado de los eventos
        this.stEventos = new Ext.data.Store({
            url: 'getEventosRiesgo',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idriesgoevento", totalProperty: "cantidad"},
                [{name:'idriesgoevento'},{name:'idriesgo'}, {name:'idevento'}, {name:'evento'}, {name:'fregistro'}, {name: 'observaciones'}]
            )
        });

        this.stNomEventos = new Ext.data.Store({
            url: 'getEventos',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idevento"},
                [{name: 'idevento'}, {name: 'denominacion'}, {name: 'descripcion'}]
            )
        });

        this.stSistema = new Ext.data.Store({
            url: 'getSistemas',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idsistema"},
                [{name: 'idsistema'}, {name: 'denominacion'}, {name: 'descripcion'}]
            )
        });

        this.stParteSistema = new Ext.data.Store({
            url: 'getPartesSistemas',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idpartesistema"},
                [{name: 'idpartesistema'}, {name: 'denominacion'}, {name: 'descripcion'}]
            )
        });

        this.stNomConsecuencias = new Ext.data.Store({
            url: 'getConsecuencias',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idconsecuencia"},
                [{name: 'idconsecuencia'}, {name: 'denominacion'}, {name: 'descripcion'}]
            )
        });

        this.stConsecuencias = new Ext.data.Store({
            url: ' getConsecuenciasRiesgo',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idrconsecuencia"},
                [{name: 'idrconsecuencia'}, {name: 'idconsecuencia'}, {name: 'consecuencia'}, {name: 'fregistro'},
                  {name: 'observaciones'}, {name: 'principal'}]
            )
        });

        this.stNomPeligros = new Ext.data.Store({
            url: 'getPeligros',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idpeligro"},
                [{name: 'idpeligro'}, {name: 'denominacion'}, {name: 'descripcion'}]
            )
        });

        this.stPeligros = new Ext.data.Store({
            url: ' getPeligrosRiesgo',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idrpeligro"},
                [{name: 'idrpeligro'}, {name: 'idpeligro'}, {name: 'peligro'}, {name: 'fregistro'}, {name: 'observaciones'}]
            )
        });
    }
};
