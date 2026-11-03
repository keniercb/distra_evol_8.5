
Ext.ns('RegimenTrabajo.Confestructuras');

RegimenTrabajo.Confestructuras.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        this.store = new Ext.data.GroupingStore({
            url: 'getConfigEstructuras',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idestructura", totalProperty: ""},
                [{name:'idestructura'},{name:'estructura'}, {name:'identidad'}, {name:'entidad'}]
            ),
            sortInfo   : {
                field: 'entidad',
                direction: "DESC"
            },
            groupField : 'entidad'
        });

        this.estructurapadre = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructuras',
            preloadChildren: false
        });

        this.estructuras = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructuras',
            preloadChildren: false
        });
		
	}
}