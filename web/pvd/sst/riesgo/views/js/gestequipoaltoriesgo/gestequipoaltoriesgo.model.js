
/*
 * Gestionar equipos de alto riesgo.
 *
 * @author Ing. Yaricel Guerra Velazquez
 * @package Pvd.Riesgo
 * @uses Pvd.Riesgo.Gestequipoaltoriesgo
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Riesgo.Gestequipoaltoriesgo');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Riesgo.Gestequipoaltoriesgo.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        //Fuente de datos del listado de valores del nomenclador de clasificacion del equipo.
        this.stClasifEquipo = new Ext.data.Store({
            url: 'getClasificaciones',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idclasifequipo"},
                [{name:'idclasifequipo'},{name:'denominacion'},{name:'descripcion'}]
            )
        });

        //Fuente de datos del listado de equipos de alto riesgos.
        var connObj = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getEquipoaltoriesgo',
            method : 'POST'
        });

        this.stEquipoRiesgos = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObj),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idequipoaltoriesgo", totalProperty: "cantidad"},
                [{name:'idequipoaltoriesgo'},{name:'idclasifequipo'}, {name: 'clasifequipo'}, {name:'idestructura'}, {name:'inventario'}, {name:'modelo'}, {name:'idpaisfabricante'},
                 {name:'paisfabricante'}, {name:'annofabricacion'}, {name:'serie'}, {name:'presioncalculo'}, {name:'presionautorizada'}, {name:'capacidadcalculo'},
                 {name:'capacidadautorizada'}, {name:'ubicacion'}, {name:'estructura'}, {name: 'denominacion'}, {name: 'pais'}]
            ),
            sortInfo   : {
                field: 'estructura',
                direction: "DESC"
            },
            groupField : 'estructura',
            remoteGroup: true
        });
        
        //Fuente de datos del listado de inspeccion tecnica.
        this.stInspecciones = new Ext.data.GroupingStore({
            url: 'getInspecciones',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idinspeccionequipo", totalProperty: "cantidad"},
                [{name:'idinspeccionequipo'},{name:'idequipoaltoriesgo'}, {name: 'tipoinspeccion'}, {name: 'resultadoinspeccion'},
                 {name:'idtipoinspeccion'}, {name: 'idresultadoinspeccion'},{name:'fplan'}, {name:'finspeccion'}, {name: 'cantd'}]
            ),
            sortInfo: {
                field: 'tipoinspeccion',
                direction: "DESC"
            },
            groupField: 'tipoinspeccion',
            remoteGroup: true
        });
        
        //Fuente de datos del listado de observaciones.
        this.stObservaciones = new Ext.data.Store({
            url: 'getObservaciones',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idobservacionequipo", totalProperty: "cantidad"},
                [{name:'idobservacionequipo'},{name:'idequipoaltoriesgo'}, {name:'observacion'}, {name:'fregistro'}]
            )
        });

        this.stPais = new Ext.data.Store({
            url: 'getPaises',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idpais"},
                [{name: 'idpais'}, {name: 'nombrepais'}]
            )
        });

        this.stTipoInspeccion = new Ext.data.Store({
            url: 'getTipoInspecciones',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idtipoinspeccion"},
                [{name: 'idtipoinspeccion'}, {name: 'denominacion'}, {name: 'descripcion'}]
            )
        });

        this.stResultadoInspeccion = new Ext.data.Store({
            url: 'getResultadoInspeccion',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idresultadoinspeccion"},
                [{name: 'idresultadoinspeccion'}, {name: 'denominacion'}, {name: 'descripcion'}]
            )
        });

    }
};
