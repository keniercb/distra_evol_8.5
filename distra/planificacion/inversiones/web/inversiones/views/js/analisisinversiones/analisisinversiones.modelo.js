Ext.ns('Gestionar.analisisinversiones');


Gestionar.analisisinversiones.Modelo = {
    init: function() {
        _this = this;

        _this.loaderTreeinversiones = new Ext.tree.TreeLoader({
            dataUrl: 'cargarTreeNomencladores',
            autoLoad: true,
            listeners: {
                beforeload: function(tree, node, res) {
                    tree.baseParams.valor = Ext.getCmp('idfiltroent').getValue();
                }
            }
        });
        
        _this.stCbejercicio = new Ext.data.Store({
            url: 'listarEjercicios',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "data",
                id: 'idejercicio'
            }, [{
                    name: 'idejercicio'
                }, {
                    name: 'ejercicio'
                }, {
                    name: 'idestado'
                }])
        });
    }
};