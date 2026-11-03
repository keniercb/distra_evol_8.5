Ext.namespace('Ext.ClassLiquidarPorCliente.AddLiq');
Ext.ClassLiquidarPorCliente.AddLiq.Model = Ext.extend(Ext.Component, {
    constructor: function(params)
    {
        Ext.apply(this, params);
        this.initializeModel();
        Ext.ClassLiquidarPorCliente.AddLiq.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
        this.initializeAjaxCalls();
    },
    initializeRecords: function () {

        var record = [
            {name: 'idcuentacontrapartida'},
            {name: 'importependiente'},
            {name: 'idmoneda'},
            {name: 'codigoiso'},
            {name: 'fechaemision'},
            {name: 'numero'},
            {name: 'idtipodocumento'},
            {name: 'denominacion'},
            {name: 'idcuenta'},
            {name: 'concatcta'},
            {name: 'idderechouobligacion'},
            {name: 'idclienteproveedorfiscal'},
            {name: 'clienteproveedor'},
            {name: 'idliquidacion'},
            {name: 'noperacionenzona'},
            {name: 'referenciaext'},
            {name: 'importealiquidar', type: 'float', mapping: 'importependiente'},
        ];

        this.recordLiquidar = Ext.data.Record.create(record);
        this.recordBuscarLiquidar = Ext.data.Record.create(record);

    },
    initializeReaders: function () {

        this.rdGridBuscarLiquidar = new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad_filas',
                id: 'idderechouobligacion'
            },
            this.recordBuscarLiquidar
        );

        this.rdGridLiquidar = new Ext.data.JsonReader({
                // root: 'datos',
                // totalProperty: 'cantidad_filas'
                id: 'idderechouobligacion'
            },
            this.recordLiquidar
        );

    },
    initializeStores: function () {

        this.stBuscarLiquidar = new Ext.data.GroupingStore({
            url: 'loadDataDuoByClienteProveedor',
            baseParams: this.baseParams,
            groupField: 'clienteproveedor',
            reader: this.rdGridBuscarLiquidar,
            sortInfo: {field: 'fechaemision', direction: 'ASC'},
            // autoLoad: true
            // sortInfo: {field: 'idderechouobligacion', direction: 'ASC'}
        });

        this.stLiquidar = new Ext.data.GroupingStore({
            // url: 'loadDataDuoByClienteProveedor',
            // baseParams: {
            //     tipoDuo: this.tipoDuo
            // },
            groupField: 'clienteproveedor',
            reader: this.rdGridLiquidar,
            sortInfo: {field: 'fechaemision', direction: 'ASC'}
            // sortInfo: {field: 'idderechouobligacion', direction: 'ASC'}
        });

    },
    initializeGetFn: function () {

        this.getStoreGridLiquidar = function () {
            return this.stLiquidar;
        };

        this.getStoreGridBuscarLiquidar = function () {
            return this.stBuscarLiquidar;
        };

    },
    initializeAjaxCalls: function () {

        this.cargarOperacionYCuentas = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cargarOperaciones",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

    },
    ajaxCall: function (parametros, parametrosAdicionales) {
        if (typeof parametrosAdicionales === 'object') {
            Ext.applyIf(parametros, parametrosAdicionales);
        }
        Ext.Ajax.request(parametros);
    }
});
