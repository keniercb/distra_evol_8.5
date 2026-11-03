
/*
 * Gestionar necesidad.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Gestionarnecesidad
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Capacitacion.Gestionarnecesidad');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Capacitacion.Gestionarnecesidad.Modelo = {
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
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'}, {name:'idcargo'}, {name:'area'}, {name:'idarea'},
                 {name:'identidad'}, {name:'entidad'}, {name:'entidad_area'}, {name:'orden'}]
            ),
            sortInfo   : {
                field: 'orden',
                direction: "DESC"
            },
            groupField : 'entidad_area',
            remoteGroup: true,
            //groupOnSort: true
        });

        //Fuente de datos del listado de necesidades.
        this.stNecesidades = new Ext.data.Store({
            url: 'getNecesidades',
            baseParams: {activo: 1},
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "iddnecesidad", totalProperty: "cantidad"},
                [{name:'iddnecesidad'},{name:'idnecesidad'}, {name:'necesidad'}, {name:'idmodoformacion'}, {name:'modoformacion'},
                 {name:'idpersona'}, {name:'fregistro'}, {name:'fhasta'}, {name:'descripcion'}, {name:'historico'}]
            )
        });

        //Fuente de datos del listado de necesidades.
        this.stNecesidadesHist = new Ext.data.Store({
            url: 'getNecesidades',
            baseParams: {activo: 0},
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "iddnecesidad", totalProperty: "cantidad"},
                [{name:'iddnecesidad'},{name:'idnecesidad'}, {name:'necesidad'}, {name:'idmodoformacion'}, {name:'modoformacion'},
                    {name:'idpersona'}, {name:'fregistro'}, {name:'fhasta'}, {name:'descripcion'}, {name:'historico'}]
            )
        });

        //Fuente de datos del listado de tipos de necesidades.
        this.stTipoNec = new Ext.data.Store({
            url: 'getNecesidadesDeCapacitacion',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idnecesidad"},
                [{name:'idnecesidad'},{name:'necesidad'},{name:'descripcion'}]
            )
        });

        //Fuente de datos del listado de modos de formación.
        this.stModoFormacion = new Ext.data.Store({
            url: 'getModoFormacion',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idmodoformacion"},
                [{name:'idmodoformacion'},{name:'modoformacion'},{name:'descripcion'}]
            )
        });

        //Fuente de datos del listado de competencias.
        this.stCompetencias = new Ext.data.Store({
            url: 'getCompetenciasByCargo',
            reader: new Ext.data.JsonReader(
                {root: "", id: "iddcompetencia", totalProperty: "cantidad"},
                [{name:'iddcompetencia'},{name:'denominacion'}, {name:'nivelrequerido'}, {name:'nivelcertificado'}
                 , {name:'tipo'}, {name:'idoneo'}]
            )
        });
    }
};
