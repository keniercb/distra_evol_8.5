//Empaquetando el componente Ctabancaria.
Ext.ns('Presupuesto.Store');

//Controller del componente Ctabancaria.
Presupuesto.Store.Model = {
    /**
     * Inicializar el modelo de la vista.
     */
    init:function () {
        this.store_centro_costo = new Ext.data.Store({
            url: 'cargarcentrocosto',
            scope: this,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [{
                name: 'idcentrogrupo'
            },{
                name: 'descripcioncentrogrupo'
            }, {
                name: 'codigocentrogrupo'
            },{
                name: 'idcuenta'
            }
            ]),
            autoLoad: true
        });
    }
};