Ext.ns('Copa.Configuracion.CondicionPago');
Copa.Configuracion.CondicionPago.Model = {
    init: function() {
        this.payConditionStore = new Ext.data.JsonStore({
            url: 'cargarCondicionesPago',
            autoLoad: true,
            root: 'data',
            totalProperty: "total",
            fields: [
                {
                    name: 'idcondicionpago'
                }, {
                    name: 'dpp'
                }, {
                    name: 'mora'
                }, {
                    name: 'plazo'
                }, {
                    name: 'activo'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'usado'
                }
            ]
        });
    }
};