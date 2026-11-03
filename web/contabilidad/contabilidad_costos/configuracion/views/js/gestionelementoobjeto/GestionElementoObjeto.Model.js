Ext.ns('Costo.Procesos.Nomencladores.GestEGOG');
Costo.Procesos.Nomencladores.GestEGOG.Model = {
    init: function() {
        this.stEstado = new Ext.data.Store({
            url: 'cargarEstadosAll',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                id: 'idestado'
            },
            [{
                    name: 'idestado',
                    type: 'int'
                }, {
                    name: 'descripcion',
                    type: 'string'
                }]),
            sortInfo: {
                field: 'idestado',
                direction: 'ASC'
            }
        });

        this.stFormato = new Ext.data.Store({
            url: '/contabilidad/contabilidad_costos/configuracion/index.php/gestionelementoobjeto/cargarFormatosAll',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                id: 'idformato'
            },
            [{
                    name: 'idformato',
                    type: 'int'
                }, {
                    name: 'nombre',
                    type: 'string'
                }]),
            sortInfo: {
                field: 'idformato',
                direction: 'ASC'
            }
        });

    }
}