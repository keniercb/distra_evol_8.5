Ext.ns('Gestionar.gestdesagregctrlinversion');


Gestionar.gestdesagregctrlinversion.Modelo = {
    init: function() {
        _this = this;
        
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
        
        _this.loaderTreeinversiones = new Ext.tree.TreeLoader({
            dataUrl: 'cargarTreeNomencladores',
            autoLoad: true,
            listeners: {
                beforeload: function(tree, node, res) {
                    tree.baseParams.valor = Ext.getCmp('idfiltroent').getValue();
                }
            }
        });
        
        _this.stPlanAprobadoIver = new Ext.data.Store({
            url: 'getPlanAprobado',
            reader: new Ext.data.JsonReader({
                root: "data",
                id: 'idinversion'
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
