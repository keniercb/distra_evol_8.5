
/*
 * Gestionar recién graduado.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Gestionarreciengraduado
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Capacitacion.Gestionarreciengraduado');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Capacitacion.Gestionarreciengraduado.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        //Fuente de datos del listado de personas.
        var connObjPer = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getRecienGraduado',
            method : 'POST'
        });

        this.stRecienGraduados = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObjPer),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idreciengraduado", totalProperty: "cantidad"},
                [{name:'idreciengraduado'},{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'idjefeinmediato'}, {name:'jefeinmediato'}, {name:'idtutor'},
                 {name:'tutor'}, {name:'fdesde'}, {name:'tiempo'}, {name: 'tiempoper'}, {name:'fhastass'}, {name:'area'}, {name: 'idarea'}, {name:'ffinprep'}, {name: 'periodo'}, {name: 'idperiodo'}]
            ),
            sortInfo   : {
                field: 'area',
                direction: "DESC"
            },
            groupField : 'area',
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
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidosorden'}, {name:'cargo'}, {name:'area'}, {name:'idarea'},
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

        this.tlcargos = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructuraCargo',
            preloadChildren: false
        });

        this.stExtensiones = new Ext.data.Store({
            url: 'getExtensiones',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idextensionprep"},
                [{name:'idextensionprep'}, {name:'idreciengraduado'}, {name:'tiempo'}, {name:'fextension'}, {name:'fhasta'}]
            )
        });

        this.stIndRG = new Ext.data.Store({
            url: 'getIndicadoresRecienG',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idrgindicador", totalProperty: "cantidad"},
                [{name: 'idrgindicador'}, {name: 'idindicador'}, {name: 'indicador'}, {name: 'idevalrg'},
                 {name: 'fregistro'}, {name: 'idescala'}, {name: 'idvalor'}, {name: 'valor'}, {name: 'idreciengraduado'}]
            )
        });

        this.stPeriodosRG = new Ext.data.Store({
            url: 'getPeriodos',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idrgperiodo", totalProperty: "cantidad"},
                [{name: 'idrgperiodo'}, {name: 'denominacion'}, {name: 'fdesde'}, {name: 'fhasta'}]
            )
        });

        //Fuente de datos del listado de indicadores.
        this.stIndicadores = new Ext.data.Store({
            url: 'getIndicadores',
            baseParams: {activo: 1},
            reader: new Ext.data.JsonReader(
                {root: "", id: "idindicador"},
                [{name: 'idindicador'}, {name: 'denominacion'},
                    {name: 'fdesde'}, {name: 'fhasta'}, {name: 'descripcion'}]
            )
        });

        this.stValores = new Ext.data.Store({
            url: 'getValoresInd',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idvalor"},
                [{name: 'idvalor'}, {name: 'valor'}]
            )
        });
    }
};
