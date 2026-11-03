//Empaquetando el componente Ctabancaria.
Ext.ns('Analisis.Store');

//Controller del componente Ctabancaria.
Analisis.Store.Model = {
    /**
     * Inicializar el modelo de la vista.
     */
    init:function () {
        this.store_analisis = new Ext.data.Store({
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
            }
            ]),
            autoLoad: true
        });
    }
};