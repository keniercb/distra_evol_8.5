/*
 * Ranking de trabajadores por cargo.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Competencia
 * @uses Pvd.Competencia.Rankingcargo
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Competencia.Rankingcargo');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Competencia.Rankingcargo.Modelo = {
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
                    {name:'identidad'}, {name:'entidad'}, {name:'entidad_area'}, {name:'idcargo'}]
            ),
            sortInfo   : {
                field: 'entidad_area',
                direction: "DESC"
            },
            groupField : 'entidad_area',
            remoteGroup: true
        });

        var connObjR = new Ext.data.Connection({
            timeout : 3600000,
            url: 'ejecutarRanking',
            method : 'POST'
        });
        
        this.stRanking = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObjR),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'}, {name:'area'}, {name:'idarea'},
                    {name:'identidad'}, {name:'entidad'}, {name:'entidad_area'}, {name:'idcargo'}, {name:'rendimiento'}]
            ),
            sortInfo   : {
                field: 'entidad_area',
                direction: "DESC"
            },
            groupField : 'entidad_area',
            remoteGroup: true
        });
    }
};
