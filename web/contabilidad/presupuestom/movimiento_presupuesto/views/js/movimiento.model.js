//Empaquetando el componente Ctabancaria.
Ext.ns('Movimiento.Store');

//Controller del componente Ctabancaria.
Movimiento.Store.Model = {
    /**
     * Inicializar el modelo de la vista.
     */
    init:function () {
        this.store_desagregacion = new Ext.data.Store({
            url: 'cargarmovimiento',
            baseParams: {
                start:0,
                limit: 30,
            },
            scope: this,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [{
                name: 'iddesagregacion'
            },{
                name: 'operacion'
            }, {
                name: 'unidadm'
            }, {
                name: 'grupo'
            }, {
                name: 'especialidad'
            }, {
                name: 'partida'
            }, {
                name: 'importe'
            }
            ]),
            autoLoad: true
        });
    }
};