
/*
 * Gestionar procesos de idoneidad.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Idoneidad
 * @uses Pvd.Idoneidad.Procesoidoneidad
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Idoneidad.Procesoidoneidad');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Idoneidad.Procesoidoneidad.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        var connObj = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getProcesos',
            method : 'POST'
        });

        this.stProcesos = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObj),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idproceso", totalProperty: "cantidad"},
                [{name:'idproceso'},{name:'denominacion'}, {name:'fdesde'}, {name:'fhasta'}, {name:'idcomision'}, 
                 {name:'comision'},{name:'idestructura'}, {name:'estructura'}]
            ),
            sortInfo   : {
                field: 'estructura',
                direction: "DESC"
            },
            groupField : 'estructura',
            remoteGroup: true
        });

        this.stComisiones = new Ext.data.Store({
            url: 'getComisiones',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idcomision", totalProperty: ""},
                [{name:'idcomision'},{name:'denominacion'},{name:'idaccidentecomision'}]
            )
        });
        
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
    }
};
