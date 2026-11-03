/*
 *Certificar competencias.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Competencia
 * @uses Pvd.Competencia.Certificarcompetencias
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Competencia.Certificarcompetencias');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Competencia.Certificarcompetencias.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        //Fuente de datos del listado de personas.
        var connObjPer = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getPersonas',
            method : 'POST'
        });

        this.stPersonas = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObjPer),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idsituacionlaboralp", totalProperty: "cantidad"},
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'}, {name:'area'}, {name:'idarea'},
                 {name:'identidad'}, {name:'entidad'}, {name:'entidad_area'}, {name:'orden'}, {name:'idcargo'}, {name:'idsituacionlaboralp'}]
            ),
            sortInfo   : {
                field: 'orden',
                direction: "DESC"
            },
            groupField : 'entidad_area',
            remoteGroup: true
        });

        //Fuente de datos del listado de competencias.
        this.stCompetencia = new Ext.data.GroupingStore({
            url: 'getCompetenciasByPersona',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idcompetenciapersona", totalProperty: ""},
                [{name:'idcompetenciapersona'},{name:'idcompetencia'},{name:'competencia'}, {name:'fdesde'}, {name:'fhasta'},
                 {name:'idpersona'}, {name:'valor'}, {name:'cargo'}, {name:'idcertificacion'}, {name:'idpersonaevaluacion'},
                 {name:'fdesdec'}, {name:'fhastac'}, {name:'periodo'}, {name:'proceso'}, {name:'certificacionactiva'},
                 {name:'idaccionparticipante'}]
            ),
            sortInfo   : {
            field: 'cargo',
                direction: "DESC"
            },
            groupField : 'cargo',
            remoteGroup: true
        });

        this.stCompCargo = new Ext.data.Store({
            url: 'getCompetenciasByCargo',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idcompetencia", totalProperty: "cantidad"},
                [{name:'idcompetencia'}, {name:'competencia'}, {name:'descripcion'},{name:'idcompetenciapersona'},
                    {name:'idescala'}, {name:'idvalor'}, {name:'valor'}, {name:'fdesde'}, {name:'fhasta'}, {name:'cargo'}]
            )
        });

        this.stCompNom = new Ext.data.Store({
            url: 'getCompetenciasNom',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idcompetencia", totalProperty: "cantidad"},
                [{name:'idcompetencia'}, {name:'denominacion'}, {name:'descripcion'},{name:'idescala'}]
            )
        });

        this.stValores = new Ext.data.Store({
            url: 'getValoresEscala',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idvalor"},
                [{name:'idvalor'}, {name:'valor'}]
            )
        });

        this.stEvaluaciones = new Ext.data.GroupingStore({
            url: 'getEvalByPersona',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersonaevaluacion", totalProperty: "cantidad"},
                [{name:'idpersonaevaluacion'}, {name:'proceso'}, {name:'denominacion'},
                 {name:'fiperiodo'}, {name:'ffperiodo'}, {name:'valor'}]
            ),
            sortInfo   : {
                field: 'proceso',
                direction: "DESC"
            },
            groupField : 'proceso',
            remoteGroup: true
        });

        this.stAcciones = new Ext.data.Store({
            url: 'getAccionByPersona',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idaccionparticipante"},
                [{name:'idaccionparticipante'}, {name:'denominacion'}, {name:'terminado'}, {name:'resultado'}]
            )
        });
    }
};
