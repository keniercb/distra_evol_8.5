Ext.ns('Gestionar.trazasinversiones');

Gestionar.trazasinversiones.Modelo = {
    init: function() {
        var vista = Gestionar.trazasinversiones.Vista;
        _this = this;

        this.stTrazasInversiones = new Ext.data.Store({
            url: 'getTrazasInversiones',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                    name: 'idtrazasinversiones'
                },{
                    name: 'estructura'
                },{
                    name: 'inversion'
                }, {
                    name: 'componente'
                }, {
                    name: 'tabla'
                }, {
                    name: 'idinversion'
                }, {
                    name: 'accion'
                },{
                    name: 'denominacion'
                },{
                    name: 'descripcion'
                },{
                    name: 'usuario'
                },{
                    name: 'fecha'
                }
            ]),
            listeners: {
                beforeload: function(t, n) {
                    t.baseParams.start = paginado;
                  
                }
            }

        });
    }
};