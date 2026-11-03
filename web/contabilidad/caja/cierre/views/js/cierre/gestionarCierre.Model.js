Ext.ns('Caja.Operaciones.Cierre');
Caja.Operaciones.Cierre.Model = {
    init: function (cargaInicial) {
        this.stCierre = new Ext.data.GroupingStore({
            reader: new Ext.data.JsonReader({},
                [{
                    name: 'nombre'
                }, {
                    name: 'texto'
                }
                ]),
            sortInfo: {
                field: "nombre",
                direction: "ASC"
            },
            groupField: 'texto'
        });

        this.stCajaFondo = new Ext.data.GroupingStore({
            url: 'cargarcajas',
            reader: new Ext.data.JsonReader({
                    totalProperty: 'cant',
                    root: 'datos'
                },
                [{
                    name: 'idcaja'
                }, {
                    name: 'caja'
                }, {
                    name: 'idfondo'
                }, {
                    name: 'idcajafondo'
                }, {
                    name: 'codigo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'arqueocierre'
                }, {
                    name: 'saldocuenta'
                }, {
                    name: 'saldofondo'
                }, {
                    name: 'nomcuenta'
                }, {
                    name: 'codigoiso'
                }/*, {
                    name: 'cerrado'
                }*/
                ]),
            baseParams: {
                cargaInicial: cargaInicial
            },
            sortInfo: {
                field: "caja",
                direction: "ASC"
            },
            groupField: 'caja'
        });
    }
};