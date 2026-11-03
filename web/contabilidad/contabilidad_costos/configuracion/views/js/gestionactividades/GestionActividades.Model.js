Ext.ns('Costo.Procesos.Nomencladores.GestAct');
Costo.Procesos.Nomencladores.GestAct.Model = {
    init: function() {
        this.stTipo = new Ext.data.Store({
            url: '/contabilidad/contabilidad_costos/configuracion/index.php/gestionactividades/cargarTipos',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                id: 'idtipo'
            },
            [{
                    name: 'idtipo'
                }, {
                    name: 'descripcion',
                    type: 'string'
                }]),
            sortInfo: {
                field: 'idtipo',
                direction: 'ASC'
            }
        });


        this.stactividades = new Ext.data.Store({
            url: '/contabilidad/contabilidad_costos/configuracion/index.php/gestionactividades/cargarActividades',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                id: 'idtipoactividad'
            },
            [
                {
                    name: 'idtipoactividad'
                }, {
                    name: 'codigo'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'idtipo'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'estado'
                }
            ]),
            sortInfo: {
                field: 'codigo',
                direction: 'ASC'
            }
        });

    }
};