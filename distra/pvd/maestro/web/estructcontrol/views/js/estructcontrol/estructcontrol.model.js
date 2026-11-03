Ext.ns('Pvd.Maestro.EstructuraControl');
//Modelo de la vista del componente.
Pvd.Maestro.EstructuraControl.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        this.stDominios = new Ext.data.Store({
            url: 'getDominios',
            reader: new Ext.data.JsonReader(
                {root: "", id: "iddominio", totalProperty: "cantidad"},
                [{name:'iddominio'},{name:'denominacion'}]
            )
        });

        this.stEstControl = new Ext.data.GroupingStore({
            url: 'getEstructurasControl',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idestructuracontrol", totalProperty: "cantidad"},
                [{name:'idestructuracontrol'},{name:'denominacion'},{name:'dominio'},{name:'iddominios'},{name:'estructura'},
                 {name:'idestructura'}, {name:'entidad'}]
            ),
            sortInfo   : {
                field: 'entidad',
                direction: "DESC"
            },
            groupField : 'entidad',
            remoteGroup: true
        });

        this.stEstControlPlantillas = new Ext.data.Store({
            url: 'getEstructurasControl',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idestructuracontrol"},
                [{name:'idestructuracontrol'},{name:'denominacion'}]
            )
        });

        this.tlentidades = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructura',
            preloadChildren: false
        });
	}
};

