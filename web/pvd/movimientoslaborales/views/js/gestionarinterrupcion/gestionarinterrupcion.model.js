/*
 * Gestionar Interrupcion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Movimientoslaborales
 * @uses Pvd.Movimientoslaborales.Gestionarinterrupcion
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Movimientoslaborales.Gestionarinterrupcion');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Movimientoslaborales.Gestionarinterrupcion.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        //Fuente de datos del listado de interrupcion.
        var connObj = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getInterrupciones',
            method : 'POST'
        });

        this.stInterrupcion = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObj),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idinterrupcion", totalProperty: "cantidad"},
                [{name:'idinterrupcion'},{name:'idmotivointerrupcion'}, {name:'motivo'}, {name:'fdesde'}, {name:'estructura'},
                 {name:'fhasta'}, {name:'horas'}, {name:'observacion'}]
            ),
            sortInfo   : {
                field: 'estructura',
                direction: "DESC"
            },
            groupField : 'estructura',
            remoteGroup: true
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
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'}, {name:'area'}, {name:'orden'},
                    {name:'identidad'}, {name:'entidad'}, {name:'entidad_area'}, {name:'categoria'}, {name:'idcategoria'}]
            ),
            sortInfo   : {
                field: 'orden',
                direction: "DESC"
            },
            groupField : 'entidad_area',
            remoteGroup: true
        });


        //Fuente de datos del listado de motivos de interrupcion.
        this.stMotivos = new Ext.data.Store({
            url: 'getMotivosInterrupcion',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idmotivointerrupcion", totalProperty: "cantidad"},
                [{name:'idmotivointerrupcion'},{name:'denominacion'}, {name:'descripcion'}]
            )
        });
    }
};
