/*
 * Gestionar plantillas.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Documentos
 * @uses Pvd.Documentos.Plantillas
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Documentos.Plantillas');

Pvd.Documentos.Plantillas.Modelo = {
    init: function() {
        //Fuente de datos del listado.
        this.stPlantillas = new Ext.data.Store({
            url: 'getPlantillas',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idplantilladoc", totalProperty: "cantidad"},
                [{name:'idplantilladoc'},{name:'denominacion'},{name:'contenido'},{name:'tipos'}, {name:'descripcion'},
                 {name:'fdesde'}, {name:'fhasta'}, {name:'identidad'}, {name: 'entidad'}, {name:'contenido'}, {name: 'configuraciones'}]
            )
        });

        this.stConfiguraciones = new Ext.data.Store({
            url: 'getConfiguraciones',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idconfiguracion", totalProperty: "cantidad"},
                [{name:'idconfiguracion'},{name:'denominacion'}]
            )
        });

        this.stConfAsignacion = new Ext.data.GroupingStore({
            reader: new Ext.data.ArrayReader({idProperty: 'id'}, [
                {name: 'id', type: 'int'},
                {name: 'dominio'},
                {name: 'funcionalidad'}
            ]),
            sortInfo   : {
                field: 'dominio',
                direction: "DESC"
            },
            groupField : 'dominio'
        });

        this.tlTipoDoc = new Ext.tree.TreeLoader({
            dataUrl: 'getTipoDocumentos',
            preloadChildren: false
        });
    }
};
