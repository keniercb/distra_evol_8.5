Ext.namespace('Ext.GestionarTarjetaAddLiq');
Ext.GestionarTarjetaAddLiq.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.GestionarTarjetaAddLiq.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
    },
    initializeRecords: function () {

        this.recordOperacion = new Ext.data.Record.create([
            {name: 'idnomoperaciones'},
            {name: 'denominacion'}
        ]);

        this.recordCuenta = new Ext.data.Record.create([
            {name: 'idcuenta'},
            {name: 'text'},
            {name: 'idmoneda'},
            {name: 'codigoiso'}
        ]);

        this.recordGridLiquidacionFincimex = new Ext.data.Record.create([
            {name: 'idsync', mapping: 'idsync'},
            {name: 'idtarjeta', mapping: 'idtarjeta'},
            {name: 'idcuentatarjeta', mapping: 'idcuentatarjeta'},
            {name: 'idoperacionfincimex', mapping: 'idoperacionrecarga'},
            {name: 'numerotarjeta', mapping: 'numero'},
            {name: 'idpersona', mapping: 'idpersona'},
            {name: 'nompersona', mapping: 'nompersona'},
            {name: 'saldoanticipo', mapping: 'saldomo'},//saldo del anticipo pa saber cuanto puedo liquidar
            {name: 'importeliquidadomb', mapping: 'importeliquidadomb'},//importe liquidado
            {name: 'preciocombustible', mapping: 'preciocombustible', type: 'float'},
            {name: 'nomcombustible', mapping: 'nomcombustible'},
            {name: 'importe', mapping: 'importe', type: 'float', defaultValue: 0},
            {name: 'fechaliq', mapping: 'fechaoperacion'},//en bd fincimex
            {name: 'idmovimiento', mapping: 'idmovimiento', defaultValue: -1},//pa modificar los anticipos porque con eso lo hacen
            {name: 'iddocumento', mapping: 'iddocumento'},
            {name: 'idcuentagasto', mapping: 'idcuentagasto'},
            {name: 'idmonedacuentagasto', mapping: 'idmonedacuentagasto'},
            {name: 'nomcuentagasto', mapping: 'nomcuentagasto'},
            {name: 'chip', mapping: 'chip'}
        ]);

    },
    initializeReaders: function () {

        this.rdOperacion = new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'cantidad_filas'
            },
            this.recordOperacion
        );

        this.rdCuenta = new Ext.data.JsonReader({
                root: 'datos'
            },
            this.recordCuenta
        );

        this.rdGridLiquidacionFincimex = new Ext.data.JsonReader({
                // root: 'data',
                totalProperty: 'total'
            },
            this.recordGridLiquidacionFincimex
        );

    },
    initializeStores: function () {

        this.stOperacion = new Ext.data.Store({
            url: '/contabilidad/caja/tarjetas/index.php/anticipos/cargarOperaciones',
            reader: this.rdOperacion,
            autoLoad: false,
        });

        this.stCuenta = new Ext.data.Store({
            url: 'cargarCuentaGasto',
            autoLoad: false,
            reader: this.rdCuenta
        });

        this.stGridLiquidacionFincimex = new Ext.data.GroupingStore({
            url: 'cargarDatosLiquidacionFincimex',
            method: 'POST',
            reader: this.rdGridLiquidacionFincimex,
            autoLoad: false,
            groupField: 'numerotarjeta',
            sortInfo: {field: 'fechaliq', direction: 'DESC'}
        });

    },
    initializeGetFn: function () {

        this.getStoreOperacion = function () {
            return this.stOperacion;
        };

        this.getStoreCuenta = function () {
            return this.stCuenta;
        };

        this.getStoreGridLiquidacionFincimex = function () {
            return this.stGridLiquidacionFincimex;
        };

        this.getRecordGridLiquidacionFincimex = function () {
            return this.recordGridLiquidacionFincimex;
        };

    }
});
