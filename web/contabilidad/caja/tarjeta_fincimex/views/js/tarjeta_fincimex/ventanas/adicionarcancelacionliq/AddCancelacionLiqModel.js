Ext.namespace('Ext.GestionarTarjetaAddCanLiq');
Ext.GestionarTarjetaAddCanLiq.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.GestionarTarjetaAddCanLiq.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
    },
    initializeRecords: function () {

        this.recordGridCancelarLiquidacionFincimex = new Ext.data.Record.create([
            {name: 'idsync', mapping: 'idsync'},
            {name: 'idtarjeta', mapping: 'idtarjeta'},
            {name: 'numerotarjeta', mapping: 'numero'},
            {name: 'idpersona', mapping: 'idrecibe'},
            {name: 'nompersona', mapping: 'nompersona'},
            {name: 'importeant', mapping: 'importemo'},// importe del mov
            {name: 'importeliq', mapping: 'liquidadomo'},// importe liquidado
            {name: 'fecha', mapping: 'fecha'},
            {name: 'idoperacion', mapping: 'idoperacion'},
            {name: 'preciocombustible', mapping: 'preciocombustible', type: 'float'},
            {name: 'nomcombustible', mapping: 'nomcombustible'},
            {name: 'idestado', mapping: 'idestado'},
            {name: 'numerodocumento', mapping: 'numerodocumento'},
            {name: 'iddocumento', mapping: 'iddocumento'},
            {name: 'idmovimiento', mapping: 'idmovimiento'}
        ]);

    },
    initializeReaders: function () {

        this.rdGridCancelarLiquidacionFincimex = new Ext.data.JsonReader({
                // root: 'data',
                totalProperty: 'total'
            },
            this.recordGridCancelarLiquidacionFincimex
        );

    },
    initializeStores: function () {

        this.stGridCancelarLiquidacionFincimex = new Ext.data.GroupingStore({
            url: 'cargarDatosCancelarLiquidacionFincimex',
            method: 'POST',
            reader: this.rdGridCancelarLiquidacionFincimex,
            autoLoad: false,
            groupField: 'numerotarjeta',
            sortInfo: {field: 'fecha', direction: 'DESC'}
        });

    },
    initializeGetFn: function () {

        this.getStoreGridCancelarLiquidacionFincimex = function () {
            return this.stGridCancelarLiquidacionFincimex;
        };

        this.getRecordGridCancelarLiquidacionFincimex = function () {
            return this.recordGridCancelarLiquidacionFincimex;
        };

    }
});
