Ext.ns('Costo.Procesos.Asociacion.Area');
Costo.Procesos.Asociacion.Area.Model = {
    init: function () {
        this.storeAreas = new Ext.data.JsonStore({
            url: 'cargarAsociaciones',
            autoLoad: true,
            root: 'data',
            totalProperty: "total",
            fields: [
                {
                    name: 'idarea'
                }, {
                    name: 'descripcion'
                }]
        });

        this.stcentronivel = new Ext.data.JsonStore({
            url: 'getCentrosByIdArea',
            root: 'data',
            totalProperty: "total",
            fields: [
                {
                    name: 'idcentro'
                }, {
                    name: 'codigo'
                }, {
                    name: 'text'
                }]
        });
    }
};