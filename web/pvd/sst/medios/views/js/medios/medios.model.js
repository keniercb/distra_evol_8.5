/*
 * Gestionar riesgo.
 *
 * @author Ing. Beatriz Selema Alvarez
 * @package Pvd.Riesgo
 * @uses Pvd.Riesgo.Gestionarriesgo
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Medios.Gestionarmedio');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Medios.Gestionarmedio.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {

        //Fuente de datos del listado de valores del nomenclador de riesgo.
        this.stNomMedios = new Ext.data.Store({
            url: 'getNomMedio',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idmedio"},
                [
                    {name: 'idmedio'},
                    {name: 'denominacion'},
                    {name: 'descripcion'}
                ]
            )
        });



        //Fuente de datos del listado de riesgos.
//        var connObj = new Ext.data.Connection({
//            timeout: 3600000,
//            url: 'getMedios',
//            method: 'POST'
//        });

        this.stMedios = new Ext.data.GroupingStore({
          //  proxy: new Ext.data.HttpProxy(connObj),
            url: 'getMedios',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "iddmedio", totalProperty: "cantidad"},
                [
                    {name: 'iddmedio'},
                    {name: 'idmedio'},
                    {name: 'idestructura'},
                    {name: 'denominacion'},
                    {name: 'estructura'},
                    {name: 'cantidad'}
                ]
            ),
            sortInfo: {
                field: 'estructura',
                direction: "DESC"
            },
            groupField: 'estructura',
            remoteGroup: true
        });


    }
};
