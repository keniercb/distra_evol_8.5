Ext.ns('Gestionar.Nomenclador.Inversiones');

Gestionar.Nomenclador.Inversiones.Modelo = {
    init: function() {
        _this = this;


        _this.store_gestionar_inversiones = new Ext.data.Store({
            url: 'cargarDatosNomInversion',
            reader: new Ext.data.JsonReader({
                id: 'iddatosnomenclador',
                root: 'data',
                totalProperty: 'total'

            },
            [{
                    name: 'denominacion'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'color'
                }, {
                    name: 'iddatosnomenclador'
                }, {
                    name: 'uso'
                }])
        });

        _this.loaderTreeNomencladores = new Ext.tree.TreeLoader({
            dataUrl: 'cargarTreeNomencladores',
            autoLoad: true,
            listeners: {
                beforeload: function(tree, node, res) {
                    tree.baseParams.valor = Ext.getCmp('idfiltroent').getValue();
                }
            }
        });

        _this.loaderDatosNomencl = new Ext.tree.TreeLoader({
            dataUrl: 'cargarDatosNomencladores',
            autoLoad: true


        });


    }
};