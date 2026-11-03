/*
 *Resumen individual de capacitación.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Resumenindividual
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Capacitacion.Resumenindividual');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Capacitacion.Resumenindividual.Modelo = {
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
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'}, {name:'area'}, {name:'idarea'},
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

        //Fuente de datos del listado de acciones actuales.
        this.stAcciones = new Ext.data.Store({
            url: 'getAcciones',
            baseParams: {activo: 1},
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idaccion", totalProperty: "cantidad"},
                [{name:'idaccion'},{name:'denominacion'}, {name:'fdesde'}, {name:'fhasta'}, {name:'idmodoformacion'}, {name:'modoformacion'},
                 {name:'idpersona'}, {name:'duracion'}, {name:'lugar'}, {name:'observacion'}]
            )
        });

        //Fuente de datos del listado de acciones hist.
        this.stAccionesHist = new Ext.data.Store({
            url: 'getAcciones',
            baseParams: {activo: 0},
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idaccion", totalProperty: "cantidad"},
                [{name:'idaccion'},{name:'denominacion'}, {name:'frdesde'}, {name:'frhasta'}, {name:'idmodoformacion'}, {name:'modoformacion'},
                 {name:'idpersona'}, {name:'duracion'}, {name:'lugar'}, {name:'observacion'}]
            )
        });
    }
};
