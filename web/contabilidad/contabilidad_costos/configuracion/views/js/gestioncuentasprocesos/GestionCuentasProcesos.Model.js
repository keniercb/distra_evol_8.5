Ext.ns('Costo.Procesos.Nomencladores');
Costo.Procesos.Nomencladores.Model = {
    init: function () {
        this.storeSubCuentas = new Ext.data.JsonStore({
            url: 'getSubcuentasByDataFather',
            root: 'data',
            totalProperty: 'total',
            fields: [
                {
                    name: 'idcuenta'
                },

                {
                    name: 'concatcta',
                    type: 'string'
                },

                {
                    name: 'descripcion',
                    type: 'string'
                }
            ]
        });

    }
}