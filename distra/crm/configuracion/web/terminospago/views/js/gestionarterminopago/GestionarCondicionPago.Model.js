Ext.ns('Copa.Configuracion.CondicionPago');
Copa.Configuracion.CondicionPago.Model = {
    init: function() {
        this.payConditionStore = new Ext.data.JsonStore({
            url: 'cargarCondcionPago',
            autoLoad: true,
            root: 'data',
            totalProperty: "total",
            fields: [
                {
                    name: 'idterminodepago'
                }, {
                    name: 'aplazos'
                }, {
                    name: 'dpp'
                }, {
                    name: 'mora'
                }, {
                    name: 'plazo'
                }, {
                    name: 'descventa'
                }, {
                    name: 'predeterminado'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'nombre'
                }, {
                    name: 'usado'
                }, {
                    name: 'construirMora'
                }, {
                    name: 'construirDpp'
                }, {
                    name: 'construirDV'
                }, {
                    name: 'construirCuotas'
                },{
                    name: 'enuso'    
                }
            ]
        });

        this.payMoraStore = new Ext.data.JsonStore({
            url: 'cargarMora',
            autoLoad: false,
            fields: [
                {
                    name: 'idMora',
                    mapping: 'idmora'
                }, {
                    name: 'prcentaje',
                    mapping: 'porciento'
                }, {
                    name: 'aplicabledespues',
                    mapping: 'dias'
                }
            ]
        });

        this.payCuotasStore = new Ext.data.JsonStore({
            url: 'cargarCuotas',
            autoLoad: false,
            fields: [
                {
                    name: 'idPlazo',
                    mapping: 'idcuota'
                }, {
                    name: 'idterminodepago'
                }, {
                    name: 'nombre'
                }, {
                    name: 'prcentajePlazo',
                    mapping: 'porciento'
                }, {
                    name: 'fecha',
                    type: 'date',
                    dateFormat: 'n/j/Y'
                }
            ]
        });

        this.payDescVentaStore = new Ext.data.JsonStore({
            url: 'cargarDescuentos',
            autoLoad: false,
            fields: [
                {
                    name: 'idDescVenta',
                    mapping: 'iddescuentosventa'
                }, {
                    name: 'porciento'
                }, {
                    name: 'cantMinima',
                    mapping: 'min'
                }, {
                    name: 'cantMaxima',
                    mapping: 'max'
                }
            ]
        });

        this.payDPPStore = new Ext.data.JsonStore({
            url: 'cargarDescuentos',
            autoLoad: false,
            fields: [
                {
                    name: 'idDPP',
                    mapping: 'iddpp'
                }, {
                    name: 'porciento'
                }, {
                    name: 'antesde',
                    mapping: 'dias'
                }
            ]
        });

        this.payStore = new Ext.data.SimpleStore({
            fields: ['id', 'denominacion'],
            data: [
                ['1', 'Día(s)'],
                ['2', 'Semana(s)'],
                ['3', 'Mes(es)'],
                ['4', 'Año(s)'],
            ]
        });

        this.payCondcionPagoStore = new Ext.data.JsonStore({
            url: 'cargarCondcionPagoCombo',
            //autoLoad: true,
            root: 'data',
            totalProperty: "total",
            fields: [
                {
                    name: 'idterminodepago'//,
                    //mapping: 'idterminoaplicable'
                }, {
                    name: 'nombre'
                }
            ]
        });
    }
};