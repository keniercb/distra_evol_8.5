
/*
 * Idoneidad de la persona en su cargo.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Competencia
 * @uses Pvd.Competencia.Idoneidadpersonacargo
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Competencia.Idoneidadpersonacargo');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Competencia.Idoneidadpersonacargo.Modelo = {
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
                 {name:'identidad'}, {name:'entidad'}, {name:'entidad_area'}, {name:'orden'}, {name:'idcargo'}, {name:'idoneo'},
                  {name:'tipo'}, {name:'idsituacionlaboralp'}]
            ),
            sortInfo   : {
                field: 'orden',
                direction: "DESC"
            },
            groupField : 'entidad_area',
            remoteGroup: true
        });

        //Fuente de datos del listado de personas.
        var connObjPer2 = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getIdoneidad',
            method : 'POST'
        });

        this.stPersonas2 = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObjPer2),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'}, {name:'area'}, {name:'idarea'},
                    {name:'identidad'}, {name:'entidad'}, {name:'entidad_area'}, {name:'orden'}, {name:'idcargo'}, {name:'idoneo'}]
            ),
            sortInfo   : {
                field: 'orden',
                direction: "DESC"
            },
            groupField : 'entidad_area',
            remoteGroup: true
        });

        var connObjPerAll = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getPersonasAll',
            method : 'POST'
        });

        this.stPersonasAll = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObjPerAll),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'}, {name:'area'}, {name:'idarea'},
                    {name:'identidad'}, {name:'entidad'}, {name:'entidad_area'}, {name:'orden'}, {name:'idcargo'}, {name:'idoneo'}]
            ),
            sortInfo   : {
                field: 'orden',
                direction: "DESC"
            },
            groupField : 'entidad_area',
            remoteGroup: true
        });

        //Fuente de datos del listado de competencias.
        this.stCompetencias = new Ext.data.Store({
            url: 'getCompetenciasByCargo',
            reader: new Ext.data.JsonReader(
                {root: "", id: "iddcompetencia", totalProperty: "cantidad"},
                [{name:'iddcompetencia'},{name:'denominacion'},{name:'descripcion'}, {name:'nivelrequerido'}, {name:'nivelcertificado'},
                 {name:'pesor'}, {name:'pesoc'}, {name:'tipo'}, {name:'idoneo'}]
            )
        });

        this.tlcargos = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructuraCargo',
            preloadChildren: false
        });
    }
};
